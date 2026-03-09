# Bubble Flowchart Outline Editor

A visual document planning system that allows authors to organize their writing as draggable bubbles before starting the actual writing process.

## Overview

The Bubble Flowchart Outline Editor is an interactive canvas-based tool integrated into WordClone that helps writers structure their documents visually. It serves as a bridge between document planning and actual writing.

### Key Features

- **Visual Planning**: See your entire document structure at a glance
- **Drag-and-Drop**: Reorder paragraphs intuitively using drag-and-drop
- **Rich Editing**: Add notes, ideas, and key arguments to each bubble
- **Dynamic Templates**: Auto-generates outline structure based on document type
- **Three-Panel Interface**: 
  - Left Sidebar: Section navigation and document overview
  - Center Canvas: Interactive bubble flowchart with React Flow
  - Right Panel: Detailed editing of selected bubbles

## Architecture

### Components

1. **OutlineEditor** (`src/components/OutlineEditor.tsx`)
   - Main container component
   - Manages outline state and React Flow integration
   - Handles section and paragraph CRUD operations

2. **SectionBubble** (`src/components/outline/SectionBubble.tsx`)
   - React Flow node component for sections
   - Large blue bubble with title, notes, and "Add Paragraph" button
   - Serves as parent container for paragraphs

3. **ParagraphBubble** (`src/components/outline/ParagraphBubble.tsx`)
   - React Flow node component for paragraphs
   - Smaller green bubble connected to section
   - Displays paragraph title and preview of notes

4. **OutlineLeftSidebar** (`src/components/outline/OutlineLeftSidebar.tsx`)
   - Hierarchical section/paragraph navigation
   - Collapsible sections with keyboard-friendly selection
   - Quick access to all bullets in the outline

5. **OutlineRightPanel** (`src/components/outline/OutlineRightPanel.tsx`)
   - Edit details of selected bubble
   - Full multiline notes field
   - Metadata display and delete functionality

### Data Structure

```typescript
interface Outline {
  title: string;
  sections: Section[];
}

interface Section {
  id: string;
  title: string;
  notes: string;
  paragraphs: Paragraph[];
}

interface Paragraph {
  id: string;
  title: string;
  notes: string;
  order: number;
}
```

## Workflow

### 1. Creating a New Document

1. User clicks "Empty document" from home page
2. DocumentSetupModal opens with document configuration:
   - Document type (Essay, Article, Blog Post, etc.)
   - Topic
   - Audience
   - Purpose
   - Tone
   - Length target
3. Document metadata is saved

### 2. Generating Outline

When user clicks "Create", the system:

1. Uses `generateDefaultOutline()` from utilities
2. Looks up outline template based on document type
3. Creates default sections (e.g., for Essay: Introduction, Background, Arguments, Conclusion)
4. Adds 2-3 placeholder paragraphs per section
5. Launches OutlineEditor with auto-generated structure

### 3. Editing the Outline

**Left Sidebar Navigation:**
- Click section name to select and highlight
- Click chevron to expand/collapse paragraphs
- Click paragraph name to select and edit

**Center Canvas:**
- Sections appear as large blue bubbles
- Paragraphs appear as smaller green bubbles connected below sections
- Drag paragraph bubbles to reorder them within sections
- Click any bubble to select it

**Right Panel - Editing:**
- Title field (auto-saves on blur)
- Multiline notes field for ideas, arguments, evidence
- Metadata display (ID, type, order)
- Delete button with confirmation

**Add Content:**
- Click "Add Section" button in header to add new sections
- Click "Add Para" button on section bubble to add paragraphs
- New bubbles appear with default names and can be renamed

### 4. Starting to Write

After planning is complete:
1. Click "Start Writing" button
2. Transitions to text editor
3. Outline structure remains available for reference (can be extended)

## Technical Implementation

### React Flow Integration

- Uses React Flow v12+ for node/edge visualization
- Custom node components for sections and paragraphs
- Smooth edge connections showing hierarchy
- Pan, zoom, and fit-to-view controls included

### State Management

- Outline state lives in App.tsx as `currentOutline`
- OutlineEditor manages local node/edge state via `useNodesState`/`useEdgesState`
- Changes update the outline data structure through callbacks
- Navigation state (home → outline → editor) controlled in App.tsx

### Styling

- Tailwind CSS for all styling
- Dark mode support throughout
- Responsive design with fixed-width panels
- Color-coded bubbles:
  - Sections: Blue gradient (larger)
  - Paragraphs: Green gradient (smaller)
  - Selection highlights with contrasting backgrounds

## File Structure

```
src/
├── components/
│   ├── OutlineEditor.tsx         # Main component
│   └── outline/
│       ├── SectionBubble.tsx     # Section node
│       ├── ParagraphBubble.tsx   # Paragraph node
│       ├── OutlineLeftSidebar.tsx  # Navigation sidebar
│       └── OutlineRightPanel.tsx   # Edit details panel
├── types/
│   └── outline.ts                # Type definitions
├── utils/
│   └── outlineGenerator.ts       # Outline generation logic
└── App.tsx                       # Navigation & state management
```

## Usage Example

```typescript
import OutlineEditor from './components/OutlineEditor';
import { generateDefaultOutline } from './utils/outlineGenerator';

function MyApp() {
  const metadata = {
    document_type: 'Essay',
    topic: 'The Impact of AI on Education',
    audience: 'Academic',
    purpose: 'Analyze',
    tone: 'Formal',
    length_target: '2000+ words',
    deadline: '2026-04-01'
  };

  const outline = generateDefaultOutline('The Impact of AI on Education', metadata);

  return (
    <OutlineEditor
      initialOutline={outline}
      documentMetadata={metadata}
      onBack={() => console.log('Back to home')}
      onStartWriting={() => console.log('Start writing')}
    />
  );
}
```

## Outline Templates

The system includes predefined templates for each document type:

- **Essay**: Introduction → Background → Arguments → Counter-arguments → Conclusion
- **Article**: Headline → Intro → 3 Key Points → Conclusion
- **Blog Post**: Hook → Problem → Solution → Examples → CTA
- **Research Paper**: Abstract → Intro → Literature → Methodology → Results → Discussion → Conclusion
- **Report**: Executive Summary → Intro → Background → Findings → Analysis → Recommendations → Conclusion
- **Story**: Exposition → Rising Action → Climax → Falling Action → Resolution
- **Other**: Introduction → Main Content → Conclusion

## Future Enhancements (Out of Scope for MVP)

- Drag-and-drop paragraphs between sections
- Template customization and saving
- Outline persistence to database/localStorage
- Export outline as PDF or document
- AI suggestions for section/paragraph organization
- Collaborative outline editing
- Version history and undo/redo
- Comments and annotations
- Research links and references

## Accessibility & UX

- Keyboard navigation through sidebar
- Clear visual feedback on selection
- High contrast section/paragraph colors
- Confirmation dialogs before deletions
- Auto-save on blur for text inputs
- Responsive to screen size changes

## Browser Compatibility

Works on all modern browsers with React 19 and ES6 module support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Troubleshooting

### Bubbles not appearing on canvas
- Check browser console for React Flow errors
- Verify nodes array is populated correctly in useEffect
- Ensure reactflow CSS is imported

### Outline not saving changes
- Check that `updateBubble()` is being called with correct ID
- Verify state updates are triggering re-renders
- Check right panel for unsaved edits (auto-save on blur)

### Drag-and-drop not working
- Verify React Flow is initialized with correct props
- Check that paragraph bubbles have `draggable: true` property
- Ensure handle components are properly nested in bubbles
