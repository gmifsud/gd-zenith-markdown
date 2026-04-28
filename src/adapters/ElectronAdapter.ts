import { FileSystemAdapter, FileNode } from '../types/adapter';

// Declare the window.electron API exposed by preload.js
declare global {
  interface Window {
    electron: {
      readFile: (path: string) => Promise<string>;
      writeFile: (path: string, content: string) => Promise<void>;
      readDirectory: (path: string) => Promise<FileNode[]>;
    }
  }
}

export class ElectronAdapter implements FileSystemAdapter {
  getPlatform(): 'web' | 'electron' | 'obsidian' {
    return 'electron';
  }

  async readDirectory(path: string): Promise<FileNode[]> {
    if (!window.electron) throw new Error("Electron API not found");
    return window.electron.readDirectory(path);
  }

  async readFile(path: string): Promise<string> {
    if (!window.electron) throw new Error("Electron API not found");
    return window.electron.readFile(path);
  }

  async writeFile(path: string, content: string): Promise<void> {
    if (!window.electron) throw new Error("Electron API not found");
    return window.electron.writeFile(path, content);
  }
}
