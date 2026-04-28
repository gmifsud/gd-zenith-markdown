export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string; // Only for files
  children?: FileNode[]; // Only for folders
  isOpen?: boolean; // For folder toggle state
}

export type ViewMode = 'edit' | 'preview' | 'split';

export interface EditorState {
  activeFileId: string | null;
  files: FileNode[];
  unsavedChanges: boolean;
  isSidebarOpen: boolean;
  viewMode: ViewMode;
  wordCount: number;
  charCount: number;
  isSaving: boolean;
}