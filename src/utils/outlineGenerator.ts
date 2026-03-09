import type { Outline, Paragraph, Point } from '../types/outline';

export interface DocumentMetadata {
  document_type: string;
  topic: string;
  audience: string;
  purpose: string;
  tone: string;
  length_target: string;
  deadline: string;
}

// Default paragraph titles based on document type
const OUTLINE_TEMPLATES: Record<string, string[]> = {
  Essay: [
    'Introduction',
    'Background / Context',
    'Main Argument 1',
    'Main Argument 2',
    'Counter-arguments / Limitations',
    'Conclusion',
  ],
  'Article': [
    'Headline & Summary',
    'Introduction',
    'Key Point 1',
    'Key Point 2',
    'Key Point 3',
    'Conclusion / Call to Action',
  ],
  'Blog Post': [
    'Hook / Opening',
    'Problem Setup',
    'Solution / Main Ideas',
    'Practical Examples',
    'Call to Action',
  ],
  'Research Paper': [
    'Abstract',
    'Introduction',
    'Literature Review',
    'Methodology',
    'Results',
    'Discussion',
    'Conclusion',
    'References',
  ],
  'Report': [
    'Executive Summary',
    'Introduction',
    'Background',
    'Findings',
    'Analysis',
    'Recommendations',
    'Conclusion',
  ],
  'Story': [
    'Exposition',
    'Rising Action',
    'Climax',
    'Falling Action',
    'Resolution',
  ],
  'Other': [
    'Introduction',
    'Main Content',
    'Conclusion',
  ],
};

export function generateDefaultOutline(
  title: string,
  metadata: DocumentMetadata
): Outline {
  const templates = OUTLINE_TEMPLATES[metadata.document_type] || OUTLINE_TEMPLATES['Other'];

  const paragraphs: Paragraph[] = templates.map((paragraphTitle, index) => {
    // Generate 2-4 points per paragraph
    const pointCount = Math.max(2, Math.ceil(Math.random() * 4));
    const points: Point[] = [];

    for (let i = 1; i <= pointCount; i++) {
      points.push({
        id: `point-${Date.now()}-${index}-${i}`,
        title: `Key idea ${i}`,
        notes: '',
        order: i,
      });
    }

    return {
      id: `para-${Date.now()}-${index}`,
      title: paragraphTitle,
      notes: `${metadata.purpose} - ${metadata.tone} tone for ${metadata.audience}`,
      points,
      content: '',
      status: 'empty',
      order: index + 1,
    };
  });

  return {
    title,
    paragraphs,
  };
}
