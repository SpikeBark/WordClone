import { useState, useCallback } from 'react';
import type { Outline, Paragraph, Point } from '../types/outline';
import OutlineLeftSidebar from './outline/OutlineLeftSidebar';
import OutlineRightPanel from './outline/OutlineRightPanel';
import KanbanBoard from './outline/KanbanBoard';
import { Plus, ChevronLeft, FileText } from 'lucide-react';

interface OutlineEditorProps {
  onBack: () => void;
  onStartWriting?: (outline: Outline) => void;
  initialOutline?: Outline;
  documentMetadata?: any;
}

export default function OutlineEditor({
  onBack,
  onStartWriting,
  initialOutline,
  documentMetadata,
}: OutlineEditorProps) {
  const [outline, setOutline] = useState<Outline>(
    initialOutline || {
      title: documentMetadata?.title || 'Untitled Document',
      paragraphs: [],
    }
  );

  const [selectedBubbleId, setSelectedBubbleId] = useState<string | null>(null);

  const addParagraph = useCallback(() => {
    const newParagraph: Paragraph = {
      id: `para-${Date.now()}`,
      title: 'New Paragraph',
      notes: '',
      points: [],
      content: '',
      status: 'empty',
      order: outline.paragraphs.length + 1,
    };
    setOutline((prev) => ({
      ...prev,
      paragraphs: [...prev.paragraphs, newParagraph],
   }));
  }, [outline.paragraphs.length]);

  const addPointToParagraph = useCallback((paragraphId: string) => {
    setOutline((prev) => ({
      ...prev,
      paragraphs: prev.paragraphs.map((paragraph) => {
        if (paragraph.id === paragraphId) {
          const newPoint: Point = {
            id: `point-${Date.now()}`,
            title: 'New Point',
            notes: '',
            order: paragraph.points.length + 1,
          };
          return {
            ...paragraph,
            points: [...paragraph.points, newPoint],
          };
        }
        return paragraph;
      }),
    }));
  }, []);

  const updateBubble = useCallback(
    (bubbleId: string, update: { title?: string; notes?: string }) => {
      setOutline((prev) => ({
        ...prev,
        paragraphs: prev.paragraphs.map((paragraph) => {
          if (paragraph.id === bubbleId) {
            return {
              ...paragraph,
              title: update.title ?? paragraph.title,
              notes: update.notes ?? paragraph.notes,
            };
          }

          if (paragraph.points.some((p) => p.id === bubbleId)) {
            return {
              ...paragraph,
              points: paragraph.points.map((point) => {
                if (point.id === bubbleId) {
                  return {
                    ...point,
                    title: update.title ?? point.title,
                    notes: update.notes ?? point.notes,
                  };
                }
                return point;
              }),
            };
          }

          return paragraph;
        }),
      }));
    },
    []
  );

  const deleteBubble = useCallback((bubbleId: string) => {
    setOutline((prev) => ({
      ...prev,
      paragraphs: prev.paragraphs
        .filter((paragraph) => paragraph.id !== bubbleId)
        .map((paragraph) => ({
          ...paragraph,
          points: paragraph.points.filter((p) => p.id !== bubbleId),
        })),
    }));
    setSelectedBubbleId(null);
  }, []);

  const handleReorderParagraphs = useCallback((reorderedParagraphs: Paragraph[]) => {
    setOutline((prev) => ({
      ...prev,
      paragraphs: reorderedParagraphs,
    }));
  }, []);

  const handleReorderPoints = useCallback((paragraphId: string, pointIds: string[]) => {
    setOutline((prev) => ({
      ...prev,
      paragraphs: prev.paragraphs.map((paragraph) => {
        if (paragraph.id === paragraphId) {
          const reorderedPoints = pointIds
            .map((id) => paragraph.points.find((p) => p.id === id))
            .filter((p): p is Point => p !== undefined)
            .map((p, idx) => ({ ...p, order: idx + 1 }));
          return {
            ...paragraph,
            points: reorderedPoints,
          };
        }
        return paragraph;
      }),
    }));
  }, []);

  const getSelectedBubble = () => {
    if (!selectedBubbleId) return null;

    for (const paragraph of outline.paragraphs) {
      if (paragraph.id === selectedBubbleId) {
        return { type: 'paragraph' as const, data: paragraph };
      }
      const point = paragraph.points.find((p) => p.id === selectedBubbleId);
      if (point) {
        return { type: 'point' as const, data: point };
      }
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Sidebar */}
      <OutlineLeftSidebar
        outline={outline}
        selectedId={selectedBubbleId}
        onSelectBubble={setSelectedBubbleId}
        onAddParagraph={addParagraph}
      />

      {/* Center Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {outline.title}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={addParagraph}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Paragraph
            </button>
            {onStartWriting && (
              <button
                onClick={() => onStartWriting(outline)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <FileText className="w-4 h-4" />
                Start Writing
              </button>
            )}
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 bg-gray-100 dark:bg-gray-950">
          <KanbanBoard
            paragraphs={outline.paragraphs}
            selectedId={selectedBubbleId}
            onSelectBubble={setSelectedBubbleId}
            onAddPoint={addPointToParagraph}
            onUpdateBubble={updateBubble}
            onReorderParagraphs={handleReorderParagraphs}
            onReorderPoints={handleReorderPoints}
          />
        </div>
      </div>

      {/* Right Panel */}
      <OutlineRightPanel
        selectedBubble={getSelectedBubble()}
        onUpdate={updateBubble}
        onDelete={deleteBubble}
      />
    </div>
  );
}
