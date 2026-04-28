import { Plugin, WorkspaceLeaf, ItemView } from 'obsidian';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ObsidianAdapter } from './src/adapters/ObsidianAdapter';

const VIEW_TYPE_ZENITH = 'zenith-markdown-view';

class ZenithView extends ItemView {
  root: ReactDOM.Root | null = null;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return VIEW_TYPE_ZENITH;
  }

  getDisplayText() {
    return 'Zenith Editor';
  }

  async onOpen() {
    const container = (this as any).containerEl.children[1];
    container.empty();
    
    const div = container.createEl('div');
    div.id = 'root'; 

    this.root = ReactDOM.createRoot(div);
    const adapter = new ObsidianAdapter((this as any).app);

    this.root.render(
      React.createElement(App, { adapter })
    );
  }

  async onClose() {
    if (this.root) {
      this.root.unmount();
    }
  }
}

export default class ZenithPlugin extends Plugin {
  async onload() {
    (this as any).registerView(
      VIEW_TYPE_ZENITH,
      (leaf: WorkspaceLeaf) => new ZenithView(leaf)
    );

    (this as any).addRibbonIcon('edit', 'Open Zenith', () => {
      this.activateView();
    });
  }

  async activateView() {
    const { workspace } = (this as any).app;

    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(VIEW_TYPE_ZENITH);

    if (leaves.length > 0) {
      // A leaf with our view already exists, use that
      leaf = leaves[0];
    } else {
      // Our view could not be found in the workspace, create a new leaf
      // in the right sidebar for example
      leaf = workspace.getRightLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE_ZENITH, active: true });
    }

    // "Reveal" the leaf in case it is in a collapsed sidebar
    workspace.revealLeaf(leaf);
  }
}