import { useState } from 'react';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';
import type { Outline } from '../../types/outline';

interface OutlineLeftSidebarProps {
  outline: Outline;
  selectedId: string | null;
  onSelectBubble: (id: string) => void;
  onAddSection: () => void;
}

export default function OutlineLeftSidebar({
  outline,
  selectedId,
  onSelectBubble,
}: OutlineLeftSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(outline.sections.map((s) => s.id))
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      {/* Document Title */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <FileText className="w-5 h-5" />
          <h2 className="font-semibold truncate">{outline.title}</h2>
        </div>
      </div>

      {/* Sections List */}
      <div className="p-3">
        {outline.sections.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No sections yet. Add one to begin.
          </p>
        ) : (
          outline.sections.map((section) => (
            <div key={section.id} className="mb-2">
              {/* Section Item */}
              <div
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${
                  selectedId === section.id
                    ? 'bg-blue-100 dark:bg-blue-900'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="p-0 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                >
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => onSelectBubble(section.id)}
                  className="flex-1 text-left text-sm font-medium text-gray-900 dark:text-gray-100 truncate"
                >
                  {section.title || 'Untitled Section'}
                </button>
              </div>

              {/* Paragraphs in Section */}
              {expandedSections.has(section.id) && (
                <div className="ml-6 space-y-1">
                  {section.paragraphs.map((para) => (
                    <button
                      key={para.id}
                      onClick={() => onSelectBubble(para.id)}
                      className={`w-full text-left p-2 rounded-lg text-xs transition ${
                        selectedId === para.id
                          ? 'bg-green-100 dark:bg-green-900 text-gray-900 dark:text-gray-100'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {para.title || 'Untitled Paragraph'}
                    </button>
                  ))}
                  {section.paragraphs.length === 0 && (
                    <p className="text-xs text-gray-400 italic p-2">
                      No paragraphs
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
