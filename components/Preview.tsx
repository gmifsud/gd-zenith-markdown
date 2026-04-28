import React from 'react';
import { parseMarkdown } from '../utils/parser';

interface PreviewProps {
  content: string;
}

export const Preview: React.FC<PreviewProps> = ({ content }) => {
  const html = parseMarkdown(content);

  return (
    <div 
      className="h-full w-full p-8 overflow-y-auto prose prose-invert prose-p:text-gray-300 max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};