import type { ResearchSuggestions, ResearchSuggestion } from '../types/outline';

const WEAK_EVIDENCE_PHRASES = [
  'many people',
  'studies show',
  'experts say',
  'research suggests',
  'it is widely known',
];

const WEAK_FEEDBACK_KEYWORDS = [
  'lack',
  'missing',
  'no evidence',
  'no support',
  'no citation',
  'needs',
  'unsupported',
  'without evidence',
  'not supported',
  'no data',
  'no statistics',
  'would benefit',
  'could benefit',
  'should include',
];

function buildResearchSystemPrompt(citationStyle: string): string {
  const hasCitationStyle = citationStyle.trim().length > 0;

  const citationInstruction = hasCitationStyle
    ? `- Format all citations using ${citationStyle} style.`
    : `- Do not include formal citation markup or reference formatting.`;

  return `You are a research assistant helping writers add evidence to their paragraphs.

Given a paragraph and its document topic, generate concise, credible evidence suggestions to strengthen the writing.

Respond strictly in JSON using this structure:
{
  "statistics": [
    {"text": "statistic text", "url": "https://direct-or-search-url"},
    {"text": "optional second statistic", "url": "https://..."}
  ],
  "source": {"text": "source citation", "url": "https://..."},
  "example": "A concrete real-world example related to the claims"
}

Rules:
- Provide 1–3 statistics (at least one, at most three)
${citationInstruction}
- For each statistic include a "url" — use the direct report/page URL if known, otherwise a Google Scholar search URL (https://scholar.google.com/scholar?q=...) or official website URL
- For the source include a "url" — the organization homepage or publication page
- Name one credible academic, institutional, or journalistic source
- Give one concrete, realistic example (no url needed for the example)
- Only cite well-known, credible sources (e.g., Pew Research, WHO, CDC, academic journals, major institutions)
- Do not fabricate specific numbers; use realistic, representative statistics
- Ensure all URLs are well-formed and start with https://`;
}

const DEFAULT_GROQ_MODELS = ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile'];

interface GroqErrorResponse {
  error?: {
    message?: string;
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

function parseResearchSuggestion(raw: unknown): ResearchSuggestion | null {
  if (typeof raw === 'string') {
    return { text: raw.trim() };
  }
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    const text = typeof obj.text === 'string' ? obj.text.trim() : '';
    if (!text) return null;
    const url = typeof obj.url === 'string' && obj.url.trim().startsWith('http')
      ? obj.url.trim()
      : undefined;
    return { text, url };
  }
  return null;
}

function toResearchSuggestions(raw: unknown): ResearchSuggestions {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Invalid research suggestions payload');
  }
  const data = raw as Record<string, unknown>;

  const statistics: ResearchSuggestion[] = Array.isArray(data.statistics)
    ? (data.statistics as unknown[])
        .map(parseResearchSuggestion)
        .filter((s): s is ResearchSuggestion => s !== null && s.text.length > 0)
    : [];

  const sourceParsed = parseResearchSuggestion(data.source);
  const source: ResearchSuggestion = sourceParsed ?? { text: '' };

  const example = typeof data.example === 'string' ? data.example.trim() : '';

  if (statistics.length === 0 || !source.text || !example) {
    throw new Error('Incomplete research suggestions payload');
  }

  return { statistics, source, example };
}

export function containsWeakEvidencePhrases(text: string): boolean {
  const lower = text.toLowerCase();
  return WEAK_EVIDENCE_PHRASES.some((phrase) => lower.includes(phrase));
}

export function evidenceFeedbackIsWeak(evidenceFeedback: string): boolean {
  const lower = evidenceFeedback.toLowerCase();
  return WEAK_FEEDBACK_KEYWORDS.some((keyword) => lower.includes(keyword));
}

export function shouldActivateResearchAssistant(
  paragraphText: string,
  evidenceFeedback: string
): boolean {
  return containsWeakEvidencePhrases(paragraphText) || evidenceFeedbackIsWeak(evidenceFeedback);
}

export async function getResearchSuggestions(
  paragraphText: string,
  documentTopic: string,
  citationStyle: string = ''
): Promise<ResearchSuggestions> {
  const apiKey = normalizeApiKey(
    import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_API_KEY
  );
  if (!apiKey) {
    throw new Error(
      'Missing VITE_GROQ_API_KEY. Add it to .env and restart the Vite dev server.'
    );
  }

  const configuredModel = import.meta.env.VITE_GROQ_MODEL?.trim();
  const models: string[] = configuredModel
    ? [configuredModel, ...DEFAULT_GROQ_MODELS.filter((m) => m !== configuredModel)]
    : DEFAULT_GROQ_MODELS;

  const systemPrompt = buildResearchSystemPrompt(citationStyle);

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
          temperature: 0.4,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemPrompt },
            {
              role: 'user',
              content: JSON.stringify({
                document_topic: documentTopic,
                paragraph_text: paragraphText,
              }),
            },
          ],
        }),
      });

      if (!response.ok) {
        let serverMessage = `Groq request failed with ${response.status}.`;
        try {
          const errorData = (await response.json()) as GroqErrorResponse;
          const msg = errorData.error?.message?.trim();
          if (msg) serverMessage = msg;
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
      return toResearchSuggestions(parsed);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Research request failed.';

      if (/404|model|not found|unsupported|does not exist/i.test(errorMessage)) {
        lastError = new Error(`Model ${model} is unavailable: ${errorMessage.replace(/^Groq API error \(\d+\):\s*/i, '')}`);
        continue;
      }

      if (/network|fetch|load failed|failed to fetch/i.test(errorMessage)) {
        throw new Error(
          'Unable to reach the Groq API. Check your internet connection and any browser extensions blocking requests.'
        );
      }

      if (/429|resource_exhausted|quota/i.test(errorMessage)) {
        throw new Error(`Groq API error (429): ${errorMessage}`);
      }

      throw new Error(errorMessage);
    }
  }

  throw lastError ?? new Error('Research request failed before reaching Groq.');
}
