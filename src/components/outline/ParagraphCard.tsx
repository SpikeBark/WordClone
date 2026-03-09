import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import type { Paragraph } from '../../types/outline';
import PointCard from './PointCard';

interface ParagraphCardProps {
  paragraph: Paragraph;
  isSelected: boolean;
  onSelect: () => void;
  onAddPoint: () => void;
  onUpdateBubble: (bubbleId: string, update: { title?: string; notes?: string }) => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onPointSelect: (pointId: string) => void;
  onPointDragStart: (pointId: string) => void;
  onPointDragOver: (e: React.DragEvent, pointId: string) => void;
  onPointDragEnd: () => void;
  selectedPointId: string | null;
}

export default function ParagraphCard({
  paragraph,
  isSelected,
  onSelect,
  onAddPoint,
  onUpdateBubble,
  onDragStart,
  onDragOver,
  onDragEnd,
  onPointSelect,
  onPointDragStart,
  onPointDragOver,
  onPointDragEnd,
  selectedPointId,
}: ParagraphCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState(paragraph.title);
  const [notesDraft, setNotesDraft] = useState(paragraph.notes);

  useEffect(() => {
    setTitleDraft(paragraph.title);
    setNotesDraft(paragraph.notes);
  }, [paragraph.id, paragraph.title, paragraph.notes]);

  const saveParagraphEdits = () => {
    onUpdateBubble(paragraph.id, { title: titleDraft, notes: notesDraft });
    setIsEditing(false);
  };

  return (
    <div
      draggable={!isEditing}
      onDragStart={(e) => {
        e.stopPropagation();
        onDragStart();
      }}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      className={`flex-shrink-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-md border-2 ${
        isSelected
          ? 'border-blue-500 dark:border-blue-400'
          : 'border-gray-200 dark:border-gray-700'
      } hover:shadow-lg transition-shadow cursor-move`}
    >
      {/* Paragraph Header */}
      <div
        onClick={onSelect}
        onDoubleClick={() => setIsEditing(true)}
        className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-t-lg p-4 cursor-pointer"
      >
        {isEditing ? (
          <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
            <input
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              placeholder="Paragraph title"
              className="w-full px-2 py-1 rounded bg-white/95 text-gray-900 text-sm"
            />
            <textarea
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              placeholder="Paragraph notes"
              className="w-full px-2 py-1 rounded bg-white/95 text-gray-900 text-xs h-16 resize-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveParagraphEdits}
                className="px-2 py-1 text-xs rounded bg-white text-blue-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setTitleDraft(paragraph.title);
                  setNotesDraft(paragraph.notes);
                  setIsEditing(false);
                }}
                className="px-2 py-1 text-xs rounded bg-white/80 text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="font-bold text-lg break-words">{paragraph.title || 'Untitled Paragraph'}</h3>
            {paragraph.notes && (
              <p className="text-sm mt-2 opacity-90 break-words line-clamp-2">{paragraph.notes}</p>
            )}
          </>
        )}
      </div>

      {/* Points Container */}
      <div className="p-4 space-y-3 min-h-[100px] max-h-[500px] overflow-y-auto">
        {paragraph.points
          .sort((a, b) => a.order - b.order)
          .map((point) => (
            <PointCard
              key={point.id}
              point={point}
              isSelected={selectedPointId === point.id}
              onSelect={() => onPointSelect(point.id)}
              onUpdate={(update) => onUpdateBubble(point.id, update)}
              onDragStart={() => onPointDragStart(point.id)}
              onDragOver={(e: React.DragEvent) => onPointDragOver(e, point.id)}
              onDragEnd={onPointDragEnd}
            />
          ))}

        {paragraph.points.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
            No points yet
          </p>
        )}
      </div>

      {/* Add Point Button */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddPoint();
          }}
          className="w-full flex items-center justify-center gap-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm py-2 rounded transition"
        >
          <Plus className="w-4 h-4" />
          Add Point
        </button>
      </div>
    </div>
  );
}
