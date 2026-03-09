import type { FC } from 'react';

interface WriterFullPaperModalProps {
  open: boolean;
  onClose: () => void;
  content: string;
}

const WriterFullPaperModal: FC<WriterFullPaperModalProps> = ({ open, onClose, content }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-11/12 max-w-4xl max-h-[80vh] overflow-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Full Paper Preview</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(content);
              }}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-md"
            >
              Copy
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-100">{content}</pre>
        </div>
      </div>
    </div>
  );
};

export default WriterFullPaperModal;
