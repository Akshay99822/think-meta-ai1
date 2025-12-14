import React from 'react';

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Headers
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold mt-4 mb-2 text-indigo-900 dark:text-green-400">{line.slice(4)}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-5 mb-2 text-indigo-900 dark:text-green-400">{line.slice(3)}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-6 mb-3 text-indigo-900 dark:text-green-500">{line.slice(2)}</h1>;
      
      // Bullet points
      if (line.trim().startsWith('- ')) {
        return (
          <li key={i} className="ml-4 list-disc pl-1 mb-1 text-slate-700 dark:text-gray-300">
            {parseInline(line.trim().substring(2))}
          </li>
        );
      }
      
      // Empty lines
      if (line.trim() === '') return <div key={i} className="h-2"></div>;

      // Paragraphs
      return <p key={i} className="mb-2 text-slate-700 dark:text-gray-300 leading-relaxed">{parseInline(line)}</p>;
    });
  };

  const parseInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-indigo-700 dark:text-green-300">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} className="bg-slate-200 dark:bg-gray-800 px-1 py-0.5 rounded text-sm text-pink-600 dark:text-green-400 font-mono border border-slate-300 dark:border-green-900">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return <div className="markdown-content text-sm md:text-base">{formatText(content)}</div>;
};

export default MarkdownRenderer;