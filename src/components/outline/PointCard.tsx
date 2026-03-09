import { useEffect, useState } from 'react';
import type { Point } from '../../types/outline';

interface PointCardProps {
  point: Point;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (update: { title?: string; notes?: string }) => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnd: () => void;
}

export default function PointCard({
  point,
  isSelected,
  onSelect,
  onUpdate,
  onDragStart,
  onDragOver,
  onDragEnd,
}: PointCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState(point.title);
  const [notesDraft, setNotesDraft] = useState(point.notes);

  useEffect(() => {
    setTitleDraft(point.title);
    setNotesDraft(point.notes);
  }, [point.id, point.title, point.notes]);

  const savePointEdits = () => {
    onUpdate({ title: titleDraft, notes: notesDraft });
    setIsEditing(false);
  };

  return (
    <div
      draggable={!isEditing}
      onDragStart={(e) => {
        e.stopPropagation();
        onDragStart();
      }}
      onDragOver={(e) => {
        e.stopPropagation();
        onDragOver(e);
      }}
      onDragEnd={onDragEnd}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={`p-3 rounded-lg cursor-move transition-all ${
        isSelected
          ? 'bg-green-100 dark:bg-green-900/40 border-2 border-green-500 dark:border-green-400'
          : 'bg-green-50 dark:bg-green-900/20 border-2 border-transparent hover:border-green-300 dark:hover:border-green-700'
      }`}
    >
      {isEditing ? (
        <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
          <input
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            placeholder="Point title"
            className="w-full px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"
          />
          <textarea
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            placeholder="Point notes"
            className="w-full px-2 py-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs h-14 resize-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={savePointEdits}
              className="px-2 py-1 text-xs rounded bg-green-600 text-white"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setTitleDraft(point.title);
                setNotesDraft(point.notes);
                setIsEditing(false);
              }}
              className="px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 break-words">
            {point.title || 'Untitled Point'}
          </h4>
          {point.notes && (
            <p className="text-xs mt-1 text-gray-600 dark:text-gray-400 break-words line-clamp-2">
              {point.notes}
            </p>
          )}
        </>
      )}
    </div>
  );
}
