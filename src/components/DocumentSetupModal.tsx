import { useState } from 'react';
import { X } from 'lucide-react';

export interface DocumentMetadata {
  document_type: string;
  topic: string;
  audience: string;
  purpose: string;
  tone: string;
  length_target: string;
  deadline: string;
}

interface DocumentSetupModalProps {
  onClose: () => void;
  onCreate: (metadata: DocumentMetadata) => void;
}

const DOCUMENT_TYPES = ['Essay', 'Article', 'Blog Post', 'Research Paper', 'Report', 'Story', 'Other'];
const AUDIENCES = ['General Audience', 'Students', 'Professionals', 'Academic', 'Technical', 'Other'];
const PURPOSES = ['Inform', 'Persuade', 'Analyze', 'Explain', 'Narrative', 'Report Findings'];
const TONES = ['Formal', 'Casual', 'Conversational', 'Persuasive', 'Academic', 'Technical', 'Neutral'];
const LENGTH_TARGETS = ['500 words', '1000 words', '2000+ words', 'Custom'];

function TagGroup({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(selected === option ? '' : option)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 ${
              selected === option
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-950 dark:border-slate-100'
                : 'text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DocumentSetupModal({ onClose, onCreate }: DocumentSetupModalProps) {
  const [documentType, setDocumentType] = useState('');
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [purpose, setPurpose] = useState('');
  const [tone, setTone] = useState('');
  const [lengthTarget, setLengthTarget] = useState('');
  const [customWordCount, setCustomWordCount] = useState('');
  const [deadline, setDeadline] = useState('');

  const isValid = documentType.trim() !== '' && topic.trim() !== '';

  const handleCreate = () => {
    const resolvedLength = lengthTarget === 'Custom' && customWordCount
      ? `Custom (${customWordCount} words)`
      : lengthTarget;

    const metadata: DocumentMetadata = {
      document_type: documentType,
      topic,
      audience,
      purpose,
      tone,
      length_target: resolvedLength,
      deadline,
    };

    console.log(JSON.stringify(metadata, null, 2));
    onCreate(metadata);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            New Document Setup
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5">
          {/* Document Type */}
          <TagGroup
            label="Document Type"
            options={DOCUMENT_TYPES}
            selected={documentType}
            onSelect={setDocumentType}
          />

          {/* Topic */}
          <div className="mb-5">
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Topic / Working Title
            </label>
            <input
              id="topic"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic or working title…"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
            />
          </div>

          {/* Audience */}
          <TagGroup
            label="Audience"
            options={AUDIENCES}
            selected={audience}
            onSelect={setAudience}
          />

          {/* Purpose */}
          <TagGroup
            label="Purpose"
            options={PURPOSES}
            selected={purpose}
            onSelect={setPurpose}
          />

          {/* Tone */}
          <TagGroup
            label="Tone"
            options={TONES}
            selected={tone}
            onSelect={setTone}
          />

          {/* Length Target */}
          <TagGroup
            label="Length Target"
            options={LENGTH_TARGETS}
            selected={lengthTarget}
            onSelect={setLengthTarget}
          />
          {lengthTarget === 'Custom' && (
            <div className="mb-5 -mt-2">
              <label htmlFor="customWordCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom word count
              </label>
              <input
                id="customWordCount"
                type="number"
                min="1"
                value={customWordCount}
                onChange={(e) => setCustomWordCount(e.target.value)}
                placeholder="e.g. 1500"
                className="w-40 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
              />
            </div>
          )}

          {/* Deadline */}
          <div className="mb-5">
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Deadline <span className="text-gray-400 dark:text-gray-500 font-normal">(optional)</span>
            </label>
            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!isValid}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 hover:bg-slate-700 dark:hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create Document
          </button>
        </div>
      </div>
    </div>
  );
}
