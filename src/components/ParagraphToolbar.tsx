import React from 'react';
import { Bold, Italic, Underline, List, ListOrdered } from 'lucide-react';

interface Props {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onChange: (value: string) => void;
  value: string;
}

function wrapSelection(textarea: HTMLTextAreaElement, before: string, after = before) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const val = textarea.value;
  const selected = val.slice(start, end) || '';
  const newText = val.slice(0, start) + before + selected + after + val.slice(end);
  const newPos = start + before.length + selected.length + after.length;
  textarea.value = newText;
  textarea.selectionStart = textarea.selectionEnd = newPos;
  textarea.focus();
  return newText;
}

export default function ParagraphToolbar({ textareaRef, onChange, value }: Props) {
  const applyWrap = (before: string, after?: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const newText = wrapSelection(ta, before, after);
    onChange(newText);
  };

  const insertBulletList = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const val = ta.value;
    // Insert a bullet at the start of the current line
    const lineStart = val.lastIndexOf('\n', start - 1) + 1;
    const newText = val.slice(0, lineStart) + '- ' + val.slice(lineStart);
    ta.value = newText;
    ta.selectionStart = ta.selectionEnd = start + 2;
    ta.focus();
    onChange(newText);
  };

  const insertNumberedList = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const val = ta.value;
    const lineStart = val.lastIndexOf('\n', start - 1) + 1;
    const newText = val.slice(0, lineStart) + '1. ' + val.slice(lineStart);
    ta.value = newText;
    ta.selectionStart = ta.selectionEnd = start + 3;
    ta.focus();
    onChange(newText);
  };

  return (
    <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 px-2 py-2 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => applyWrap('**')}
          title="Bold"
          className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => applyWrap('_')}
          title="Italic"
          className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => applyWrap('<u>', '</u>')}
          title="Underline"
          className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Underline size={16} />
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

        <button
          type="button"
          onClick={insertBulletList}
          title="Bullet list"
          className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={insertNumberedList}
          title="Numbered list"
          className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ListOrdered size={16} />
        </button>
      </div>
    </div>
  );
}
