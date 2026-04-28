import { FileNode } from './types';

export const INITIAL_FILES: FileNode[] = [
  {
    id: 'root',
    name: 'Vault',
    type: 'folder',
    isOpen: true,
    children: [
      {
        id: '1',
        name: 'Welcome.md',
        type: 'file',
        content: `# Welcome to Zenith

This is a **zen-mode** markdown editor designed for deep focus.

## Features
- Distraction-free interface
- Syntax highlighting
- Split view preview
- File system simulation

## Try it out
Type some markdown here. 
- [ ] Create a task
- [x] Complete a task

Code example:
\`\`\`javascript
const zen = true;
if (zen) {
  console.log("Breathe in...");
}
\`\`\`
`
      },
      {
        id: '2',
        name: 'Journal',
        type: 'folder',
        isOpen: true,
        children: [
          {
            id: '2-1',
            name: '2023-10-27.md',
            type: 'file',
            content: '# Daily Entry\n\nToday I focused on architectural patterns.'
          },
          {
            id: '2-2',
            name: 'Ideas.md',
            type: 'file',
            content: '# Project Ideas\n\n1. AI-powered toaster\n2. Blockchain for ants'
          }
        ]
      },
      {
        id: '3',
        name: 'Notes.md',
        type: 'file',
        content: '# Quick Notes\n\nDon\'t forget to drink water.'
      }
    ]
  }
];