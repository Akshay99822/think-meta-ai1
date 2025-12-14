import React, { useState } from 'react';
import { FileText, Sparkles, Copy, ArrowRight, Eraser } from 'lucide-react';
import { generateSummary } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';

const SummaryView: React.FC = () => {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setSummary('');
    try {
      const result = await generateSummary(text);
      setSummary(result);
    } catch (error: any) {
      console.error(error);
      setSummary(error.message || "Sorry, I couldn't summarize that text right now.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/50 dark:bg-black/40 md:rounded-2xl shadow-sm border border-white/20 dark:border-white/10 overflow-hidden transition-colors duration-300 backdrop-blur-sm">
      <div className="bg-rose-600/90 p-5 flex items-center gap-4 shadow-sm z-10 border-b border-transparent backdrop-blur-md">
        <div className="p-2.5 bg-white/20 rounded-lg">
           <FileText className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-white font-bold text-xl font-display tracking-tight">Note Maker</h2>
      </div>

      <div className="flex-1 flex flex-col md:flex-row h-[calc(100%-72px)] overflow-hidden">
        {/* Input Section */}
        <div className="flex-1 flex flex-col p-6 border-b md:border-b-0 md:border-r border-white/20 dark:border-white/10 bg-white/30 dark:bg-black/20 transition-colors duration-300 backdrop-blur-sm">
          <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-3 flex items-center justify-between uppercase tracking-wider">
            <span>Source Text</span>
            {text && (
                <button onClick={() => setText('')} className="text-[10px] bg-white/50 dark:bg-white/10 border border-neutral-200 dark:border-white/20 px-2 py-1 rounded text-red-600 hover:text-red-700 dark:text-red-400 flex items-center gap-1 transition-colors">
                   <Eraser className="w-3 h-3" /> CLEAR
                </button>
            )}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 w-full p-4 rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 text-neutral-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none resize-none transition-all text-sm leading-relaxed placeholder-neutral-400 dark:placeholder-neutral-600 shadow-sm backdrop-blur-sm"
            placeholder="Paste a long paragraph, an article, or your rough notes here..."
          />
          <button
            onClick={handleSummarize}
            disabled={!text.trim() || isLoading}
            className="mt-6 w-full bg-rose-600 text-white py-4 rounded-xl font-bold hover:bg-rose-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            {isLoading ? (
               <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
               <>
                 <Sparkles className="w-5 h-5" /> SUMMARIZE
               </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="flex-1 flex flex-col p-6 bg-transparent overflow-hidden transition-colors duration-300">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Generated Notes</span>
            {summary && (
              <button 
                onClick={() => navigator.clipboard.writeText(summary)}
                className="p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto bg-white/40 dark:bg-black/30 rounded-xl border border-white/30 dark:border-white/10 p-8 shadow-sm backdrop-blur-md">
            {summary ? (
              <MarkdownRenderer content={summary} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-600">
                <FileText className="w-16 h-16 mb-4 opacity-10" />
                <p className="text-sm font-medium">Summary will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryView;