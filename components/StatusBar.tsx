import React from 'react';
import { Check, Cloud } from 'lucide-react';

interface StatusBarProps {
  wordCount: number;
  charCount: number;
  isSaving: boolean;
}

export const StatusBar: React.FC<StatusBarProps> = ({ wordCount, charCount, isSaving }) => {
  return (
    <div className="h-8 bg-obsidian border-t border-border flex items-center justify-between px-4 text-[10px] uppercase tracking-wider text-muted select-none z-40">
      <div className="flex items-center gap-4">
        <span>{wordCount} Words</span>
        <span>{charCount} Characters</span>
      </div>
      <div className="flex items-center gap-2">
        {isSaving ? (
          <>
            <Cloud size={12} className="animate-pulse text-accent" />
            <span className="text-accent">Saving...</span>
          </>
        ) : (
          <>
            <Check size={12} className="text-green-500" />
            <span>Saved</span>
          </>
        )}
      </div>
    </div>
  );
};