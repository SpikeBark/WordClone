import type { Outline } from '../types/outline';

/**
 * Assembles the complete document text from the outline structure
 * Combines paragraphs in order
 */
export function assembleDocument(outline: Outline): string {
  const parts: string[] = [];

  // Add document title
  if (outline.title) {
    parts.push(outline.title);
    parts.push(''); // Empty line after title
  }

  // Add all paragraph content in order
  outline.paragraphs
    .sort((a, b) => a.order - b.order)
    .forEach((paragraph) => {
      if (paragraph.content && paragraph.content.trim()) {
        parts.push(paragraph.content.trim());
        parts.push(''); // Empty line between paragraphs
      }
    });

  return parts.join('\n').trim();
}

/**
 * Calculate writing progress statistics
 */
export function getWritingProgress(outline: Outline) {
  let total = 0;
  let empty = 0;
  let draft = 0;
  let complete = 0;

  outline.paragraphs.forEach((paragraph) => {
    total++;
    if (paragraph.status === 'empty') empty++;
    else if (paragraph.status === 'draft') draft++;
    else if (paragraph.status === 'complete') complete++;
  });

  return {
    total,
    empty,
    draft,
    complete,
    percentComplete: total > 0 ? Math.round((complete / total) * 100) : 0,
  };
}
