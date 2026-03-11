import { BookOpen, BarChart2, ExternalLink, MessageSquare, RefreshCw } from 'lucide-react';
import type { ResearchSuggestions } from '../../types/outline';

interface ResearchAssistantPanelProps {
  suggestions: ResearchSuggestions | null;
  error: string | null;
  isFetching: boolean;
  validation?: any | null;
  onInsertText: (text: string) => void;
  onGenerateMore: () => void;
}

export default function ResearchAssistantPanel({
  suggestions,
  error,
  isFetching,
  validation,
  onInsertText,
  onGenerateMore,
}: ResearchAssistantPanelProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Research Assistant
          </span>
        </div>
        <button
          type="button"
          onClick={onGenerateMore}
          disabled={isFetching}
          className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Generate more evidence"
        >
          <RefreshCw className={`w-3 h-3 ${isFetching ? 'animate-spin' : ''}`} />
          <span>{isFetching ? 'Fetching…' : 'More'}</span>
        </button>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400">
        This paragraph contains claims that could benefit from supporting evidence.
      </p>

      {isFetching && !suggestions && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Fetching research suggestions…
        </p>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-xs text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {suggestions && (
        <div className="space-y-3">
          {/* Statistics */}
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-2">
              <BarChart2 className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-700 dark:text-purple-300">
                Statistics
              </p>
            </div>
            <div className="space-y-2">
              {suggestions.statistics.map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-xs text-gray-700 dark:text-gray-300">• {stat.text}</p>
                      {validation?.statistics?.[idx]?.status && (
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Status: {validation.statistics[idx].status}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onInsertText(stat.text)}
                      className="shrink-0 text-xs px-2 py-0.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                    >
                      Insert
                    </button>
                  </div>
                  {stat.url && (
                    <div className="pl-3">
                      <a
                        href={stat.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span className="truncate">Verify source</span>
                      </a>
                      {validation?.statistics?.[idx]?.status && validation.statistics[idx].status !== 'valid' && (
                        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <p>Original link appears {validation.statistics[idx].status}.</p>
                          <p className="mt-1">Search Google Scholar for this claim:</p>
                          {(validation.statistics[idx].alternatives ?? []).slice(0,1).map((alt: string, aidx: number) => (
                            <p key={aidx} className="mt-1"><a href={alt} target="_blank" rel="noopener noreferrer" className="text-purple-600 dark:text-purple-400 hover:underline">Google Scholar →</a></p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Source removed: model-provided source was confusing; show Scholar alternatives per-stat when needed */}

          {/* Example — no verification link (illustrative content) */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <div className="flex items-center gap-1 mb-2">
              <MessageSquare className="w-3 h-3 text-green-600 dark:text-green-400" />
              <p className="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-green-300">
                Example
              </p>
            </div>
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs text-gray-700 dark:text-gray-300 flex-1">
                • {suggestions.example}
              </p>
              <button
                type="button"
                onClick={() => onInsertText(suggestions.example)}
                className="shrink-0 text-xs px-2 py-0.5 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
