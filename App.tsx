import React, { useEffect, useMemo, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Toolbar } from './components/Toolbar';
import { StatusBar } from './components/StatusBar';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useEditorStore } from './src/store/useEditorStore';
import { FileSystemAdapter } from './src/types/adapter';

interface AppProps {
  adapter: FileSystemAdapter;
}

const App: React.FC<AppProps> = ({ adapter }) => {
  // Store
  const { 
    files, 
    activeFileId, 
    activeContent, 
    viewMode, 
    isSidebarOpen, 
    isSaving,
    loadVault,
    loadFile,
    saveFile,
    setContent,
    setViewMode,
    toggleSidebar,
    toggleFolder,
    setActiveFile
  } = useEditorStore();

  // Stats
  const wordCount = useMemo(() => activeContent.trim().split(/\s+/).filter(w => w.length > 0).length, [activeContent]);
  const charCount = activeContent.length;

  // Init
  useEffect(() => {
    loadVault(adapter);
    // Load default file if none active (and if files exist)
    // In a real app we'd wait for files to load then select first
  }, [adapter]);

  // Handle File Selection
  const handleFileSelect = (id: string) => {
    loadFile(adapter, id);
  };

  // Auto-Save Logic
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    
    if (activeFileId) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        saveFile(adapter, activeFileId, newContent);
      }, 2000);
    }
  };

  // Helper for Toolbar
  const handleInsert = (token: string) => {
    handleContentChange(activeContent + token);
  };

  return (
    <div id="deep-focus-app" className="flex flex-col h-screen w-screen bg-obsidian text-primary font-sans overflow-hidden">
      
      {/* Top Header (Dock Handle) */}
      <header className="h-10 flex items-center px-4 border-b border-border bg-obsidian select-none z-50">
        <button 
          onClick={toggleSidebar}
          className="text-muted hover:text-accent transition-colors p-1"
          aria-label="Toggle Sidebar"
        >
          {isSidebarOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>
        <div className="ml-4 text-xs font-mono text-muted opacity-50 flex-1 text-center">
           {adapter.getPlatform().toUpperCase()} / {activeFileId || 'Untitled'}
        </div>
        <div className="w-8" />
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Sidebar */}
        <Sidebar 
          files={files} 
          activeFileId={activeFileId} 
          onFileSelect={handleFileSelect} 
          onToggleFolder={toggleFolder}
          isOpen={isSidebarOpen}
        />

        {/* Editor Area */}
        <main className="flex-1 flex relative overflow-hidden bg-obsidian">
          
          {(viewMode === 'edit' || viewMode === 'split') && (
            <div className={`flex-1 h-full relative border-r border-border/50 transition-all duration-300 ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
              <Editor content={activeContent} onChange={handleContentChange} />
            </div>
          )}

          {(viewMode === 'preview' || viewMode === 'split') && (
            <div className={`flex-1 h-full bg-surface transition-all duration-300 ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
              <Preview content={activeContent} />
            </div>
          )}

          <Toolbar 
            onInsert={handleInsert} 
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </main>

      </div>

      <StatusBar 
        wordCount={wordCount} 
        charCount={charCount} 
        isSaving={isSaving} 
      />
    </div>
  );
};

export default App;
