
import React from 'react';
import { MessageCircle, BrainCircuit, CalendarClock, FileText, Image as ImageIcon, Video, MonitorPlay, Sparkles, Wand2, Settings, Info } from 'lucide-react';
import { AppMode } from '../types';

interface SidebarProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  isMobileOpen: boolean;
  closeMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentMode, onModeChange, isMobileOpen, closeMobile }) => {
  
  const navItems = [
    { mode: AppMode.CHAT, label: 'Chat Buddy', icon: MessageCircle },
    { mode: AppMode.QUIZ, label: 'Quiz Me', icon: BrainCircuit },
    { mode: AppMode.PLAN, label: 'Study Plan', icon: CalendarClock },
    { mode: AppMode.SUMMARY, label: 'Note Maker', icon: FileText },
    { type: 'divider' },
    { mode: AppMode.IMAGE_EDIT, label: 'Visual Learning', icon: ImageIcon },
    { mode: AppMode.VIDEO_GEN, label: 'Animate Topic', icon: Video },
    { mode: AppMode.VIDEO_ANALYSIS, label: 'Video Analysis', icon: MonitorPlay },
    { type: 'divider' },
    { mode: AppMode.SETTINGS, label: 'Customize', icon: Settings },
    { mode: AppMode.ABOUT, label: 'About Project', icon: Info },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={closeMobile}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-30 w-72 flex flex-col
        md:relative md:translate-x-0 md:inset-auto md:h-full
        theme-panel
        transition-transform duration-300 ease-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 pb-4">
          <h1 className="text-2xl font-bold flex items-center gap-3 tracking-tight text-[var(--color-text)]">
            <div className="p-2 rounded-lg bg-[var(--color-primary)] text-white shadow-sm">
               <Sparkles className="w-5 h-5" />
            </div>
            ThinkMate AI
          </h1>
        </div>

        <nav className="px-4 space-y-1.5 flex-1 overflow-y-auto py-2">
          {navItems.map((item, index) => {
            if (item.type === 'divider') {
               return <div key={index} className="h-px bg-[var(--color-text)] opacity-10 my-3 mx-2"></div>
            }
            
            const navItem = item as { mode: AppMode, label: string, icon: React.ElementType };
            const isActive = currentMode === navItem.mode;
            
            return (
              <button
                key={navItem.mode}
                onClick={() => {
                  onModeChange(navItem.mode);
                  closeMobile();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium group relative ${
                  isActive 
                    ? 'bg-[var(--color-primary)] text-white shadow-md'
                    : 'text-[var(--color-text)] hover:bg-[var(--color-bg)] opacity-80 hover:opacity-100'
                }`}
              >
                <navItem.icon className={`w-5 h-5 ${
                  isActive ? 'text-white' : 'text-[var(--color-primary)]'
                }`} />
                <span className="relative z-10 tracking-wide text-[15px]">{navItem.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-5 border-t border-[var(--panel-border)] space-y-3 bg-[var(--color-bg)]/20 rounded-b-xl">
           <div className="bg-[var(--color-bg)] border border-[var(--panel-border)] rounded-xl p-3 shadow-sm flex items-center justify-between">
             <div>
               <p className="text-[10px] font-bold text-[var(--color-text)] opacity-50 uppercase tracking-widest mb-1">
                 Current Model
               </p>
               <p className="text-xs font-bold text-[var(--color-text)] flex items-center gap-2">
                 Gemini 2.5 Flash
               </p>
             </div>
             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
           </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
