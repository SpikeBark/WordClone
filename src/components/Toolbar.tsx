import { useEffect, useReducer } from 'react';
import { Editor } from '@tiptap/react';
import { useTheme } from '../App';
import {
  Undo,
  Redo,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sun,
  Moon,
} from 'lucide-react';

interface ToolbarProps {
  editor: Editor | null;
}

type HeadingLevel = 1 | 2 | 3;

const headingOptions = [
  { label: 'Paragraph', value: 'paragraph' as const },
  { label: 'Heading 1', value: 1 as HeadingLevel },
  { label: 'Heading 2', value: 2 as HeadingLevel },
  { label: 'Heading 3', value: 3 as HeadingLevel },
];

function ToolbarButton({
  onClick,
  isActive,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-2 py-1.5 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 ${
        isActive
          ? 'bg-slate-900 text-white border border-slate-900 dark:bg-slate-100 dark:text-slate-950 dark:border-slate-100'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent'
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />;
}

export default function Toolbar({ editor }: ToolbarProps) {
  const { theme, toggleTheme } = useTheme();
  const [, forceUpdate] = useReducer((value: number) => value + 1, 0);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const rerender = () => {
      forceUpdate();
    };

    editor.on('transaction', rerender);
    editor.on('selectionUpdate', rerender);
    editor.on('focus', rerender);
    editor.on('blur', rerender);

    return () => {
      editor.off('transaction', rerender);
      editor.off('selectionUpdate', rerender);
      editor.off('focus', rerender);
      editor.off('blur', rerender);
    };
  }, [editor]);

  if (!editor) return null;

  const currentHeading = headingOptions.find((opt) => {
    if (opt.value === 'paragraph') return editor.isActive('paragraph');
    return editor.isActive('heading', { level: opt.value });
  });

  function applyHeading(value: 'paragraph' | HeadingLevel) {
    if (!editor) return;
    if (value === 'paragraph') {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level: value }).run();
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      {/* Undo / Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        title="Undo (Ctrl+Z)"
      >
        <Undo size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        title="Redo (Ctrl+Y)"
      >
        <Redo size={16} />
      </ToolbarButton>

      <Divider />

      {/* Headings dropdown */}
      <select
        value={currentHeading?.value ?? 'paragraph'}
        onChange={(e) => {
          const val = e.target.value;
          applyHeading(val === 'paragraph' ? 'paragraph' : (Number(val) as HeadingLevel));
        }}
        className="px-2 py-1.5 rounded text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 cursor-pointer"
        title="Text style"
      >
        {headingOptions.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <Divider />

      {/* Text formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold (Ctrl+B)"
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic (Ctrl+I)"
      >
        <Italic size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        title="Underline (Ctrl+U)"
      >
        <Underline size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Strikethrough"
      >
        <Strikethrough size={16} />
      </ToolbarButton>

      <Divider />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet list"
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Numbered list"
      >
        <ListOrdered size={16} />
      </ToolbarButton>

      <Divider />

      {/* Text alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        title="Align left"
      >
        <AlignLeft size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        title="Align center"
      >
        <AlignCenter size={16} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        title="Align right"
      >
        <AlignRight size={16} />
      </ToolbarButton>

      <Divider />

      {/* Theme toggle */}
      <ToolbarButton
        onClick={toggleTheme}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
      </ToolbarButton>
    </div>
  );
}
