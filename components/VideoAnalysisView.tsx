import React, { useState, useRef } from 'react';
import { MonitorPlay, Search, Upload, Loader2, FileVideo } from 'lucide-react';
import { analyzeVideo } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';

const VideoAnalysisView: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
         alert("For this demo, please use video clips smaller than 20MB.");
         return;
      }
      setSelectedVideo(file);
      setVideoPreview(URL.createObjectURL(file));
      setAnalysis('');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedVideo || !prompt.trim()) return;
    
    setIsLoading(true);
    setAnalysis('');

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        
        try {
          const result = await analyzeVideo(base64Data, selectedVideo.type, prompt);
          setAnalysis(result);
        } catch (err: any) {
          console.error(err);
          setAnalysis(err.message || "Could not analyze video. It might be too long or the format is unsupported.");
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(selectedVideo);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/50 dark:bg-black/40 md:rounded-2xl shadow-sm border border-white/20 dark:border-white/10 overflow-hidden transition-colors duration-300 backdrop-blur-sm">
      <div className="bg-fuchsia-600/90 p-5 flex items-center gap-4 shadow-sm z-10 border-b border-transparent backdrop-blur-md">
        <div className="p-2.5 bg-white/20 rounded-lg">
           <MonitorPlay className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-white font-bold text-xl font-display tracking-tight">Video Analysis</h2>
          <p className="text-fuchsia-100 text-xs font-medium uppercase tracking-wider">Extract Intelligence</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row h-[calc(100%-80px)] overflow-hidden">
        {/* Controls */}
        <div className="w-full md:w-80 p-6 border-r border-white/20 dark:border-white/10 bg-white/30 dark:bg-black/20 flex flex-col overflow-y-auto transition-colors duration-300 backdrop-blur-sm">
          <div className="mb-8">
            <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">1. Source Video</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-300 dark:border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-fuchsia-500 hover:bg-fuchsia-50/50 dark:hover:bg-fuchsia-900/10 transition-all group bg-white/60 dark:bg-black/40 backdrop-blur-sm"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleVideoUpload} 
                className="hidden" 
                accept="video/*"
              />
              <FileVideo className="w-8 h-8 text-neutral-400 dark:text-neutral-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                 {selectedVideo ? selectedVideo.name : "Click to upload (<20MB)"}
              </p>
            </div>
          </div>

          <div className="mb-8 flex-1">
            <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">2. Query Parameters</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Summarize key points, Transcribe speech..."
              className="w-full p-4 rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 text-neutral-900 dark:text-white focus:ring-2 focus:ring-fuchsia-500 outline-none resize-none h-40 text-sm shadow-sm backdrop-blur-sm"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!selectedVideo || !prompt.trim() || isLoading}
            className="w-full bg-fuchsia-600 text-white py-4 rounded-xl font-bold hover:bg-fuchsia-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-sm uppercase tracking-wider text-sm"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            ANALYZE
          </button>
        </div>

        {/* Output Area */}
        <div className="flex-1 p-8 bg-white/20 dark:bg-black/30 flex flex-col overflow-hidden transition-colors duration-300 backdrop-blur-md">
          {videoPreview && (
            <div className="w-full max-h-[40%] bg-black rounded-xl overflow-hidden mb-8 shrink-0 flex items-center justify-center border-4 border-white dark:border-neutral-800 shadow-md">
              <video 
                key={videoPreview} 
                controls 
                className="h-full w-auto max-w-full" 
                src={videoPreview}
              >
                Your browser does not support video.
              </video>
            </div>
          )}
          
          <div className="flex-1 bg-white/60 dark:bg-black/40 rounded-xl border border-white/40 dark:border-white/10 p-8 overflow-y-auto transition-colors duration-300 shadow-sm backdrop-blur-sm">
             {analysis ? (
               <MarkdownRenderer content={analysis} />
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-600">
                  {isLoading ? (
                    <div className="text-center">
                       <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3 text-fuchsia-500" />
                       <p className="font-display font-medium text-lg text-neutral-800 dark:text-white">Analyzing Frames...</p>
                    </div>
                  ) : (
                    <>
                      <MonitorPlay className="w-16 h-16 mb-4 opacity-10" />
                      <p className="text-sm font-medium">Analysis results display here</p>
                    </>
                  )}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoAnalysisView;