import React from 'react';

export default function Home({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-3xl mx-auto px-6">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-8">Welcome</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button
            onClick={onCreate}
            className="flex flex-col items-start p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="text-4xl mb-4">📄</div>
            <div className="text-lg font-medium text-gray-900 dark:text-gray-100">Empty document</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Create a new blank document</div>
          </button>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col">
            <div className="text-lg font-medium text-gray-900 dark:text-gray-100">Templates (coming soon)</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Save time with templates for letters, notes, and more.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
