import React, { useRef, useEffect } from 'react';
import { highlightMarkdown } from '../utils/parser';

interface EditorProps {
  content: string;
  onChange: (value: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Sync scroll
  const handleScroll = () => {
    if (textareaRef.current && backdropRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  useEffect(() => {
    // Initial sync
    handleScroll();
  }, [content]);

  return (
    <div className="editor-container relative h-full w-full bg-obsidian">
      {/* 
         The Backdrop:
         Renders the highlighted HTML.
         It sits BEHIND the textarea. 
      */}
      <div 
        ref={backdropRef}
        className="editor-layer backdrop"
        dangerouslySetInnerHTML={{ __html: highlightMarkdown(content) }}
      />
      
      {/* 
         The Input:
         Transparent background, visible text (or semi-transparent text to let color show through if desired).
         Here we keep text semi-visible for contrast, but relying on backdrop for decorations like code block backgrounds.
      */}
      <textarea
        ref={textareaRef}
        className="editor-layer input-area"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        spellCheck={false}
        placeholder="Start typing..."
      />
    </div>
  );
};