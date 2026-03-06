import { Editor } from '@tiptap/react';

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
      className={`px-2 py-1.5 rounded text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        isActive
          ? 'bg-blue-100 text-blue-700 border border-blue-300'
          : 'text-gray-700 hover:bg-gray-100 border border-transparent'
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-gray-300 mx-1 self-center" />;
}

export default function Toolbar({ editor }: ToolbarProps) {
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
    <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-white border-b border-gray-200 sticky top-0 z-10">
      {/* Undo / Redo */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        title="Undo (Ctrl+Z)"
      >
        ↩
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        title="Redo (Ctrl+Y)"
      >
        ↪
      </ToolbarButton>

      <Divider />

      {/* Headings dropdown */}
      <select
        value={currentHeading?.value ?? 'paragraph'}
        onChange={(e) => {
          const val = e.target.value;
          applyHeading(val === 'paragraph' ? 'paragraph' : (Number(val) as HeadingLevel));
        }}
        className="px-2 py-1.5 rounded text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
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
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic (Ctrl+I)"
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        title="Underline (Ctrl+U)"
      >
        <span className="underline">U</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Strikethrough"
      >
        <span className="line-through">S</span>
      </ToolbarButton>

      <Divider />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet list"
      >
        • List
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Numbered list"
      >
        1. List
      </ToolbarButton>

      <Divider />

      {/* Text alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        title="Align left"
      >
        ≡←
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        title="Align center"
      >
        ≡↔
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        title="Align right"
      >
        ≡→
      </ToolbarButton>
    </div>
  );
}
