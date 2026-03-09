
export default function Home({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">WordClone</h1>
          <p className="text-xl text-blue-100">Plan your writing visually, then write with confidence</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* CTA Section */}
        <div className="mb-24">
          <button
            onClick={onCreate}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg mb-6"
          >
            ✨ Create New Document
          </button>
        </div>

        {/* Workflow Visualization */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-12 text-center">
            Your Writing Journey in 3 Steps
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1: Setup */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6 border-2 border-blue-600">
                <span className="text-3xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">
                Step 1: Setup
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                Tell us about your document: type, topic, audience, tone, and more.
              </p>
              <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg w-full">
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Select:</span> Essay, Article, Blog Post, Research Paper, Report, or Story
                </p>
              </div>
            </div>

            {/* Arrow 1 */}
            <div className="hidden md:flex items-center justify-center">
              <div className="text-4xl text-blue-600 dark:text-blue-400">→</div>
            </div>

            {/* Step 2: Outline */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6 border-2 border-green-600">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">
                Step 2: Outline
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                See your structure as bubbles. Drag, edit, and organize your ideas.
              </p>
              <div className="mt-4 bg-green-50 dark:bg-green-900/30 p-4 rounded-lg w-full">
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Interact:</span> Drag paragraphs, add notes, customize structure
                </p>
              </div>
            </div>

            {/* Arrow 2 */}
            <div className="hidden md:flex items-center justify-center">
              <div className="text-4xl text-green-600 dark:text-green-400">→</div>
            </div>

            {/* Step 3: Write */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-6 border-2 border-purple-600">
                <span className="text-3xl">✍️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 text-center">
                Step 3: Write
              </h3>
              <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                Jump to the editor with your outline ready. Write with direction.
              </p>
              <div className="mt-4 bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg w-full">
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Write:</span> Rich text editor with full formatting
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bubble Preview */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            Meet the Bubble Flowchart
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Organize your document structure visually. Each section and paragraph becomes an interactive bubble you can customize and rearrange.
          </p>

          {/* Visual Mockup */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 overflow-x-auto">
            <div className="space-y-6 min-w-max">
              {/* Section Bubble */}
              <div className="flex items-center gap-6">
                <div className="w-48 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg relative">
                  <h4 className="font-bold text-lg mb-3">Introduction</h4>
                  <p className="text-sm opacity-90 mb-4">Hook the reader, establish context</p>
                  <button className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-white">
                    + Add Para
                  </button>
                </div>

                {/* Connector */}
                <div className="flex flex-col gap-2 h-32">
                  <div className="w-8 h-1 bg-gray-400 dark:bg-gray-600"></div>
                  <div className="w-1 h-6 bg-gray-400 dark:bg-gray-600"></div>
                </div>

                {/* Paragraph Bubbles */}
                <div className="flex flex-col gap-4">
                  <div className="w-40 bg-gradient-to-br from-green-400 to-green-500 text-white rounded-xl p-4 shadow-md">
                    <h5 className="font-semibold text-sm mb-1">Hook the Audience</h5>
                    <p className="text-xs opacity-90">Open with compelling question or fact</p>
                  </div>
                  <div className="w-40 bg-gradient-to-br from-green-400 to-green-500 text-white rounded-xl p-4 shadow-md">
                    <h5 className="font-semibold text-sm mb-1">Background Info</h5>
                    <p className="text-xs opacity-90">Provide necessary context</p>
                  </div>
                </div>
              </div>

              {/* Second Section */}
              <div className="flex items-center gap-6">
                <div className="w-48 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
                  <h4 className="font-bold text-lg mb-3">Main Arguments</h4>
                  <p className="text-sm opacity-90 mb-4">Build your core points</p>
                  <button className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-white">
                    + Add Para
                  </button>
                </div>

                <div className="flex flex-col gap-2 h-32">
                  <div className="w-8 h-1 bg-gray-400 dark:bg-gray-600"></div>
                  <div className="w-1 h-6 bg-gray-400 dark:bg-gray-600"></div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="w-40 bg-gradient-to-br from-green-400 to-green-500 text-white rounded-xl p-4 shadow-md">
                    <h5 className="font-semibold text-sm mb-1">Point 1: Evidence</h5>
                    <p className="text-xs opacity-90">Support with facts</p>
                  </div>
                  <div className="w-40 bg-gradient-to-br from-green-400 to-green-500 text-white rounded-xl p-4 shadow-md">
                    <h5 className="font-semibold text-sm mb-1">Point 2: Analysis</h5>
                    <p className="text-xs opacity-90">Explain significance</p>
                  </div>
                  <div className="w-40 bg-gradient-to-br from-green-400 to-green-500 text-white rounded-xl p-4 shadow-md">
                    <h5 className="font-semibold text-sm mb-1">Point 3: Impact</h5>
                    <p className="text-xs opacity-90">Connect to bigger picture</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-600 dark:text-gray-400 mt-6 text-sm">
            ℹ️ All bubbles are fully editable. Add notes, drag to reorder, delete, or create new ones.
          </p>
        </div>

        {/* Features */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-12 text-center">
            Why Use WordClone?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "📊", title: "Visual Planning", desc: "See your entire document structure at once" },
              { icon: "🔄", title: "Drag & Drop", desc: "Reorganize paragraphs with simple dragging" },
              { icon: "💡", title: "Idea Management", desc: "Store notes, arguments, and evidence in bubbles" },
              { icon: "🎯", title: "Smart Templates", desc: "Auto-generated outlines for 7 document types" },
              { icon: "🌙", title: "Dark Mode", desc: "Comfortable writing at any time of day" },
              { icon: "⚡", title: "Quick Workflow", desc: "Setup → Plan → Write in just three steps" },
            ].map((feature, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center py-12">
          <div className="inline-block bg-blue-50 dark:bg-blue-900/30 rounded-lg p-8 border border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Ready to plan your document?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
              Start by creating a new document. We'll guide you through setup, show you the outline editor, and get you writing.
            </p>
            <button
              onClick={onCreate}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Create Your First Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
