import { createContext, useContext, useState, useEffect } from 'react';
import Editor from './components/Editor';
import Home from './components/Home';
import DocumentSetupModal, { type DocumentMetadata } from './components/DocumentSetupModal';

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
  const [openEditorKey, setOpenEditorKey] = useState<number | null>(null);
  const [showSetupModal, setShowSetupModal] = useState(false);

  const openSetupModal = () => setShowSetupModal(true);
  const closeSetupModal = () => setShowSetupModal(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCreate = (_metadata: DocumentMetadata) => {
    setShowSetupModal(false);
    setOpenEditorKey(Date.now());
    // TODO: persist _metadata with the document once storage is implemented
  };

  return (
    <ThemeProvider>
      {openEditorKey ? (
        <Editor key={openEditorKey} />
      ) : (
        <Home onCreate={openSetupModal} />
      )}
      {showSetupModal && (
        <DocumentSetupModal onClose={closeSetupModal} onCreate={handleCreate} />
      )}
    </ThemeProvider>
  );
}

export default App;
