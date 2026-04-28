// Simple regex-based parser for the Preview pane
export const parseMarkdown = (text: string): string => {
  let html = text
    // Header 1
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4 mt-6 text-primary">$1</h1>')
    // Header 2
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 mt-5 text-primary">$1</h2>')
    // Header 3
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2 mt-4 text-primary">$1</h3>')
    // Bold
    .replace(/\*\*(.*)\*\*/gim, '<strong class="text-primary font-bold">$1</strong>')
    // Italic
    .replace(/\*(.*)\*/gim, '<em class="italic text-primary">$1</em>')
    // Blockquote
    .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-accent pl-4 italic text-muted my-4">$1</blockquote>')
    // List Items
    .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc text-primary">$1</li>')
    // Code Block
    .replace(/```([^`]+)```/gim, '<pre class="bg-surface p-4 rounded-md my-4 font-mono text-sm text-accent overflow-x-auto">$1</pre>')
    // Inline Code
    .replace(/`([^`]+)`/gim, '<code class="bg-surface px-1.5 py-0.5 rounded text-accent font-mono text-sm">$1</code>')
    // Link
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-accent hover:underline">$1</a>')
    // Line breaks
    .replace(/\n/gim, '<br />');

  return html;
};

// Logic for the Editor Backdrop (Syntax Highlighting)
// This returns HTML string with classes that match our CSS in index.html
export const highlightMarkdown = (text: string): string => {
  if (!text) return '';
  
  // Escape HTML first to prevent injection in the backdrop
  let safeText = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // We need to be careful with replacing because regexes destroy the original structure if not careful.
  // For the backdrop, we just want to wrap known patterns in spans.
  // We will process in specific order to avoid nested tag soup issues in a simple regex parser.

  // Headers
  safeText = safeText.replace(/^(#+ )(.*$)/gim, '<span class="hl-header">$1$2</span>');
  
  // Code Blocks (multi-line) - simple approximation
  safeText = safeText.replace(/```([\s\S]*?)```/gim, '<span class="hl-code">```$1```</span>');
  
  // Inline code
  safeText = safeText.replace(/`([^`]+)`/gim, '<span class="hl-code">`$1`</span>');

  // Bold
  safeText = safeText.replace(/\*\*([^*]+)\*\*/g, '<span class="hl-bold">**$1**</span>');
  
  // Lists
  safeText = safeText.replace(/^(\s*[-*+] )(.*)/gim, '<span class="hl-list">$1</span>$2');

  return safeText + '\n'; // Add newline to ensure scrolling matches
};
