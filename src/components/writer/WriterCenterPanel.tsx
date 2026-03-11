import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { Paragraph } from '../../types/outline';
import { useMemo, useRef } from 'react';
import ParagraphToolbar from '../ParagraphToolbar';

interface WriterCenterPanelProps {
  paragraph: Paragraph | null;
  onContentChange: (content: string) => void;
  onSelectionChange: (selectedText: string) => void;
  onReviewParagraph: () => void;
  isReviewing: boolean;
  onMarkComplete: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export default function WriterCenterPanel({
  paragraph,
  onContentChange,
  onSelectionChange,
  onReviewParagraph,
  isReviewing,
  onMarkComplete,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: WriterCenterPanelProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const noteBySelection = useMemo(() => {
    const map = new Map<string, string>();
    (paragraph?.selectionNotes ?? []).forEach((entry) => {
      if (!map.has(entry.selectedText)) {
        map.set(entry.selectedText, entry.note);
      }
    });
    return map;
  }, [paragraph?.selectionNotes]);

  const escapedText = useMemo(() => {
    return paragraph?.content
      ? paragraph.content
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
      : '';
  }, [paragraph?.content]);

  const highlightedPreview = useMemo(() => {
    if (!escapedText) return '';

    const entries = Array.from(noteBySelection.entries())
      .filter(([selectedText]) => selectedText)
      .sort((a, b) => b[0].length - a[0].length);

    if (entries.length === 0) return escapedText;

    let output = escapedText;
    entries.forEach(([selectedText, note]) => {
      const escapedSelected = selectedText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const safeNote = note
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
      output = output.replace(
        new RegExp(escapedSelected, 'g'),
        `<mark class="bg-yellow-200 dark:bg-yellow-700/60 rounded px-0.5" title="${safeNote}">$&</mark>`
      );
    });

    return output;
  }, [escapedText, noteBySelection]);

  const updateSelection = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const selection = ta.value.slice(ta.selectionStart, ta.selectionEnd);
    onSelectionChange(selection);
  };

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
      {/* Slim paragraph context row */}
      <div className="bg-white/95 dark:bg-gray-800/95 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
            {paragraph.title || 'Untitled Paragraph'}
          </h2>
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
      <div className="flex-1 overflow-auto p-4 md:p-5">
        <div className="max-w-4xl mx-auto h-full">
          {/* Paragraph toolbar (sticky within this scroll container) */}
          <ParagraphToolbar
            textareaRef={textareaRef}
            onChange={(val) => onContentChange(val)}
          />
          <textarea
            ref={textareaRef}
            value={paragraph.content}
            onChange={(e) => onContentChange(e.target.value)}
            onSelect={updateSelection}
            onKeyUp={updateSelection}
            onMouseUp={updateSelection}
            placeholder="Start writing this paragraph..."
            className="w-full min-h-[28rem] h-[60vh] px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-base leading-relaxed"
          />

          {(paragraph.selectionNotes?.length ?? 0) > 0 && (
            <div className="mt-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Note Hover Preview
              </p>
              <p
                className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed"
                // Render highlighted note-linked text spans with browser title tooltip on hover.
                dangerouslySetInnerHTML={{ __html: highlightedPreview }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer - Navigation and Actions */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
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

          <div className="flex items-center gap-2">
            <button
              onClick={onReviewParagraph}
              disabled={isReviewing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isReviewing ? 'Reviewing...' : 'Review Paragraph'}
            </button>

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
    </div>
  );
}
