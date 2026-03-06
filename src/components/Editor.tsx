import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Toolbar from './Toolbar';

export default function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Start writing...',
      }),
    ],
    editorProps: {
      attributes: {
        class:
          'min-h-[calc(100vh-120px)] w-full focus:outline-none text-gray-900 leading-relaxed',
      },
    },
  });

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Toolbar editor={editor} />
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto bg-white shadow-sm min-h-full my-6 rounded-lg">
          <EditorContent
            editor={editor}
            className="px-12 py-10 text-base"
          />
        </div>
      </div>
    </div>
  );
}
