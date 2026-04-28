import { create } from 'zustand';
import { FileNode, FileSystemAdapter } from '../types/adapter';

export type ViewMode = 'edit' | 'preview' | 'split';

interface EditorState {
  // Data
  files: FileNode[];
  activeFileId: string | null;
  activeContent: string;
  
  // UI State
  viewMode: ViewMode;
  isSidebarOpen: boolean;
  isSaving: boolean;
  searchQuery: string;

  // Actions
  setFiles: (files: FileNode[]) => void;
  setActiveFile: (id: string, content: string) => void;
  setContent: (content: string) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleSidebar: () => void;
  setSaving: (saving: boolean) => void;
  setSearchQuery: (query: string) => void;
  toggleFolder: (id: string) => void;
  
  // Async Actions
  loadVault: (adapter: FileSystemAdapter) => Promise<void>;
  loadFile: (adapter: FileSystemAdapter, path: string) => Promise<void>;
  saveFile: (adapter: FileSystemAdapter, path: string, content: string) => Promise<void>;
}

// Recursive helper to toggle folder
const toggleFolderInTree = (nodes: FileNode[], id: string): FileNode[] => {
  return nodes.map(node => {
    if (node.id === id) return { ...node, isOpen: !node.isOpen };
    if (node.children) return { ...node, children: toggleFolderInTree(node.children, id) };
    return node;
  });
};

export const useEditorStore = create<EditorState>((set, get) => ({
  files: [],
  activeFileId: null,
  activeContent: '',
  viewMode: 'split',
  isSidebarOpen: true,
  isSaving: false,
  searchQuery: '',

  setFiles: (files) => set({ files }),
  setActiveFile: (id, content) => set({ activeFileId: id, activeContent: content }),
  setContent: (content) => set({ activeContent: content }),
  setViewMode: (viewMode) => set({ viewMode }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSaving: (isSaving) => set({ isSaving }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  toggleFolder: (id) => set((state) => ({ files: toggleFolderInTree(state.files, id) })),

  loadVault: async (adapter) => {
    const files = await adapter.readDirectory('/');
    set({ files });
  },

  loadFile: async (adapter, path) => {
    const content = await adapter.readFile(path);
    set({ activeFileId: path, activeContent: content });
  },

  saveFile: async (adapter, path, content) => {
    set({ isSaving: true });
    await adapter.writeFile(path, content);
    // Debounce visual feedback
    setTimeout(() => set({ isSaving: false }), 500);
  }
}));
