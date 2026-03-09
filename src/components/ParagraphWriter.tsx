import { useState, useCallback, useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import type { Outline } from '../types/outline';
import WriterLeftPanel from './writer/WriterLeftPanel';
import WriterCenterPanel from './writer/WriterCenterPanel';
import WriterRightPanel from './writer/WriterRightPanel';
import { getWritingProgress } from '../utils/documentAssembler';

interface ParagraphWriterProps {
  initialOutline: Outline;
  onBack: () => void;
  onSave?: (outline: Outline) => void;
}

export default function ParagraphWriter({
  initialOutline,
  onBack,
  onSave,
}: ParagraphWriterProps) {
  const [outline, setOutline] = useState<Outline>(initialOutline);
  const [selectedParagraphId, setSelectedParagraphId] = useState<string | null>(
    null
  );
  const [currentSelection, setCurrentSelection] = useState<string>('');

  // Get all paragraphs in order
  const allParagraphs = useMemo(() => {
    return outline.paragraphs.sort((a, b) => a.order - b.order);
  }, [outline]);

  // Get current paragraph
  const currentParagraph = useMemo(() => {
    if (!selectedParagraphId) return null;
    return outline.paragraphs.find((p) => p.id === selectedParagraphId) || null;
  }, [outline, selectedParagraphId]);

  // Get current paragraph index
  const currentIndex = useMemo(() => {
    return allParagraphs.findIndex((p) => p.id === selectedParagraphId);
  }, [allParagraphs, selectedParagraphId]);

  // Progress stats
  const progress = useMemo(() => getWritingProgress(outline), [outline]);

  // Update paragraph content
  const updateParagraphContent = useCallback(
    (paragraphId: string, content: string) => {
      setOutline((prev) => ({
        ...prev,
        paragraphs: prev.paragraphs.map((para) => {
          if (para.id === paragraphId) {
            // Auto-update status to draft when user starts typing
            const newStatus =
              content.trim() && para.status === 'empty' ? 'draft' : para.status;
            return {
              ...para,
              content,
              status: newStatus,
            };
          }
          return para;
        }),
      }));
    },
    []
  );

  const addGeneralNote = useCallback(
    (paragraphId: string, note: string) => {
      const trimmed = note.trim();
      if (!trimmed) return;

      setOutline((prev) => ({
        ...prev,
        paragraphs: prev.paragraphs.map((para) => {
          if (para.id !== paragraphId) return para;
          return {
            ...para,
            generalNotes: [...(para.generalNotes ?? []), trimmed],
          };
        }),
      }));
    },
    []
  );

  const addSelectionNote = useCallback(
    (paragraphId: string, selectedText: string, note: string) => {
      const text = selectedText.trim();
      const noteText = note.trim();
      if (!text || !noteText) return;

      setOutline((prev) => ({
        ...prev,
        paragraphs: prev.paragraphs.map((para) => {
          if (para.id !== paragraphId) return para;
          return {
            ...para,
            selectionNotes: [
              ...(para.selectionNotes ?? []),
              {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                selectedText: text,
                note: noteText,
              },
            ],
          };
        }),
      }));
    },
    []
  );

  // Mark paragraph complete
  const markParagraphComplete = useCallback(() => {
    if (!selectedParagraphId) return;
    setOutline((prev) => ({
      ...prev,
      paragraphs: prev.paragraphs.map((para) => {
        if (para.id === selectedParagraphId) {
          return { ...para, status: 'complete' as const };
        }
        return para;
      }),
    }));
  }, [selectedParagraphId]);

  // Navigate to previous paragraph
  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setSelectedParagraphId(allParagraphs[currentIndex - 1].id);
    }
  }, [currentIndex, allParagraphs]);

  // Navigate to next paragraph
  const goToNext = useCallback(() => {
    if (currentIndex < allParagraphs.length - 1) {
      setSelectedParagraphId(allParagraphs[currentIndex + 1].id);
    }
  }, [currentIndex, allParagraphs]);

  // Auto-select first paragraph if none selected
  if (!selectedParagraphId && allParagraphs.length > 0) {
    setSelectedParagraphId(allParagraphs[0].id);
  }

  // Save outline if callback provided
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(outline);
    }
  }, [outline, onSave]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {outline.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Paragraphs Completed: {progress.complete} / {progress.total} (
                {progress.percentComplete}%)
              </p>
            </div>
          </div>

          {onSave && (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save Progress
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.percentComplete}%` }}
            />
          </div>
        </div>
      </div>

      {/* Three-Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Outline Navigation */}
        <WriterLeftPanel
          outline={outline}
          selectedParagraphId={selectedParagraphId}
          onSelectParagraph={setSelectedParagraphId}
        />

        {/* Center Panel - Writing Editor */}
        <WriterCenterPanel
          paragraph={currentParagraph}
          onContentChange={(content) =>
            selectedParagraphId && updateParagraphContent(selectedParagraphId, content)
          }
          onSelectionChange={setCurrentSelection}
          onMarkComplete={markParagraphComplete}
          onPrevious={goToPrevious}
          onNext={goToNext}
          hasPrevious={currentIndex > 0}
          hasNext={currentIndex < allParagraphs.length - 1}
        />

        {/* Right Panel - Guidance */}
        <WriterRightPanel
          paragraph={currentParagraph}
          selectedText={currentSelection}
          onAddGeneralNote={(note) =>
            selectedParagraphId && addGeneralNote(selectedParagraphId, note)
          }
          onAddSelectionNote={(selectedText, note) =>
            selectedParagraphId && addSelectionNote(selectedParagraphId, selectedText, note)
          }
        />
      </div>
    </div>
  );
}
