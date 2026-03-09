import { useState, useCallback } from 'react';
import type { Paragraph } from '../../types/outline';
import ParagraphCard from './ParagraphCard';

interface KanbanBoardProps {
  paragraphs: Paragraph[];
  selectedId: string | null;
  onSelectBubble: (id: string) => void;
  onAddPoint: (paragraphId: string) => void;
  onUpdateBubble: (bubbleId: string, update: { title?: string; notes?: string }) => void;
  onReorderParagraphs: (paragraphs: Paragraph[]) => void;
  onReorderPoints: (paragraphId: string, pointIds: string[]) => void;
}

export default function KanbanBoard({
  paragraphs,
  selectedId,
  onSelectBubble,
  onAddPoint,
  onUpdateBubble,
  onReorderParagraphs,
  onReorderPoints,
}: KanbanBoardProps) {
  const [draggedParagraphId, setDraggedParagraphId] = useState<string | null>(null);
  const [draggedPointId, setDraggedPointId] = useState<string | null>(null);
  const [draggedFromParagraphId, setDraggedFromParagraphId] = useState<string | null>(null);

  const handleParagraphDragStart = useCallback((paragraphId: string) => {
    setDraggedParagraphId(paragraphId);
  }, []);

  const handleParagraphDragOver = useCallback((e: React.DragEvent, targetParagraphId: string) => {
    e.preventDefault();
    if (!draggedParagraphId || draggedParagraphId === targetParagraphId) return;

    const draggedIndex = paragraphs.findIndex((p) => p.id === draggedParagraphId);
    const targetIndex = paragraphs.findIndex((p) => p.id === targetParagraphId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newParagraphs = [...paragraphs];
    const [removed] = newParagraphs.splice(draggedIndex, 1);
    newParagraphs.splice(targetIndex, 0, removed);

    // Update order
    const updatedParagraphs = newParagraphs.map((p, idx) => ({
      ...p,
      order: idx + 1,
    }));

    onReorderParagraphs(updatedParagraphs);
  }, [draggedParagraphId, paragraphs, onReorderParagraphs]);

  const handleParagraphDragEnd = useCallback(() => {
    setDraggedParagraphId(null);
  }, []);

  const handlePointDragStart = useCallback((pointId: string, paragraphId: string) => {
    setDraggedPointId(pointId);
    setDraggedFromParagraphId(paragraphId);
  }, []);

  const handlePointDragOver = useCallback(
    (e: React.DragEvent, targetPointId: string, targetParagraphId: string) => {
      e.preventDefault();
      e.stopPropagation();

      if (!draggedPointId || draggedPointId === targetPointId) return;
      if (draggedFromParagraphId !== targetParagraphId) return;

      const paragraph = paragraphs.find((p) => p.id === targetParagraphId);
      if (!paragraph) return;

      const draggedIndex = paragraph.points.findIndex((p) => p.id === draggedPointId);
      const targetIndex = paragraph.points.findIndex((p) => p.id === targetPointId);

      if (draggedIndex === -1 || targetIndex === -1) return;

      const newPoints = [...paragraph.points];
      const [removed] = newPoints.splice(draggedIndex, 1);
      newPoints.splice(targetIndex, 0, removed);

      const updatedPoints = newPoints.map((p, idx) => ({
        ...p,
        order: idx + 1,
      }));

      onReorderPoints(
        targetParagraphId,
        updatedPoints.map((p) => p.id)
      );
    },
    [draggedPointId, draggedFromParagraphId, paragraphs, onReorderPoints]
  );

  const handlePointDragEnd = useCallback(() => {
    setDraggedPointId(null);
    setDraggedFromParagraphId(null);
  }, []);

  return (
    <div className="flex gap-6 p-6 overflow-x-auto h-full">
      {paragraphs
        .sort((a, b) => a.order - b.order)
        .map((paragraph) => (
          <ParagraphCard
            key={paragraph.id}
            paragraph={paragraph}
            isSelected={selectedId === paragraph.id || paragraph.points.some((p) => p.id === selectedId)}
            onSelect={() => onSelectBubble(paragraph.id)}
            onAddPoint={() => onAddPoint(paragraph.id)}
            onUpdateBubble={onUpdateBubble}
            onDragStart={() => handleParagraphDragStart(paragraph.id)}
            onDragOver={(e: React.DragEvent) => handleParagraphDragOver(e, paragraph.id)}
            onDragEnd={handleParagraphDragEnd}
            onPointSelect={(pointId: string) => onSelectBubble(pointId)}
            onPointDragStart={(pointId: string) => handlePointDragStart(pointId, paragraph.id)}
            onPointDragOver={(e: React.DragEvent, pointId: string) => handlePointDragOver(e, pointId, paragraph.id)}
            onPointDragEnd={handlePointDragEnd}
            selectedPointId={selectedId}
          />
        ))}
    </div>
  );
}
