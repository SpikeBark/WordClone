import type {
  ParagraphFeedback,
  ParagraphFeedbackRequest,
} from '../types/outline';

const FEEDBACK_SYSTEM_PROMPT = `You are a writing mentor reviewing a single paragraph.

Your job is to analyze the paragraph and give feedback to help the writer improve their work. You must NOT rewrite the paragraph or generate replacement text.

Evaluate the paragraph in four categories:

1. Clarity - Is the paragraph easy to understand?
2. Focus - Does the paragraph match its intended goal?
3. Evidence - Does the paragraph need examples, statistics, or support?
4. Flow - Does the paragraph logically connect to the section topic?

Return concise feedback for each category.

Respond strictly in JSON using this structure:
{
  "clarity": "",
  "focus": "",
  "evidence": "",
  "flow": ""
}

Do not include rewritten sentences or full paragraph suggestions.`;

const DEFAULT_GROQ_MODELS = ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile'];

interface GroqErrorResponse {
  error?: {
    message?: string;
    type?: string;
    code?: string;
  };
}

interface GroqResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
}

function normalizeApiKey(rawValue: string | undefined): string {
  return rawValue?.trim().replace(/^['"]|['"]$/g, '') ?? '';
}

function extractErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Groq request failed.';
  }

  const message = error.message.trim();
  if (!message) {
    return 'Groq request failed.';
  }

  return message;
}

function shouldTryNextModel(message: string): boolean {
  return /404|model|not found|unsupported|does not exist/i.test(message);
}

function extractJsonBlock(text: string): string {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

function toParagraphFeedback(raw: unknown): ParagraphFeedback {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid feedback payload');
  }

  const data = raw as Record<string, unknown>;
  const clarity = typeof data.clarity === 'string' ? data.clarity.trim() : '';
  const focus = typeof data.focus === 'string' ? data.focus.trim() : '';
  const evidence = typeof data.evidence === 'string' ? data.evidence.trim() : '';
  const flow = typeof data.flow === 'string' ? data.flow.trim() : '';

  if (!clarity || !focus || !evidence || !flow) {
    throw new Error('Incomplete feedback payload');
  }

  return { clarity, focus, evidence, flow };
}

export async function reviewParagraphWithAI(
  payload: ParagraphFeedbackRequest
): Promise<ParagraphFeedback> {
  const apiKey = normalizeApiKey(
    import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_API_KEY
  );
  if (!apiKey) {
    throw new Error('Missing VITE_GROQ_API_KEY. Add it to .env and restart the Vite dev server.');
  }

  const configuredModel = import.meta.env.VITE_GROQ_MODEL?.trim();
  let models: string[] = configuredModel
    ? [configuredModel, ...DEFAULT_GROQ_MODELS.filter((m) => m !== configuredModel)]
    : [...DEFAULT_GROQ_MODELS];

  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: FEEDBACK_SYSTEM_PROMPT },
            { role: 'user', content: JSON.stringify(payload, null, 2) },
          ],
        }),
      });

      if (!response.ok) {
        let serverMessage = `Groq request failed with ${response.status}.`;
        try {
          const errorData = (await response.json()) as GroqErrorResponse;
          const msg = errorData.error?.message?.trim();
          if (msg) {
            serverMessage = msg;
          }
        } catch {
          // ignore malformed error bodies
        }

        throw new Error(`Groq API error (${response.status}): ${serverMessage}`);
      }

      const data = (await response.json()) as GroqResponse;
      const modelText = data.choices?.[0]?.message?.content?.trim();

      if (!modelText) {
        throw new Error('Groq returned an empty response.');
      }

      const jsonText = extractJsonBlock(modelText);
      const parsed = JSON.parse(jsonText) as unknown;
      return toParagraphFeedback(parsed);
    } catch (error) {
      const errorMessage = extractErrorMessage(error);

      if (shouldTryNextModel(errorMessage)) {
        lastError = new Error(`Model ${model} is unavailable: ${errorMessage}`);
        continue;
      }

      if (/network|fetch|load failed|failed to fetch/i.test(errorMessage)) {
        throw new Error('Unable to reach the Groq API. Check your internet connection and any browser extensions blocking requests.');
      }

      if (/429|resource_exhausted|quota/i.test(errorMessage)) {
        throw new Error(`Groq API error (429): ${errorMessage}`);
      }

      throw new Error(errorMessage);
    }
  }

  throw lastError ?? new Error('Feedback request failed before reaching Groq.');
}
