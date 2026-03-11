import { Lightbulb, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import type { Paragraph, ParagraphFeedback, ResearchSuggestions } from '../../types/outline';
import ResearchAssistantPanel from './ResearchAssistantPanel';

interface WriterRightPanelProps {
  paragraph: Paragraph | null;
  selectedText: string;
  feedback: ParagraphFeedback | null;
  feedbackError: string | null;
  isReviewing: boolean;
  showResearchAssistant: boolean;
  researchSuggestions: ResearchSuggestions | null;
  researchValidation?: any | null;
  researchError: string | null;
  isFetchingResearch: boolean;
  onAddGeneralNote: (note: string) => void;
  onAddSelectionNote: (selectedText: string, note: string) => void;
  onInsertText: (text: string) => void;
  onGenerateMoreEvidence: () => void;
}

export default function WriterRightPanel({
  paragraph,
  selectedText,
  feedback,
  feedbackError,
  isReviewing,
  showResearchAssistant,
  researchSuggestions,
  researchValidation,
  researchError,
  isFetchingResearch,
  onAddGeneralNote,
  onAddSelectionNote,
  onInsertText,
  onGenerateMoreEvidence,
}: WriterRightPanelProps) {
  const [generalDraft, setGeneralDraft] = useState('');
  const [selectionDraft, setSelectionDraft] = useState('');

  const submitGeneral = () => {
    if (!generalDraft.trim()) return;
    onAddGeneralNote(generalDraft.trim());
    setGeneralDraft('');
  };

  const submitSelection = () => {
    if (!selectedText.trim() || !selectionDraft.trim()) return;
    onAddSelectionNote(selectedText.trim(), selectionDraft.trim());
    setSelectionDraft('');
  };

  if (!paragraph) {
    return (
      <div className="w-full h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400 text-center">Select a paragraph to view guidance</p>
      </div>
    );
  }

  const wordCount = paragraph.content ? paragraph.content.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Writing Guidance</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Title - status - word count on one line */}
        <div>
          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {paragraph.title || 'Untitled Paragraph'} -{' '}
            <span className="text-sm text-gray-700 dark:text-gray-300">{paragraph.status}</span>
            {' - '}
            <span className="text-sm text-gray-700 dark:text-gray-300">{wordCount} words</span>
          </p>
        </div>

        {/* Key Points to Cover */}
        {paragraph.points.length > 0 && (
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
              Key Points to Cover
            </label>
            <div className="space-y-3">
              {paragraph.points
                .sort((a, b) => a.order - b.order)
                .map((point) => (
                  <div key={point.id} className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">{point.title || 'Untitled Point'}</p>
                        {point.notes && <p className="text-xs text-gray-600 dark:text-gray-400">{point.notes}</p>}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Paragraph feedback from AI review */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Paragraph Feedback
          </label>

          <div className="space-y-2">
            {isReviewing && (
              <p className="text-sm text-gray-600 dark:text-gray-300">Reviewing paragraph...</p>
            )}

            {feedbackError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-sm text-red-700 dark:text-red-300">{feedbackError}</p>
              </div>
            )}

            {!isReviewing && !feedbackError && !feedback && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click Review Paragraph to get structured feedback.
              </p>
            )}

            {feedback && (
              <div className="space-y-2">
                <div className="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Clarity</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{feedback.clarity}</p>
                </div>
                <div className="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Focus</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{feedback.focus}</p>
                </div>
                <div className="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Evidence</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{feedback.evidence}</p>
                </div>
                <div className="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">Flow</p>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{feedback.flow}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Research Assistant */}
        {showResearchAssistant && (
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
              Suggested Evidence
            </label>
            <ResearchAssistantPanel
              suggestions={researchSuggestions}
              validation={researchValidation ?? null}
              error={researchError}
              isFetching={isFetchingResearch}
              onInsertText={onInsertText}
              onGenerateMore={onGenerateMoreEvidence}
            />
          </div>
        )}

        {/* Notes (planning notes merged into general notes) */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Notes</label>

          <div className="space-y-3">
            <textarea
              value={generalDraft}
              onChange={(e) => setGeneralDraft(e.target.value)}
              placeholder="Add a general note..."
              className="w-full min-h-20 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="button" onClick={submitGeneral} className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Add General Note</button>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-900/40">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Note For Selected Text</p>
              <p className="text-xs text-gray-700 dark:text-gray-300 mb-2">{selectedText.trim() ? `"${selectedText}"` : 'Select text in the editor first.'}</p>
              <textarea
                value={selectionDraft}
                onChange={(e) => setSelectionDraft(e.target.value)}
                placeholder="Add note linked to selected text..."
                className="w-full min-h-20 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={submitSelection} disabled={!selectedText.trim()} className="mt-2 w-full px-3 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed">Add Selected Text Note</button>
            </div>

            {/* Existing notes: include planning notes (paragraph.notes) and generalNotes */}
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Existing Notes</p>
              <div className="space-y-2">
                {paragraph.notes && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{paragraph.notes}</p>
                  </div>
                )}

                {(paragraph.generalNotes ?? []).map((note, idx) => (
                  <div key={`${idx}-${note.slice(0, 20)}`} className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-2">
                    <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected-text notes list */}
            {(paragraph.selectionNotes?.length ?? 0) > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Selected Text Notes</p>
                <div className="space-y-2">
                  {(paragraph.selectionNotes ?? []).map((item) => (
                    <div key={item.id} className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2">
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-1">"{item.selectedText}"</p>
                      <p className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div>
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Writing Tips</label>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-2">
              <li>• Cover all key points while writing</li>
              <li>• Use the planning notes as a guide</li>
              <li>• Write a complete draft before editing</li>
              <li>• Mark complete when you're ready to move on</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
