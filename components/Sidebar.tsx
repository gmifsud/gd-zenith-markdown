import React, { useState, useMemo } from 'react';
import { FileText, ChevronRight, ChevronDown, Search, X } from 'lucide-react';
import { FileNode } from '../src/types/adapter'; // Updated import
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '../src/store/useEditorStore';

interface SidebarProps {
  files: FileNode[];
  activeFileId: string | null;
  onFileSelect: (id: string) => void;
  onToggleFolder: (id: string) => void;
  isOpen: boolean;
}

// Helper to filter nodes recursively
const filterNodes = (nodes: FileNode[], query: string): FileNode[] => {
  if (!query) return nodes;
  const lowerQuery = query.toLowerCase();

  return nodes.map(node => {
    const isMatch = node.name.toLowerCase().includes(lowerQuery);
    
    if (node.type === 'folder' && node.children) {
      if (isMatch) return { ...node, isOpen: true };
      const filteredChildren = filterNodes(node.children, query);
      if (filteredChildren.length > 0) {
        return { ...node, children: filteredChildren, isOpen: true };
      }
    }
    
    return isMatch ? node : null;
  }).filter((n): n is FileNode => n !== null);
};

const FileTreeItem: React.FC<{
  node: FileNode;
  activeFileId: string | null;
  level: number;
  onFileSelect: (id: string) => void;
  onToggleFolder: (id: string) => void;
}> = ({ node, activeFileId, level, onFileSelect, onToggleFolder }) => {
  const isFolder = node.type === 'folder';
  const isActive = node.id === activeFileId;
  const paddingLeft = `${level * 12 + 12}px`;

  return (
    <div className="select-none">
      <div
        className={`
          group flex items-center py-1.5 px-2 cursor-pointer text-sm transition-colors duration-200
          ${isActive ? 'bg-accent/10 text-accent' : 'text-muted hover:text-primary hover:bg-surface'}
        `}
        style={{ paddingLeft }}
        onClick={(e) => {
          e.stopPropagation();
          if (isFolder) {
            onToggleFolder(node.id);
          } else {
            onFileSelect(node.id);
          }
        }}
      >
        <span className="mr-2 opacity-70">
          {isFolder ? (
             node.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : (
            <FileText size={14} />
          )}
        </span>
        <span className="truncate">{node.name}</span>
      </div>

      <AnimatePresence>
        {isFolder && node.isOpen && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {node.children.map((child) => (
              <FileTreeItem
                key={child.id}
                node={child}
                activeFileId={activeFileId}
                level={level + 1}
                onFileSelect={onFileSelect}
                onToggleFolder={onToggleFolder}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ files, activeFileId, onFileSelect, onToggleFolder, isOpen }) => {
  const { searchQuery, setSearchQuery } = useEditorStore();

  const displayedFiles = useMemo(() => {
    return filterNodes(files, searchQuery);
  }, [files, searchQuery]);

  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{ 
        width: isOpen ? 260 : 0, 
        opacity: isOpen ? 1 : 0 
      }}
      className="h-full bg-obsidian border-r border-border flex-shrink-0 overflow-hidden flex flex-col"
    >
      <div className="p-4 border-b border-border flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-muted">Explorer</span>
        </div>
        
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                <Search size={12} className="text-muted group-focus-within:text-accent transition-colors" />
            </div>
            <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-surface border border-border rounded-md py-1.5 pl-8 pr-8 text-xs text-primary placeholder-muted focus:outline-none focus:border-accent transition-colors"
            />
            {searchQuery && (
                <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-2 text-muted hover:text-primary"
                >
                    <X size={12} />
                </button>
            )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        {displayedFiles.length > 0 ? (
            displayedFiles.map((node) => (
            <FileTreeItem
                key={node.id}
                node={node}
                activeFileId={activeFileId}
                level={0}
                onFileSelect={onFileSelect}
                onToggleFolder={onToggleFolder}
            />
            ))
        ) : (
            <div className="px-4 py-8 text-center text-xs text-muted italic">
                No files found
            </div>
        )}
      </div>
    </motion.aside>
  );
};
