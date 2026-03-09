import { Handle, Position } from 'reactflow';
import { Plus } from 'lucide-react';

interface ParagraphBubbleProps {
  data: {
    label: string;
    title: string;
    notes: string;
    type: string;
    onSelect: () => void;
    onAddPoint: () => void;
  };
}

export default function ParagraphBubble({ data }: ParagraphBubbleProps) {
  return (
    <div
      onClick={data.onSelect}
      className="w-48 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
    >
      <Handle type="target" position={Position.Top} />

      <div className="mb-3">
        <h3 className="font-bold text-sm break-words">{data.title}</h3>
        {data.notes && (
          <p className="text-xs mt-2 opacity-90 break-words line-clamp-2">
            {data.notes}
          </p>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          data.onAddPoint();
        }}
        className="w-full flex items-center justify-center gap-1 mt-3 bg-white/20 hover:bg-white/30 text-white text-xs py-1 rounded px-2 transition"
      >
        <Plus className="w-3 h-3" />
        Add Point
      </button>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
