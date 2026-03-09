export interface Point {
  id: string;
  title: string;
  notes: string;
  order: number;
}

export interface TextSelectionNote {
  id: string;
  selectedText: string;
  note: string;
}

export interface Paragraph {
  id: string;
  title: string;
  notes: string;
  generalNotes?: string[];
  selectionNotes?: TextSelectionNote[];
  points: Point[];
  content: string;
  status: 'empty' | 'draft' | 'complete';
  order: number;
}

export interface Outline {
  title: string;
  paragraphs: Paragraph[];
}

export interface BubbleNode {
  id: string;
  type: 'paragraph' | 'point';
  title: string;
  notes: string;
  paragraphId?: string; // For points, the paragraph they belong to
  order?: number;
}

export interface BubbleEdge {
  id: string;
  source: string;
  target: string;
}
