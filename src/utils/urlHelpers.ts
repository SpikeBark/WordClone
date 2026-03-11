export type UrlStatus = 'valid' | 'dead' | 'unknown';

function timeoutPromise<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('timeout')), ms);
    p.then((v) => {
      clearTimeout(id);
      resolve(v);
    }, (err) => {
      clearTimeout(id);
      reject(err);
    });
  });
}

export async function validateUrl(url: string, timeout = 5000): Promise<UrlStatus> {
  try {
    // Prefer HEAD to avoid loading bodies, fallback to GET if server disallows HEAD.
    const head = fetch(url, { method: 'HEAD', mode: 'cors' });
    const res = await timeoutPromise(head, timeout);
    if (res && 'ok' in res) {
      // @ts-ignore
      return res.ok ? 'valid' : 'dead';
    }
    return 'unknown';
  } catch (err: any) {
    // If HEAD fails (some servers), try GET quickly
    try {
      const get = fetch(url, { method: 'GET', mode: 'cors' });
      const res2 = await timeoutPromise(get, timeout);
      if (res2 && 'ok' in res2) {
        // @ts-ignore
        return res2.ok ? 'valid' : 'dead';
      }
      return 'unknown';
    } catch (err2: any) {
      // Distinguish network/CORS vs explicit 404 by message
      const msg = String(err2?.message ?? err?.message ?? '').toLowerCase();
      if (msg.includes('failed to fetch') || msg.includes('network')) return 'unknown';
      return 'dead';
    }
  }
}

export function makeSearchAlternatives(query: string): string[] {
  const q = encodeURIComponent(query.trim());
  return [`https://scholar.google.com/scholar?q=${q}`];
}
