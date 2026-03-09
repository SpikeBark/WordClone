import type { Outline, Section, Paragraph } from '../types/outline';

export interface DocumentMetadata {
  document_type: string;
  topic: string;
  audience: string;
  purpose: string;
  tone: string;
  length_target: string;
  deadline: string;
}

// Default outline templates based on document type
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

  const sections: Section[] = templates.map((sectionTitle, index) => {
    // Generate 2-3 placeholder paragraphs per section
    const paragraphCount = Math.max(2, Math.ceil(Math.random() * 3));
    const paragraphs: Paragraph[] = [];

    for (let i = 1; i <= paragraphCount; i++) {
      paragraphs.push({
        id: `para-${Date.now()}-${index}-${i}`,
        title: `Point ${i}`,
        notes: '',
        order: i,
      });
    }

    return {
      id: `section-${Date.now()}-${index}`,
      title: sectionTitle,
      notes: `${metadata.purpose} - ${metadata.tone} tone for ${metadata.audience}`,
      paragraphs,
    };
  });

  return {
    title,
    sections,
  };
}
