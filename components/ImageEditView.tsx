import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Wand2, Upload, Download, Loader2 } from 'lucide-react';
import { editImage } from '../services/geminiService';

const ImageEditView: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
        setMimeType(file.type);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!selectedImage || !prompt.trim()) return;
    
    setIsLoading(true);
    setGeneratedImage(null);
    
    try {
      const base64Data = selectedImage.split(',')[1];
      const resultBase64 = await editImage(base64Data, mimeType, prompt);
      setGeneratedImage(`data:image/png;base64,${resultBase64}`);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to edit image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/50 dark:bg-black/40 md:rounded-2xl shadow-sm border border-white/20 dark:border-white/10 overflow-hidden transition-colors duration-300 backdrop-blur-sm">
      <div className="bg-amber-600/90 p-5 flex items-center gap-4 shadow-sm z-10 border-b border-transparent backdrop-blur-md">
        <div className="p-2.5 bg-white/20 rounded-lg">
           <ImageIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-white font-bold text-xl font-display tracking-tight">Magic Editor</h2>
          <p className="text-amber-100 text-xs font-medium uppercase tracking-wider">Visual Manipulation</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row h-[calc(100%-80px)] overflow-hidden">
        {/* Controls */}
        <div className="w-full md:w-80 p-6 border-r border-white/20 dark:border-white/10 bg-white/30 dark:bg-black/20 flex flex-col overflow-y-auto transition-colors duration-300 backdrop-blur-sm">
          <div className="mb-8">
            <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">1. Upload Image</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-300 dark:border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-all group bg-white/60 dark:bg-black/40 backdrop-blur-sm"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
              <Upload className="w-8 h-8 text-neutral-400 dark:text-neutral-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Click to upload</p>
            </div>
          </div>

          <div className="mb-8 flex-1">
            <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 mb-3 uppercase tracking-wider">2. Describe Changes</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., Add a retro filter, Remove the background person..."
              className="w-full p-4 rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 text-neutral-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none resize-none h-40 text-sm placeholder-neutral-400 dark:placeholder-neutral-600 shadow-sm backdrop-blur-sm"
            />
          </div>

          <button
            onClick={handleEdit}
            disabled={!selectedImage || !prompt.trim() || isLoading}
            className="w-full bg-amber-600 text-white py-4 rounded-xl font-bold hover:bg-amber-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-sm uppercase tracking-wider text-sm"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
            GENERATE
          </button>
        </div>

        {/* Preview Area */}
        <div className="flex-1 p-8 bg-white/20 dark:bg-black/30 flex flex-col items-center justify-center overflow-auto transition-colors duration-300 backdrop-blur-md">
          {generatedImage ? (
             <div className="relative max-w-full max-h-full rounded-xl shadow-lg overflow-hidden group border-4 border-white dark:border-neutral-800">
               <img src={generatedImage} alt="Generated" className="max-w-full max-h-[80vh] object-contain" />
               <a 
                 href={generatedImage} 
                 download="edited-image.png"
                 className="absolute bottom-6 right-6 bg-white dark:bg-neutral-800 p-3 rounded-full shadow-md text-neutral-700 dark:text-white hover:text-amber-600 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
               >
                 <Download className="w-6 h-6" />
               </a>
             </div>
          ) : selectedImage ? (
            <div className="relative max-w-full max-h-full">
              <img src={selectedImage} alt="Original" className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-md opacity-80 border-2 border-white/40 dark:border-white/10 grayscale-[30%]" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <span className="bg-neutral-900/80 backdrop-blur text-white px-4 py-2 rounded-lg text-sm font-medium">Original Image</span>
              </div>
            </div>
          ) : (
            <div className="text-center text-neutral-400 dark:text-neutral-500">
               <ImageIcon className="w-20 h-20 mx-auto mb-6 opacity-20" />
               <p className="font-medium text-lg">Upload an image to start magic editing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageEditView;