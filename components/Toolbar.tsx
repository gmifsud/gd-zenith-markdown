import React from 'react';
import { Bold, Italic, Link, List, Code, Heading1, Eye, Columns, FileText } from 'lucide-react';
import { ViewMode } from '../types';

interface ToolbarProps {
  onInsert: (token: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onInsert, viewMode, onViewModeChange }) => {
  const tools = [
    { icon: Bold, label: 'Bold', action: () => onInsert('**bold**') },
    { icon: Italic, label: 'Italic', action: () => onInsert('*italic*') },
    { icon: Heading1, label: 'Header', action: () => onInsert('# ') },
    { icon: Link, label: 'Link', action: () => onInsert('[](url)') },
    { icon: List, label: 'List', action: () => onInsert('- ') },
    { icon: Code, label: 'Code', action: () => onInsert('```\ncode\n```') },
  ];

  return (
    <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 glass px-4 py-2 rounded-full flex items-center gap-4 shadow-2xl z-50 transition-all duration-300">
      
      {/* Formatting Tools */}
      <div className="flex items-center gap-2 pr-4 border-r border-white/10">
        {tools.map((Tool, index) => (
          <button
            key={index}
            onClick={Tool.action}
            aria-label={Tool.label}
            className="p-2 text-muted hover:text-accent hover:bg-white/5 rounded-md transition-colors"
          >
            <Tool.icon size={18} />
          </button>
        ))}
      </div>

      {/* View Toggles */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onViewModeChange('edit')}
          className={`p-2 rounded-md transition-colors ${viewMode === 'edit' ? 'text-accent bg-white/10' : 'text-muted hover:text-primary'}`}
          aria-label="Edit Mode"
        >
          <Code size={18} />
        </button>
        <button
          onClick={() => onViewModeChange('split')}
          className={`p-2 rounded-md transition-colors ${viewMode === 'split' ? 'text-accent bg-white/10' : 'text-muted hover:text-primary'}`}
          aria-label="Split View"
        >
          <Columns size={18} />
        </button>
        <button
          onClick={() => onViewModeChange('preview')}
          className={`p-2 rounded-md transition-colors ${viewMode === 'preview' ? 'text-accent bg-white/10' : 'text-muted hover:text-primary'}`}
          aria-label="Preview Mode"
        >
          <Eye size={18} />
        </button>
      </div>

    </div>
  );
};