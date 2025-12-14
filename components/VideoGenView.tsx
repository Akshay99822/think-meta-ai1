import React, { useState, useRef, useEffect } from 'react';
import { Video, Play, Upload, Loader2, Music, Film, Trash2, Volume2, VolumeX, AlertTriangle, Key } from 'lucide-react';
import { generateVeoVideo } from '../services/geminiService';

const VideoGenView: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  
  // Audio state
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<'none' | 'quota' | 'general'>('none');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Sync audio with video
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;

    if (!video || !audio) return;

    const handlePlay = () => audio.play().catch(e => console.log("Audio play failed (interaction needed)", e));
    const handlePause = () => audio.pause();
    const handleSeek = () => { audio.currentTime = video.currentTime; };
    const handleVolume = () => { audio.volume = video.volume; };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('seeking', handleSeek);
    video.addEventListener('volumechange', handleVolume);
    
    // Loop sync
    video.loop = true;
    audio.loop = true;

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('seeking', handleSeek);
      video.removeEventListener('volumechange', handleVolume);
    };
  }, [generatedVideoUrl, audioUrl]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setMimeType(file.type);
        setGeneratedVideoUrl(null);
        setErrorState('none');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioUrl(URL.createObjectURL(file));
    }
  };

  const clearAudio = () => {
    setAudioFile(null);
    setAudioUrl(null);
    if (audioInputRef.current) audioInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setGeneratedVideoUrl(null);
    setErrorState('none');

    try {
      const base64Data = selectedImage.split(',')[1];
      const videoUrl = await generateVeoVideo(base64Data, mimeType, aspectRatio, prompt);
      setGeneratedVideoUrl(videoUrl);
    } catch (error: any) {
      console.error(error);
      if (error.message && (error.message.includes('quota') || error.message.includes('paid API key'))) {
        setErrorState('quota');
      } else {
        setErrorState('general');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectKey = async () => {
      if ((window as any).aistudio) {
          try {
              await (window as any).aistudio.openSelectKey();
              setErrorState('none');
          } catch (e) {
              console.error("Failed to open key selector", e);
          }
      } else {
          alert("API Key selection is not available in this environment.");
      }
  };

  return (
    <div className="flex flex-col h-full bg-white/50 dark:bg-black/40 md:rounded-2xl shadow-sm border border-white/20 dark:border-white/10 overflow-hidden transition-all duration-300 backdrop-blur-sm">
      <div className="bg-lime-600/90 p-5 flex items-center gap-4 shadow-sm z-10 border-b border-transparent backdrop-blur-md">
        <div className="p-2.5 bg-white/20 rounded-lg">
           <Video className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-white font-bold text-xl font-display tracking-tight">Photo to Video</h2>
          <p className="text-lime-100 text-xs font-medium uppercase tracking-wider">Powered by Veo</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row h-[calc(100%-80px)] overflow-hidden">
        {/* Controls */}
        <div className="w-full md:w-80 p-6 border-r border-white/20 dark:border-white/10 bg-white/30 dark:bg-black/20 flex flex-col overflow-y-auto transition-colors duration-300 backdrop-blur-sm">
          
          {/* 1. Image Upload */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-lime-800 dark:text-lime-400 mb-2 uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4" /> 1. Upload Photo
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all relative overflow-hidden group bg-white/60 dark:bg-black/40 backdrop-blur-sm ${
                selectedImage 
                ? 'border-lime-500 bg-lime-50/50 dark:bg-lime-900/10' 
                : 'border-white/40 dark:border-white/20 hover:border-lime-500'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
              {selectedImage ? (
                <>
                  <img src={selectedImage} alt="Selected" className="w-full h-32 object-contain rounded mb-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <p className="text-xs text-lime-700 dark:text-lime-400 font-bold">Click to change</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-neutral-400 dark:text-neutral-500 mx-auto mb-2 group-hover:text-lime-500 transition-colors" />
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Click to upload photo</p>
                </>
              )}
            </div>
          </div>

          {/* 2. Description */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-lime-800 dark:text-lime-400 mb-2 uppercase tracking-wider flex items-center gap-2">
              <Film className="w-4 h-4" /> 2. Motion Description
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the movement (e.g., The clouds float across the sky, camera pans left...)"
              className="w-full p-4 rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 text-neutral-900 dark:text-white focus:ring-2 focus:ring-lime-500 outline-none resize-none h-24 text-sm shadow-sm backdrop-blur-sm"
            />
          </div>

          {/* 3. Add Song */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-lime-800 dark:text-lime-400 mb-2 uppercase tracking-wider flex items-center gap-2">
              <Music className="w-4 h-4" /> 3. Add Background Music
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="file" 
                ref={audioInputRef} 
                onChange={handleAudioUpload} 
                className="hidden" 
                accept="audio/*"
              />
              <button
                onClick={() => audioInputRef.current?.click()}
                className="flex-1 py-3 px-3 rounded-xl border border-white/40 dark:border-white/10 bg-white/60 dark:bg-black/40 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-white/80 dark:hover:bg-black/60 flex items-center justify-center gap-2 transition-transform active:scale-95 font-medium backdrop-blur-sm"
              >
                {audioFile ? (
                   <span className="truncate max-w-[120px]">{audioFile.name}</span>
                ) : (
                   "Upload MP3/WAV"
                )}
              </button>
              {audioFile && (
                <button 
                  onClick={clearAudio}
                  className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 4. Settings */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-lime-800 dark:text-lime-400 mb-2 uppercase tracking-wider">4. Aspect Ratio</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setAspectRatio('16:9')}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium border transition-all ${
                  aspectRatio === '16:9' 
                    ? 'bg-lime-100/50 border-lime-500 text-lime-800 dark:bg-lime-900/30 dark:border-lime-500 dark:text-lime-300 shadow-sm' 
                    : 'bg-white/40 dark:bg-black/40 border-white/40 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:border-lime-300'
                }`}
              >
                16:9
              </button>
              <button 
                onClick={() => setAspectRatio('9:16')}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium border transition-all ${
                  aspectRatio === '9:16' 
                    ? 'bg-lime-100/50 border-lime-500 text-lime-800 dark:bg-lime-900/30 dark:border-lime-500 dark:text-lime-300 shadow-sm' 
                    : 'bg-white/40 dark:bg-black/40 border-white/40 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:border-lime-300'
                }`}
              >
                9:16
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-end gap-3">
             <button
              onClick={handleGenerate}
              disabled={!selectedImage || isLoading}
              className="w-full bg-lime-600 text-white py-4 rounded-xl font-bold hover:bg-lime-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg uppercase text-sm tracking-wider"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
              {isLoading ? 'Animating...' : 'GENERATE VIDEO'}
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 p-8 bg-white/20 dark:bg-black/30 flex flex-col items-center justify-center overflow-auto transition-colors duration-300 relative backdrop-blur-md">
          
          {isLoading && (
            <div className="absolute inset-0 z-20 bg-neutral-900/80 flex items-center justify-center flex-col">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-lime-500/30 border-t-lime-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <Video className="w-8 h-8 text-lime-500 animate-pulse" />
                </div>
              </div>
              <p className="mt-6 text-white font-bold font-display tracking-wide text-lg">Creating masterpiece...</p>
            </div>
          )}

          {errorState === 'quota' && (
             <div className="absolute inset-0 z-30 bg-neutral-900/90 flex items-center justify-center p-6">
               <div className="bg-neutral-800 border border-red-500 p-8 rounded-2xl max-w-md text-center shadow-2xl">
                 <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                 </div>
                 <h3 className="text-2xl font-bold text-white mb-3 font-display">Veo Quota Exceeded</h3>
                 <p className="text-neutral-300 mb-8 text-base leading-relaxed">
                   High-quality video generation requires a paid API key. Please connect your Google Cloud project to continue.
                 </p>
                 <div className="flex gap-4 justify-center">
                   <button 
                     onClick={() => setErrorState('none')}
                     className="px-6 py-3 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors font-medium"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={handleConnectKey}
                     className="px-8 py-3 rounded-xl bg-lime-600 text-white font-bold hover:bg-lime-700 transition-all flex items-center gap-2"
                   >
                     <Key className="w-4 h-4" /> Connect Key
                   </button>
                 </div>
               </div>
             </div>
          )}
          
          {generatedVideoUrl ? (
             <div className="w-full max-w-2xl bg-black rounded-xl shadow-lg overflow-hidden border border-neutral-800 relative group">
               <video 
                  ref={videoRef}
                  src={generatedVideoUrl} 
                  controls 
                  autoPlay 
                  loop 
                  muted={isMuted}
                  className="w-full h-auto"
               />
               
               {/* Hidden Audio Player (synced via refs) */}
               {audioUrl && (
                 <audio ref={audioRef} src={audioUrl} />
               )}

               {/* Overlay Indicator for Music */}
               {audioUrl && (
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 border border-white/10 z-20">
                    <Music className="w-3 h-3 text-lime-400 animate-pulse" />
                    <span className="text-xs text-white font-medium truncate max-w-[100px]">{audioFile?.name}</span>
                    <button onClick={() => setIsMuted(!isMuted)} className="ml-2 text-white hover:text-lime-400">
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
               )}
             </div>
          ) : selectedImage ? (
             <div className="relative max-w-full max-h-full">
               <img src={selectedImage} alt="Preview" className="max-w-full max-h-[80vh] object-contain rounded-xl border border-white/20 opacity-80" />
               <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-black/60 p-6 rounded-full shadow-lg group cursor-not-allowed">
                   <Play className="w-16 h-16 text-white ml-2" />
                 </div>
               </div>
               <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/80 px-6 py-2 rounded-full text-white text-sm font-medium">
                 Preview Mode
               </div>
             </div>
          ) : (
            <div className="text-center text-neutral-400 dark:text-neutral-500">
               <Video className="w-24 h-24 mx-auto mb-6 opacity-20" />
               <p className="font-display text-lg tracking-wide text-neutral-400 dark:text-neutral-500">Upload a photo to animate it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoGenView;