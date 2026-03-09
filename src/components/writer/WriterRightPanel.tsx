import { Lightbulb, CheckCircle } from 'lucide-react';
import type { Paragraph } from '../../types/outline';

interface WriterRightPanelProps {
  paragraph: Paragraph | null;
}

export default function WriterRightPanel({ paragraph }: WriterRightPanelProps) {
  if (!paragraph) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Select a paragraph to view guidance
        </p>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Writing Guidance
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Paragraph Title */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Paragraph
          </label>
          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {paragraph.title || 'Untitled Paragraph'}
          </p>
        </div>

        {/* Key Points to Cover */}
        {paragraph.points.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
              Key Points to Cover
            </label>
            <div className="space-y-3">
              {paragraph.points
                .sort((a, b) => a.order - b.order)
                .map((point) => (
                  <div
                    key={point.id}
                    className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3"
                  >
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {point.title || 'Untitled Point'}
                        </p>
                        {point.notes && (
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {point.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Notes from Planning */}
        {paragraph.notes && (
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
              Planning Notes
            </label>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {paragraph.notes}
              </p>
            </div>
          </div>
        )}

        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Status
          </label>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                paragraph.status === 'empty'
                  ? 'bg-gray-400'
                  : paragraph.status === 'draft'
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {paragraph.status.charAt(0).toUpperCase() + paragraph.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Word Count */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Word Count
          </label>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {paragraph.content
              ? paragraph.content.trim().split(/\s+/).filter(Boolean).length
              : 0}{' '}
            words
          </p>
        </div>

        {/* Tips */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Writing Tips
          </label>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-2">
              <li>• Cover all key points while writing</li>
              <li>• Use the planning notes as a guide</li>
              <li>• Write a complete draft before editing</li>
              <li>• Mark complete when you're ready to move on</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
