import { FileSystemAdapter, FileNode } from '../types/adapter';
import { INITIAL_FILES } from '../../constants';

// We'll use a simple in-memory map to simulate a filesystem for the web preview
// In a real "Local-First" web app, this might use OPFS (Origin Private File System)
let MEMORY_FS: Record<string, string> = {
  '1': INITIAL_FILES[0].children![0].content!,
  '2-1': INITIAL_FILES[0].children![1].children![0].content!,
  '2-2': INITIAL_FILES[0].children![1].children![1].content!,
  '3': INITIAL_FILES[0].children![2].content!
};

export class WebAdapter implements FileSystemAdapter {
  getPlatform(): 'web' | 'electron' | 'obsidian' {
    return 'web';
  }

  async readDirectory(path: string): Promise<FileNode[]> {
    // Return static structure for demo
    return INITIAL_FILES;
  }

  async readFile(path: string): Promise<string> {
    return MEMORY_FS[path] || '';
  }

  async writeFile(path: string, content: string): Promise<void> {
    console.log(`[WebAdapter] Writing to ${path}`);
    MEMORY_FS[path] = content;
  }
}
