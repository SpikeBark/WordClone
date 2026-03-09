import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { Paragraph } from '../../types/outline';

interface WriterCenterPanelProps {
  paragraph: Paragraph | null;
  onContentChange: (content: string) => void;
  onMarkComplete: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export default function WriterCenterPanel({
  paragraph,
  onContentChange,
  onMarkComplete,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: WriterCenterPanelProps) {
  if (!paragraph) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Select a paragraph to start writing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {paragraph.title || 'Untitled Paragraph'}
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              paragraph.status === 'empty'
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                : paragraph.status === 'draft'
                ? 'bg-yellow-200 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                : 'bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200'
            }`}
          >
            {paragraph.status.charAt(0).toUpperCase() + paragraph.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Writing Area */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          <textarea
            value={paragraph.content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Start writing this paragraph..."
            className="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base leading-relaxed"
          />
        </div>
      </div>

      {/* Footer - Navigation and Actions */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Navigation */}
          <div className="flex items-center gap-3">
            <button
              onClick={onPrevious}
              disabled={!hasPrevious}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={onNext}
              disabled={!hasNext}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mark Complete */}
          <button
            onClick={onMarkComplete}
            disabled={paragraph.status === 'complete'}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Check className="w-4 h-4" />
            Mark Complete
          </button>
        </div>
      </div>
    </div>
  );
}
