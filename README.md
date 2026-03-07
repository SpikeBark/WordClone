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
