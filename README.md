# WordClone

A minimal MVP web-based word processor built with React, TypeScript, Vite, TailwindCSS, and TipTap.

## Features

- **Text Formatting**: Bold, Italic, Underline, Strikethrough
- **Headings**: Paragraph, H1, H2, H3 (dropdown selector)
- **Lists**: Bullet list, Numbered list
- **Text Alignment**: Left, Center, Right
- **Editor**: Undo/Redo, keyboard shortcuts, placeholder text ("Start writing...")
- **Toolbar**: All formatting controls in a sticky top toolbar

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+U` | Underline |

## Project Structure

```
/src
  /components
    Editor.tsx    # TipTap editor with all extensions
    Toolbar.tsx   # Formatting toolbar
  App.tsx         # Root component
  main.tsx        # Entry point
  index.css       # Tailwind + TipTap styles
```

## Setup

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```bash
VITE_GROQ_API_KEY=your_groq_api_key_here
VITE_GROQ_MODEL=llama-3.1-8b-instant
```

`VITE_GROQ_API_KEY` is required for the paragraph feedback assistant in the writing screen.

`VITE_GROQ_MODEL` is optional. If you omit it, the app will try `llama-3.1-8b-instant` first and then fall back to `llama-3.3-70b-versatile`.

If you update `.env`, restart the Vite dev server so the browser picks up the new values.

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Tech Stack

- [React](https://react.dev/) – UI framework
- [TypeScript](https://www.typescriptlang.org/) – Type safety
- [Vite](https://vite.dev/) – Build tool and dev server
- [TailwindCSS](https://tailwindcss.com/) – Utility-first CSS
- [TipTap](https://tiptap.dev/) – Rich text editor
