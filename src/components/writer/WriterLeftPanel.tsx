import { useState } from 'react';
import { ChevronDown, ChevronRight, Circle, CircleDot, CheckCircle, FileText } from 'lucide-react';
import type { Outline } from '../../types/outline';
import WriterFullPaperModal from './WriterFullPaperModal';
import { assembleDocument } from '../../utils/documentAssembler';

interface WriterLeftPanelProps {
  outline: Outline;
  selectedParagraphId: string | null;
  onSelectParagraph: (paragraphId: string) => void;
}

export default function WriterLeftPanel({
  outline,
  selectedParagraphId,
  onSelectParagraph,
}: WriterLeftPanelProps) {
  const [expandedParagraphs, setExpandedParagraphs] = useState<Set<string>>(new Set());
  const [showFullPaper, setShowFullPaper] = useState(false);

  const toggleParagraph = (paragraphId: string) => {
    const newExpanded = new Set(expandedParagraphs);
    if (newExpanded.has(paragraphId)) {
      newExpanded.delete(paragraphId);
    } else {
      newExpanded.add(paragraphId);
    }
    setExpandedParagraphs(newExpanded);
  };

  const getStatusIcon = (status: 'empty' | 'draft' | 'complete') => {
    switch (status) {
      case 'empty':
        return <Circle className="w-4 h-4 text-gray-400" />;
      case 'draft':
        return <CircleDot className="w-4 h-4 text-yellow-500" />;
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-2">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100">
          Document Outline
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFullPaper(true)}
            title="View full assembled paper"
            className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <FileText className="w-4 h-4" />
            <span>View Full Paper</span>
          </button>
        </div>
      </div>

      <WriterFullPaperModal
        open={showFullPaper}
        onClose={() => setShowFullPaper(false)}
        content={assembleDocument(outline)}
      />

      {/* Paragraphs List */}
      <div className="p-3">
        {outline.paragraphs
          .sort((a, b) => a.order - b.order)
          .map((paragraph) => (
            <div key={paragraph.id} className="mb-3">
              {/* Paragraph Item */}
              <button
                onClick={() => onSelectParagraph(paragraph.id)}
                className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition ${
                  selectedParagraphId === paragraph.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-gray-900 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {getStatusIcon(paragraph.status)}
                <span className="text-sm flex-1 truncate font-medium">
                  {paragraph.title || 'Untitled Paragraph'}
                </span>
                {paragraph.points.length > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleParagraph(paragraph.id);
                    }}
                    className="p-0 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    {expandedParagraphs.has(paragraph.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                )}
              </button>

              {/* Points under Paragraph */}
              {expandedParagraphs.has(paragraph.id) && paragraph.points.length > 0 && (
                <div className="ml-6 mt-1 space-y-1">
                  {paragraph.points
                    .sort((a, b) => a.order - b.order)
                    .map((point) => (
                      <div
                        key={point.id}
                        className="flex items-start gap-2 p-2 rounded text-xs text-gray-600 dark:text-gray-400"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                        <span className="truncate">{point.title || 'Untitled Point'}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
