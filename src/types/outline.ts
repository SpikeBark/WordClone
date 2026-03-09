export interface Paragraph {
  id: string;
  title: string;
  notes: string;
  order: number;
}

export interface Section {
  id: string;
  title: string;
  notes: string;
  paragraphs: Paragraph[];
}

export interface Outline {
  title: string;
  sections: Section[];
}

export interface BubbleNode {
  id: string;
  type: 'section' | 'paragraph';
  title: string;
  notes: string;
  sectionId?: string; // For paragraphs, the section they belong to
  order?: number; // For paragraphs
}

export interface BubbleEdge {
  id: string;
  source: string;
  target: string;
}
