
import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatView from './components/ChatView';
import QuizView from './components/QuizView';
import PlanView from './components/PlanView';
import SummaryView from './components/SummaryView';
import ImageEditView from './components/ImageEditView';
import VideoGenView from './components/VideoGenView';
import VideoAnalysisView from './components/VideoAnalysisView';
import SettingsView from './components/SettingsView';
import AboutView from './components/AboutView';
import { AppMode, ThemeConfig } from './types';
import { applyTheme, DEFAULT_THEME } from './services/themeService';

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.CHAT);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);

  // Apply default theme on mount
  useEffect(() => {
    applyTheme(theme);
  }, []);

  const renderContent = () => {
    switch (currentMode) {
      case AppMode.CHAT:
        return <ChatView />;
      case AppMode.QUIZ:
        return <QuizView />;
      case AppMode.PLAN:
        return <PlanView />;
      case AppMode.SUMMARY:
        return <SummaryView />;
      case AppMode.IMAGE_EDIT:
        return <ImageEditView />;
      case AppMode.VIDEO_GEN:
        return <VideoGenView />;
      case AppMode.VIDEO_ANALYSIS:
        return <VideoAnalysisView />;
      case AppMode.SETTINGS:
        return <SettingsView currentTheme={theme} onThemeUpdate={setTheme} />;
      case AppMode.ABOUT:
        return <AboutView />;
      default:
        return <ChatView />;
    }
  };

  const getTitle = () => {
     switch(currentMode) {
       case AppMode.CHAT: return "Study Chat";
       case AppMode.QUIZ: return "Quiz Generator";
       case AppMode.PLAN: return "Study Plan";
       case AppMode.SUMMARY: return "Note Maker";
       case AppMode.IMAGE_EDIT: return "Visual Learning";
       case AppMode.VIDEO_GEN: return "Animate Topic";
       case AppMode.VIDEO_ANALYSIS: return "Video Study";
       case AppMode.SETTINGS: return "Customization";
       case AppMode.ABOUT: return "About ThinkMate AI";
       default: return "ThinkMate AI";
     }
  }

  return (
    <div className={`flex h-screen overflow-hidden p-0 md:p-4 gap-4 transition-colors duration-300 relative bg-[var(--color-bg)]`}>
      <Sidebar 
        currentMode={currentMode} 
        onModeChange={setCurrentMode}
        isMobileOpen={isMobileNavOpen}
        closeMobile={() => setIsMobileNavOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative w-full rounded-none md:rounded-2xl transition-all duration-300 z-10">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center p-4 theme-panel border-b border-[var(--panel-border)] shrink-0 z-20 mb-2 rounded-none">
          <button 
            onClick={() => setIsMobileNavOpen(true)}
            className="p-2 -ml-2 hover:bg-[var(--color-bg)] rounded-lg text-[var(--color-text)] transition-transform"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-3 font-bold text-lg text-[var(--color-text)] tracking-tight">
             {getTitle()}
          </span>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden h-full">
          <div key={currentMode} className="h-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
