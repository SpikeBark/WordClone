import { createContext, useContext, useState, useEffect } from 'react';
import Editor from './components/Editor';
import Home from './components/Home';
import OutlineEditor from './components/OutlineEditor';
import ParagraphWriter from './components/ParagraphWriter';
import DocumentSetupModal, { type DocumentMetadata } from './components/DocumentSetupModal';
import { generateDefaultOutline } from './utils/outlineGenerator';
import type { Outline } from './types/outline';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function App() {
  const [view, setView] = useState<'home' | 'outline' | 'writer' | 'editor'>('home');
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [currentOutline, setCurrentOutline] = useState<Outline | null>(null);
  const [currentMetadata, setCurrentMetadata] = useState<DocumentMetadata | null>(null);

  const openSetupModal = () => setShowSetupModal(true);
  const closeSetupModal = () => setShowSetupModal(false);

  const handleCreate = (metadata: DocumentMetadata) => {
    setShowSetupModal(false);
    setCurrentMetadata(metadata);

    // Generate default outline from metadata
    const outline = generateDefaultOutline(
      metadata.topic || 'Untitled Document',
      metadata as any
    );
    setCurrentOutline(outline);
    setView('outline');
  };

  const handleBackFromOutline = () => {
    setView('home');
    setCurrentOutline(null);
    setCurrentMetadata(null);
  };

  const handleStartWriting = (updatedOutline: Outline) => {
    setCurrentOutline(updatedOutline);
    setView('writer');
  };

  const handleBackFromWriter = () => {
    setView('outline');
  };

  const handleSaveOutline = (updatedOutline: Outline) => {
    setCurrentOutline(updatedOutline);
  };

  return (
    <ThemeProvider>
      {view === 'home' && <Home onCreate={openSetupModal} />}
      {view === 'outline' && currentOutline && (
        <OutlineEditor
          initialOutline={currentOutline}
          documentMetadata={currentMetadata}
          onBack={handleBackFromOutline}
          onStartWriting={handleStartWriting}
        />
      )}
      {view === 'writer' && currentOutline && (
        <ParagraphWriter
          initialOutline={currentOutline}
          onBack={handleBackFromWriter}
          onSave={handleSaveOutline}
        />
      )}
      {view === 'editor' && (
        <Editor />
      )}
      {showSetupModal && (
        <DocumentSetupModal onClose={closeSetupModal} onCreate={handleCreate} />
      )}
    </ThemeProvider>
  );
}

export default App;
