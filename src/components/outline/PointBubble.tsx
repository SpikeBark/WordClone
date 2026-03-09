import { Handle, Position } from 'reactflow';

interface PointBubbleProps {
  data: {
    label: string;
    title: string;
    notes: string;
    type: string;
    onSelect: () => void;
  };
}

export default function PointBubble({ data }: PointBubbleProps) {
  return (
    <div
      onClick={data.onSelect}
      className="w-40 bg-gradient-to-br from-green-400 to-green-500 text-white rounded-xl shadow-md p-3 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <Handle type="target" position={Position.Top} />

      <div>
        <h4 className="font-semibold text-xs break-words">{data.title}</h4>
        {data.notes && (
          <p className="text-xs mt-1 opacity-90 break-words line-clamp-2">
            {data.notes}
          </p>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
