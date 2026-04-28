import { FileSystemAdapter, FileNode } from '../types/adapter';

// Mock types for Obsidian API since we don't have the package installed
type TAbstractFile = any;
type TFile = any;
type TFolder = any;
type App = any;

export class ObsidianAdapter implements FileSystemAdapter {
  app: App;

  constructor(app: App) {
    this.app = app;
  }

  getPlatform(): 'web' | 'electron' | 'obsidian' {
    return 'obsidian';
  }

  private mapTFileToNode(file: TAbstractFile): FileNode {
    if (file.children) {
      // It's a folder
      return {
        id: file.path,
        name: file.name,
        type: 'folder',
        isOpen: false,
        children: file.children.map((c: any) => this.mapTFileToNode(c))
      };
    } else {
      // It's a file
      return {
        id: file.path,
        name: file.name,
        type: 'file'
      };
    }
  }

  async readDirectory(path: string): Promise<FileNode[]> {
    const root = this.app.vault.getRoot();
    // In Obsidian, we usually just get the whole vault tree or a specific folder
    // This is a simplified mapping
    return root.children.map((c: any) => this.mapTFileToNode(c));
  }

  async readFile(path: string): Promise<string> {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (!file) throw new Error(`File not found: ${path}`);
    return await this.app.vault.read(file);
  }

  async writeFile(path: string, content: string): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(path);
    if (file) {
      await this.app.vault.modify(file, content);
    } else {
      await this.app.vault.create(path, content);
    }
  }
}
