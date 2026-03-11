import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Outline, ParagraphFeedback, ResearchSuggestions } from '../types/outline';
import WriterLeftPanel from './writer/WriterLeftPanel';
import WriterCenterPanel, { type WriterCenterPanelHandle } from './writer/WriterCenterPanel';
import WriterRightPanel from './writer/WriterRightPanel.tsx';
import { getWritingProgress } from '../utils/documentAssembler';
import { reviewParagraphWithAI } from '../utils/paragraphFeedback';
import {
  shouldActivateResearchAssistant,
  getResearchSuggestions,
} from '../utils/researchAssistant';
import { validateUrl, makeSearchAlternatives } from '../utils/urlHelpers';

interface ParagraphWriterProps {
  initialOutline: Outline;
  citationStyle?: string;
  onBack: () => void;
  onSave?: (outline: Outline) => void;
}

const INSERT_SEPARATOR = '\n\n';

export default function ParagraphWriter({
  initialOutline,
  citationStyle = '',
  onBack,
  onSave,
}: ParagraphWriterProps) {
  const centerPanelRef = useRef<WriterCenterPanelHandle>(null);
  const [outline, setOutline] = useState<Outline>(initialOutline);
  const [selectedParagraphId, setSelectedParagraphId] = useState<string | null>(
    null
  );
  const [currentSelection, setCurrentSelection] = useState<string>('');
  const [feedbackByParagraphId, setFeedbackByParagraphId] = useState<
    Record<string, ParagraphFeedback>
  >({});
  const [feedbackErrorByParagraphId, setFeedbackErrorByParagraphId] = useState<
    Record<string, string>
  >({});
  const [isReviewing, setIsReviewing] = useState(false);
  const [researchByParagraphId, setResearchByParagraphId] = useState<
    Record<string, ResearchSuggestions>
  >({});
  const [researchValidationByParagraphId, setResearchValidationByParagraphId] = useState<
    Record<string, any>
  >({});
  const [researchErrorByParagraphId, setResearchErrorByParagraphId] = useState<
    Record<string, string>
  >({});
  const [researchActivatedByParagraphId, setResearchActivatedByParagraphId] = useState<
    Record<string, boolean>
  >({});
  const [isFetchingResearch, setIsFetchingResearch] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(256);
  const [leftPanelHidden, setLeftPanelHidden] = useState<boolean>(false);
  const [rightPanelWidth, setRightPanelWidth] = useState<number>(320);
  const [rightPanelHidden, setRightPanelHidden] = useState<boolean>(false);
  const leftResizingRef = useRef<{ startX: number; startWidth: number } | null>(null);
  const resizingRef = useRef<{ startX: number; startWidth: number } | null>(null);

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

  // Keep width in localStorage so user preference persists during session
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('wc:leftPanelWidth');
      if (saved) setLeftPanelWidth(Number(saved));
    } catch {}
    try {
      const savedHidden = window.localStorage.getItem('wc:leftPanelHidden');
      if (savedHidden === '1') setLeftPanelHidden(true);
    } catch {}
    try {
      const saved = window.localStorage.getItem('wc:rightPanelWidth');
      if (saved) setRightPanelWidth(Number(saved));
    } catch {}
    try {
      const savedHidden = window.localStorage.getItem('wc:rightPanelHidden');
      if (savedHidden === '1') setRightPanelHidden(true);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem('wc:leftPanelWidth', String(leftPanelWidth));
    } catch {}
  }, [leftPanelWidth]);

  useEffect(() => {
    try {
      window.localStorage.setItem('wc:leftPanelHidden', leftPanelHidden ? '1' : '0');
    } catch {}
  }, [leftPanelHidden]);

  useEffect(() => {
    try {
      window.localStorage.setItem('wc:rightPanelWidth', String(rightPanelWidth));
    } catch {}
  }, [rightPanelWidth]);

  useEffect(() => {
    try {
      window.localStorage.setItem('wc:rightPanelHidden', rightPanelHidden ? '1' : '0');
    } catch {}
  }, [rightPanelHidden]);

  // Save outline if callback provided
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(outline);
    }
  }, [outline, onSave]);

  const fetchResearchSuggestions = useCallback(
    async (paragraphId: string, paragraphText: string) => {
      setIsFetchingResearch(true);
      setResearchErrorByParagraphId((prev) => {
        const next = { ...prev };
        delete next[paragraphId];
        return next;
      });

      try {
        const suggestions = await getResearchSuggestions(paragraphText, outline.title, citationStyle);
        setResearchByParagraphId((prev) => ({
          ...prev,
          [paragraphId]: suggestions,
        }));
        (async () => {
          try {
            const validation: any = { statistics: [], source: null };

            await Promise.all(
              suggestions.statistics.map(async (stat) => {
                const info: any = { text: stat.text, url: stat.url };
                if (stat.url) {
                  const status = await validateUrl(stat.url);
                  info.status = status;
                  if (status !== 'valid') info.alternatives = makeSearchAlternatives(stat.text || stat.url);
                } else {
                  info.status = 'unknown';
                  info.alternatives = makeSearchAlternatives(stat.text);
                }
                validation.statistics.push(info);
              })
            );

            const src: any = { text: suggestions.source.text, url: suggestions.source.url };
            if (suggestions.source.url) {
              const sStatus = await validateUrl(suggestions.source.url);
              src.status = sStatus;
              if (sStatus !== 'valid') src.alternatives = makeSearchAlternatives(suggestions.source.text || suggestions.source.url);
            } else {
              src.status = 'unknown';
              src.alternatives = makeSearchAlternatives(suggestions.source.text);
            }
            validation.source = src;

            setResearchValidationByParagraphId((prev) => ({ ...prev, [paragraphId]: validation }));
          } catch {
            // ignore validation failures — validation is best-effort
          }
        })();
      } catch (error) {
        const message =
          error instanceof Error && error.message.trim()
            ? error.message.trim()
            : 'Research suggestions unavailable. Please try again.';
        setResearchErrorByParagraphId((prev) => ({
          ...prev,
          [paragraphId]: message,
        }));
      } finally {
        setIsFetchingResearch(false);
      }
    },
    [citationStyle, outline.title]
  );

  const insertTextIntoParagraph = useCallback(
    (text: string) => {
      if (centerPanelRef.current) {
        centerPanelRef.current.insertAtCursor(text);
      } else if (selectedParagraphId && currentParagraph) {
        // Fallback: append with separator if ref not available.
        // INSERT_SEPARATOR is a module-level constant and intentionally excluded from deps.
        const separator = currentParagraph.content.trim() ? INSERT_SEPARATOR : '';
        updateParagraphContent(selectedParagraphId, currentParagraph.content + separator + text);
      }
    },
    [selectedParagraphId, currentParagraph, updateParagraphContent]
  );

  const generateMoreEvidence = useCallback(() => {
    if (!currentParagraph || !selectedParagraphId) return;
    fetchResearchSuggestions(selectedParagraphId, currentParagraph.content);
  }, [currentParagraph, selectedParagraphId, fetchResearchSuggestions]);

  // Resize handlers for right panel
  const onPointerDownLeftResize = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    leftResizingRef.current = { startX: e.clientX, startWidth: leftPanelWidth };
  }, [leftPanelWidth]);

  const onPointerDownResize = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    resizingRef.current = { startX: e.clientX, startWidth: rightPanelWidth };
  }, [rightPanelWidth]);

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      if (leftResizingRef.current) {
        const leftDelta = e.clientX - leftResizingRef.current.startX;
        const leftNext = Math.max(180, Math.min(520, leftResizingRef.current.startWidth + leftDelta));
        setLeftPanelWidth(leftNext);
      }
      if (!resizingRef.current) return;
      const delta = resizingRef.current.startX - e.clientX;
      const next = Math.max(200, Math.min(800, resizingRef.current.startWidth + delta));
      setRightPanelWidth(next);
    }
    function onPointerUp() {
      leftResizingRef.current = null;
      resizingRef.current = null;
    }
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  const reviewCurrentParagraph = useCallback(async () => {
    if (!currentParagraph || !selectedParagraphId) return;

    if (!currentParagraph.content.trim()) {
      setFeedbackErrorByParagraphId((prev) => ({
        ...prev,
        [selectedParagraphId]: 'Write some content before requesting feedback.',
      }));
      return;
    }

    setIsReviewing(true);
    setFeedbackErrorByParagraphId((prev) => {
      const next = { ...prev };
      delete next[selectedParagraphId];
      return next;
    });

    try {
      const feedback = await reviewParagraphWithAI({
        document_topic: outline.title,
        section_title: currentParagraph.title || 'Untitled Section',
        paragraph_title: currentParagraph.title || 'Untitled Paragraph',
        paragraph_notes: currentParagraph.notes || '',
        paragraph_text: currentParagraph.content,
      });

      setFeedbackByParagraphId((prev) => ({
        ...prev,
        [selectedParagraphId]: feedback,
      }));

      if (shouldActivateResearchAssistant(currentParagraph.content, feedback.evidence)) {
        setResearchActivatedByParagraphId((prev) => ({
          ...prev,
          [selectedParagraphId]: true,
        }));
        fetchResearchSuggestions(selectedParagraphId, currentParagraph.content);
      }
    } catch (error) {
      const message =
        error instanceof Error && error.message.trim()
          ? error.message.trim()
          : 'Feedback unavailable. Please try again.';

      setFeedbackErrorByParagraphId((prev) => ({
        ...prev,
        [selectedParagraphId]: message,
      }));
    } finally {
      setIsReviewing(false);
    }
  }, [currentParagraph, fetchResearchSuggestions, outline.title, selectedParagraphId]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* Compact top bar to maximize writer space */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              aria-label="Back to outline"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
              {progress.complete}/{progress.total} complete ({progress.percentComplete}%)
            </p>
          </div>

          {onSave && (
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Save
            </button>
          )}
        </div>
      </div>

      {/* Three-Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Outline Navigation */}
        {!leftPanelHidden && (
          <div style={{ width: leftPanelWidth }} className="flex-none">
            <WriterLeftPanel
              outline={outline}
              selectedParagraphId={selectedParagraphId}
              onSelectParagraph={setSelectedParagraphId}
            />
          </div>
        )}

        {/* Left resize handle + hide toggle */}
        <div
          onPointerDown={onPointerDownLeftResize}
          role="separator"
          aria-orientation="vertical"
          className="flex items-center justify-center select-none border-l border-r border-gray-200 dark:border-gray-700"
          style={{ width: 12, cursor: 'col-resize' }}
        >
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setLeftPanelHidden((v) => !v)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title={leftPanelHidden ? 'Show outline panel' : 'Hide outline panel'}
            style={{
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {leftPanelHidden ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Center Panel - Writing Editor */}
        <WriterCenterPanel
          ref={centerPanelRef}
          paragraph={currentParagraph}
          onContentChange={(content) =>
            selectedParagraphId && updateParagraphContent(selectedParagraphId, content)
          }
          onSelectionChange={setCurrentSelection}
          onReviewParagraph={reviewCurrentParagraph}
          isReviewing={isReviewing}
          onMarkComplete={markParagraphComplete}
          onPrevious={goToPrevious}
          onNext={goToNext}
          hasPrevious={currentIndex > 0}
          hasNext={currentIndex < allParagraphs.length - 1}
        />
        {/* Resize handle (also contains collapse/expand control) */}
        <div
          onPointerDown={onPointerDownResize}
          role="separator"
          aria-orientation="vertical"
          className="flex items-center justify-center select-none border-l border-r border-gray-200 dark:border-gray-700"
          style={{ width: 12, cursor: 'col-resize' }}
        >
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setRightPanelHidden((v) => !v)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title={rightPanelHidden ? 'Show guidance panel' : 'Hide guidance panel'}
            style={{
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {rightPanelHidden ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

        {/* Right Panel - Guidance (resizable and hideable) */}
        {!rightPanelHidden && (
          <div style={{ width: rightPanelWidth }} className="flex-none">
            <WriterRightPanel
              paragraph={currentParagraph}
              selectedText={currentSelection}
              feedback={
                selectedParagraphId ? feedbackByParagraphId[selectedParagraphId] ?? null : null
              }
              feedbackError={
                selectedParagraphId
                  ? feedbackErrorByParagraphId[selectedParagraphId] ?? null
                  : null
              }
              isReviewing={isReviewing}
              showResearchAssistant={
                !!selectedParagraphId && !!researchActivatedByParagraphId[selectedParagraphId]
              }
              researchSuggestions={
                selectedParagraphId ? researchByParagraphId[selectedParagraphId] ?? null : null
              }
              researchValidation={
                selectedParagraphId ? researchValidationByParagraphId[selectedParagraphId] ?? null : null
              }
              researchError={
                selectedParagraphId
                  ? researchErrorByParagraphId[selectedParagraphId] ?? null
                  : null
              }
              isFetchingResearch={isFetchingResearch}
              onAddGeneralNote={(note: string) =>
                selectedParagraphId && addGeneralNote(selectedParagraphId, note)
              }
              onAddSelectionNote={(selectedText: string, note: string) =>
                selectedParagraphId && addSelectionNote(selectedParagraphId, selectedText, note)
              }
              onInsertText={insertTextIntoParagraph}
              onGenerateMoreEvidence={generateMoreEvidence}
            />
          </div>
        )}
      </div>
    </div>
  );
}
