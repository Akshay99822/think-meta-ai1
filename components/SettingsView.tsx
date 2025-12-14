
import React from 'react';
import { Palette, Type, Layout, MousePointer2 } from 'lucide-react';
import { ThemeConfig, FontStyle, UIStyle } from '../types';
import { applyTheme, DEFAULT_THEME, NEON_THEME, PASTEL_THEME } from '../services/themeService';

interface SettingsViewProps {
  currentTheme: ThemeConfig;
  onThemeUpdate: (theme: ThemeConfig) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ currentTheme, onThemeUpdate }) => {

  const handleColorChange = (key: keyof ThemeConfig['colors'], value: string) => {
    const newTheme = {
      ...currentTheme,
      colors: { ...currentTheme.colors, [key]: value }
    };
    onThemeUpdate(newTheme);
    applyTheme(newTheme);
  };

  const handleUpdate = (key: keyof ThemeConfig, value: any) => {
    const newTheme = { ...currentTheme, [key]: value };
    onThemeUpdate(newTheme);
    applyTheme(newTheme);
  };

  const applyPreset = (preset: ThemeConfig) => {
    onThemeUpdate(preset);
    applyTheme(preset);
  };

  return (
    <div className="flex flex-col h-full theme-panel overflow-hidden">
      <div className="p-6 border-b border-[var(--panel-border)] bg-[var(--color-bg)]/50 backdrop-blur-sm">
        <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-2">Customization Studio</h2>
        <p className="text-[var(--color-text)] opacity-70">Design your perfect learning environment.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10">
        
        {/* Presets */}
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--color-text)]">
            <Palette className="w-5 h-5" /> Quick Themes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[DEFAULT_THEME, NEON_THEME, PASTEL_THEME].map((theme) => (
              <button
                key={theme.id}
                onClick={() => applyPreset(theme)}
                className="p-4 rounded-xl border border-[var(--panel-border)] hover:scale-105 transition-transform text-left"
                style={{ backgroundColor: theme.colors.background }}
              >
                <div className="font-bold mb-2" style={{ color: theme.colors.primary }}>{theme.name}</div>
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.secondary }}></div>
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.accent }}></div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Colors */}
        <section className="p-6 rounded-2xl bg-[var(--color-panel)]/50 border border-[var(--panel-border)]">
          <h3 className="text-xl font-bold mb-6 text-[var(--color-text)]">Color Palette</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(currentTheme.colors).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-2">
                <label className="text-sm font-medium uppercase tracking-wider text-[var(--color-text)] opacity-80">{key}</label>
                <div className="flex items-center gap-3 bg-[var(--color-bg)] p-2 rounded-lg border border-[var(--panel-border)]">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof ThemeConfig['colors'], e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-none bg-transparent"
                  />
                  <input 
                    type="text"
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof ThemeConfig['colors'], e.target.value)}
                    className="flex-1 bg-transparent border-none focus:outline-none text-[var(--color-text)] font-mono text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--color-text)]">
            <Type className="w-5 h-5" /> Typography & Size
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-[var(--color-text)]">Font Family</label>
              <div className="grid grid-cols-2 gap-2">
                {(['sans', 'serif', 'mono', 'playful', 'futuristic'] as FontStyle[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => handleUpdate('font', f)}
                    className={`p-3 rounded-lg border text-sm capitalize ${currentTheme.font === f ? 'bg-[var(--color-primary)] text-white border-transparent' : 'bg-transparent border-[var(--panel-border)] text-[var(--color-text)]'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-sm font-bold text-[var(--color-text)]">Text Size</label>
              <div className="flex gap-2">
                {['sm', 'md', 'lg'].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleUpdate('fontSize', s)}
                    className={`flex-1 p-3 rounded-lg border text-sm uppercase ${currentTheme.fontSize === s ? 'bg-[var(--color-primary)] text-white border-transparent' : 'bg-transparent border-[var(--panel-border)] text-[var(--color-text)]'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* UI Style */}
        <section>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--color-text)]">
            <Layout className="w-5 h-5" /> UI Style & Shapes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-sm font-bold text-[var(--color-text)]">Visual Style</label>
              <div className="grid grid-cols-2 gap-2">
                {(['modern', 'glass', 'neumorphic', 'outline'] as UIStyle[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => handleUpdate('uiStyle', s)}
                    className={`p-3 rounded-lg border text-sm capitalize ${currentTheme.uiStyle === s ? 'bg-[var(--color-primary)] text-white border-transparent' : 'bg-transparent border-[var(--panel-border)] text-[var(--color-text)]'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
             <div className="space-y-4">
              <label className="text-sm font-bold text-[var(--color-text)]">Corner Radius</label>
              <div className="flex gap-2">
                {['none', 'sm', 'lg', 'full'].map((r) => (
                  <button
                    key={r}
                    onClick={() => handleUpdate('borderRadius', r)}
                    className={`flex-1 p-3 rounded-lg border text-sm capitalize ${currentTheme.borderRadius === r ? 'bg-[var(--color-primary)] text-white border-transparent' : 'bg-transparent border-[var(--panel-border)] text-[var(--color-text)]'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsView;
