export interface FileNode {
  id: string; // Absolute path or unique ID
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  isOpen?: boolean; // UI state for folders
}

/**
 * The Port:
 * Describes how the Core application interacts with the outside world.
 */
export interface FileSystemAdapter {
  // Core FS Operations
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  readDirectory(path: string): Promise<FileNode[]>;
  
  // Metadata
  getPlatform(): 'web' | 'electron' | 'obsidian';
}
