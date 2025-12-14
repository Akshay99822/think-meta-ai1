
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Mic, X, Paperclip, Volume2, StopCircle } from 'lucide-react';
import { streamChatResponse, generateSpeech } from '../services/geminiService';
import { ChatMessage, Attachment } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { GenerateContentResponse } from '@google/genai';

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi! I'm **ThinkMate AI**. \n\nI can analyze images using **Gemini**, generate quizzes, and even read my answers out loud! \n\nUpload a textbook photo, ask me to explain a concept, or just chat. Let's learn together!",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | undefined>(undefined);
  
  // Voice Input State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // TTS State
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioCache, setAudioCache] = useState<Record<string, string>>({}); // Cache TTS URLs
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, attachment]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
            // Ignore no-speech error as it just means silence was detected
            if (event.error === 'no-speech') {
               setIsListening(false);
               return;
            }
            console.error("Speech Recognition Error:", event.error);
            setIsListening(false);
        };
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(prev => (prev ? prev + ' ' : '') + transcript);
        };
        
        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
       alert("Voice input is not supported in this browser. Please try Chrome or Edge.");
       return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isAudio = file.type.startsWith('audio/');

    if (!isImage && !isAudio) {
      alert("Please upload an image or audio file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAttachment({
        type: isImage ? 'image' : 'audio',
        url: URL.createObjectURL(file),
        base64: base64String.split(',')[1],
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handlePlayTTS = async (messageId: string, text: string) => {
    if (playingMessageId === messageId) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingMessageId(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    try {
      let audioUrl = audioCache[messageId];
      if (!audioUrl) {
        audioUrl = await generateSpeech(text);
        setAudioCache(prev => ({ ...prev, [messageId]: audioUrl }));
      }
      const audio = new Audio(audioUrl);
      audio.onended = () => setPlayingMessageId(null);
      audio.play();
      audioRef.current = audio;
      setPlayingMessageId(messageId);
    } catch (error) {
      console.error("TTS Error:", error);
      alert("Could not generate speech for this message.");
      setPlayingMessageId(null);
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !attachment) || isLoading) return;

    // Stop listening if sending
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const currentAttachment = attachment;
    const currentInput = input;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: currentInput,
      timestamp: Date.now(),
      attachment: currentAttachment
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachment(undefined);
    setIsLoading(true);

    try {
      const history = messages.filter(m => m.role !== 'model' || m.text).map(m => ({
        role: m.role,
        parts: [{ text: m.text }] 
      }));

      const stream = await streamChatResponse(
        history, 
        userMsg.text, 
        currentAttachment ? { mimeType: currentAttachment.mimeType, data: currentAttachment.base64 } : undefined
      );
      
      const botMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: '',
        timestamp: Date.now()
      }]);

      let fullText = '';
      
      for await (const chunk of stream) {
        const c = chunk as GenerateContentResponse;
        const textChunk = c.text || '';
        fullText += textChunk;
        
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: fullText } : msg
        ));
      }
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: error.message || "I'm having a little trouble connecting right now. Can you try again?",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full theme-panel overflow-hidden relative">
      {/* Header */}
      <div className="p-5 flex items-center border-b border-[var(--panel-border)] bg-[var(--color-bg)]/30">
        <div className="p-2.5 rounded-lg mr-4 shadow-sm bg-[var(--color-primary)]">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-[var(--color-text)] font-bold text-xl tracking-tight">ThinkMate AI</h2>
          <p className="text-[var(--color-text)] opacity-60 text-xs">AI Tutor • Gemini Powered</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              
              <div className={`flex ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center mt-1 border border-[var(--panel-border)] ${
                  msg.role === 'user' 
                    ? 'bg-[var(--color-secondary)]' 
                    : 'bg-[var(--color-primary)]'
                }`}>
                  {msg.role === 'user' ? 
                    <User className="w-5 h-5 text-white" /> : 
                    <Bot className="w-5 h-5 text-white" />
                  }
                </div>
                
                <div className={`p-4 rounded-xl shadow-sm text-base leading-relaxed transition-all relative group border ${
                  msg.role === 'user' 
                    ? 'bg-[var(--color-secondary)] text-white border-transparent rounded-tr-sm' 
                    : 'bg-[var(--color-panel)] text-[var(--color-text)] border-[var(--panel-border)] rounded-tl-sm'
                }`}>
                   {/* TTS Button */}
                   {msg.role === 'model' && msg.text && (
                      <button 
                        onClick={() => handlePlayTTS(msg.id, msg.text)}
                        className={`absolute -bottom-3 -right-3 p-2 rounded-full shadow-sm border transition-all z-10 bg-[var(--color-bg)] border-[var(--panel-border)] text-[var(--color-text)] hover:text-[var(--color-primary)]`}
                        title="Read aloud"
                      >
                         {playingMessageId === msg.id ? <StopCircle className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                   )}

                   {/* Attachment */}
                   {msg.attachment && (
                     <div className="mb-3 rounded-lg overflow-hidden border border-[var(--panel-border)]">
                       {msg.attachment.type === 'image' ? (
                         <img src={msg.attachment.url} alt="User upload" className="max-w-full max-h-64 object-cover" />
                       ) : (
                         <audio controls src={msg.attachment.url} className="w-full min-w-[200px]" />
                       )}
                     </div>
                   )}

                   {msg.role === 'user' ? (
                     <p className="whitespace-pre-wrap">{msg.text}</p>
                   ) : (
                     <MarkdownRenderer content={msg.text} />
                   )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start pl-14">
             <div className="bg-[var(--color-panel)] px-4 py-3 rounded-xl rounded-tl-sm border border-[var(--panel-border)] flex items-center gap-3">
                <Loader2 className="w-4 h-4 text-[var(--color-primary)] animate-spin" />
                <span className="text-[var(--color-text)] opacity-70 text-xs font-bold tracking-wide">THINKING...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 md:p-6 border-t border-[var(--panel-border)] bg-[var(--color-panel)]/50 z-20">
        
        {/* Attachment Preview */}
        {attachment && (
          <div className="mb-4 flex items-center gap-3">
            <div className="relative group">
              {attachment.type === 'image' ? (
                <img src={attachment.url} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-[var(--color-primary)] shadow-sm" />
              ) : (
                <div className="w-48 h-12 bg-[var(--color-bg)] rounded-lg border border-[var(--color-primary)] flex items-center px-3 justify-center">
                   <Mic className="w-5 h-5 text-[var(--color-primary)] mr-2" />
                   <span className="text-xs font-bold text-[var(--color-text)]">Audio Clip</span>
                </div>
              )}
              <button 
                onClick={() => setAttachment(undefined)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-end gap-3 bg-[var(--color-bg)] p-2 rounded-xl border border-[var(--panel-border)] focus-within:ring-2 focus-within:ring-[var(--color-primary)] focus-within:border-transparent transition-all">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,audio/*"
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-3 text-[var(--color-text)] opacity-60 hover:opacity-100 hover:bg-[var(--color-panel)] rounded-lg transition-all"
            title="Upload Image or Audio"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          
          <button 
            onClick={toggleListening}
            className={`p-3 rounded-lg transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-[var(--color-text)] opacity-60 hover:opacity-100 hover:bg-[var(--color-panel)]'}`}
            title={isListening ? "Stop Listening" : "Speak to Type"}
          >
            <Mic className="w-5 h-5" />
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={attachment ? "Ask a question about this..." : (isListening ? "Listening..." : "Type a message...")}
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none p-3 max-h-32 text-[var(--color-text)] placeholder-opacity-50 placeholder-[var(--color-text)] text-sm leading-relaxed"
            rows={1}
            style={{ minHeight: '48px' }}
          />
          <button
            onClick={handleSend}
            disabled={(!input.trim() && !attachment) || isLoading}
            className="p-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-sm"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
