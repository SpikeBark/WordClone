import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import type { Paragraph, Point } from '../../types/outline';

interface OutlineRightPanelProps {
  selectedBubble: {
    type: 'paragraph' | 'point';
    data: Paragraph | Point;
  } | null;
  onUpdate: (bubbleId: string, update: { title?: string; notes?: string }) => void;
  onDelete: (bubbleId: string) => void;
}

export default function OutlineRightPanel({
  selectedBubble,
  onUpdate,
  onDelete,
}: OutlineRightPanelProps) {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (selectedBubble) {
      setTitle(selectedBubble.data.title);
      setNotes(selectedBubble.data.notes);
    }
  }, [selectedBubble]);

  if (!selectedBubble) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Select a paragraph or point to edit
        </p>
      </div>
    );
  }

  const handleSave = () => {
    onUpdate(selectedBubble.data.id, { title, notes });
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Delete this ${selectedBubble.type}? This action cannot be undone.`
      )
    ) {
      onDelete(selectedBubble.data.id);
    }
  };

  const isParagraphType = selectedBubble.type === 'paragraph';

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 capitalize">
          {selectedBubble.type} Details
        </h3>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter title..."
          />
        </div>

        {/* Notes Input */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Notes & Ideas
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleSave}
            placeholder={
              isParagraphType
                ? 'Add paragraph notes, key themes, or structure notes...'
                : 'Add point ideas, arguments, evidence, or references...'
            }
            className="w-full h-48 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
          />
        </div>

        {/* Metadata */}
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <p>
            <span className="font-medium">Type:</span> {selectedBubble.type}
          </p>
          <p>
            <span className="font-medium">ID:</span>{' '}
            <code className="text-xs bg-gray-200 dark:bg-gray-600 px-1 rounded">
              {selectedBubble.data.id}
            </code>
          </p>
          <p>
            <span className="font-medium">Order:</span>{' '}
            {selectedBubble.data.order}
          </p>
        </div>
      </div>

      {/* Footer - Delete Button */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition"
        >
          <Trash2 className="w-4 h-4" />
          Delete {selectedBubble.type}
        </button>
      </div>
    </div>
  );
}
