import { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
} from 'reactflow';
import type { Node, Edge, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import type { Outline, Section, Paragraph } from '../types/outline';
import SectionBubble from './outline/SectionBubble';
import ParagraphBubble from './outline/ParagraphBubble';
import OutlineLeftSidebar from './outline/OutlineLeftSidebar';
import OutlineRightPanel from './outline/OutlineRightPanel';
import { Plus, ChevronLeft, FileText } from 'lucide-react';

const nodeTypes = {
  section: SectionBubble,
  paragraph: ParagraphBubble,
};

interface OutlineEditorProps {
  onBack: () => void;
  onStartWriting?: () => void;
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
      sections: [],
    }
  );

  const [selectedBubbleId, setSelectedBubbleId] = useState<string | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Initialize nodes and edges from outline
  useEffect(() => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    outline.sections.forEach((section, sectionIndex) => {
      // Add section node
      newNodes.push({
        id: section.id,
        data: {
          label: section.title || 'Untitled Section',
          title: section.title,
          notes: section.notes,
          type: 'section',
          onSelect: () => setSelectedBubbleId(section.id),
          onAddParagraph: () => addParagraphToSection(section.id),
        },
        position: { x: sectionIndex * 300, y: 0 },
        type: 'section',
      });

      // Add paragraph nodes
      section.paragraphs.forEach((para, paraIndex) => {
        newNodes.push({
          id: para.id,
          data: {
            label: para.title || 'Untitled Paragraph',
            title: para.title,
            notes: para.notes,
            type: 'paragraph',
            onSelect: () => setSelectedBubbleId(para.id),
          },
          position: { x: sectionIndex * 300, y: 150 + paraIndex * 120 },
          type: 'paragraph',
        });

        // Connect section to paragraph
        newEdges.push({
          id: `${section.id}-${para.id}`,
          source: section.id,
          target: para.id,
        });
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [outline, setNodes, setEdges]);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds));
  }, [setEdges]);

  const addSection = useCallback(() => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: 'New Section',
      notes: '',
      paragraphs: [],
    };
    setOutline((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  }, []);

  const addParagraphToSection = useCallback((sectionId: string) => {
    setOutline((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id === sectionId) {
          const newParagraph: Paragraph = {
            id: `paragraph-${Date.now()}`,
            title: 'New Paragraph',
            notes: '',
            order: section.paragraphs.length + 1,
          };
          return {
            ...section,
            paragraphs: [...section.paragraphs, newParagraph],
          };
        }
        return section;
      }),
    }));
  }, []);

  const updateBubble = useCallback(
    (bubbleId: string, update: { title?: string; notes?: string }) => {
      setOutline((prev) => ({
        ...prev,
        sections: prev.sections.map((section) => {
          let updated = false;
          if (section.id === bubbleId) {
            updated = true;
            return {
              ...section,
              title: update.title ?? section.title,
              notes: update.notes ?? section.notes,
            };
          }

          if (section.paragraphs.some((p) => p.id === bubbleId)) {
            updated = true;
            return {
              ...section,
              paragraphs: section.paragraphs.map((para) => {
                if (para.id === bubbleId) {
                  return {
                    ...para,
                    title: update.title ?? para.title,
                    notes: update.notes ?? para.notes,
                  };
                }
                return para;
              }),
            };
          }

          return updated ? section : section;
        }),
      }));
    },
    []
  );

  const deleteBubble = useCallback((bubbleId: string) => {
    setOutline((prev) => ({
      ...prev,
      sections: prev.sections
        .filter((section) => section.id !== bubbleId)
        .map((section) => ({
          ...section,
          paragraphs: section.paragraphs.filter((p) => p.id !== bubbleId),
        })),
    }));
    setSelectedBubbleId(null);
  }, []);

  const getSelectedBubble = () => {
    if (!selectedBubbleId) return null;

    for (const section of outline.sections) {
      if (section.id === selectedBubbleId) {
        return { type: 'section' as const, data: section };
      }
      const para = section.paragraphs.find((p) => p.id === selectedBubbleId);
      if (para) {
        return { type: 'paragraph' as const, data: para };
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
        onAddSection={addSection}
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
              onClick={addSection}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Section
            </button>
            {onStartWriting && (
              <button
                onClick={onStartWriting}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <FileText className="w-4 h-4" />
                Start Writing
              </button>
            )}
          </div>
        </div>

        {/* Flow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
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
