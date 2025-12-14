
import { ThemeConfig, ThemeColors } from "../types";

export const DEFAULT_THEME: ThemeConfig = {
  id: 'default',
  name: 'ThinkMate Default',
  mode: 'light',
  font: 'sans',
  uiStyle: 'glass',
  colors: {
    primary: '#6366f1', // Indigo 500
    secondary: '#ec4899', // Pink 500
    background: '#f3f4f6', // Gray 100
    panel: '#ffffff',
    text: '#1f2937', // Gray 800
    accent: '#8b5cf6' // Violet 500
  },
  fontSize: 'md',
  borderRadius: 'lg'
};

export const NEON_THEME: ThemeConfig = {
  id: 'neon',
  name: 'Cyberpunk Night',
  mode: 'dark',
  font: 'futuristic',
  uiStyle: 'modern',
  colors: {
    primary: '#00ff9d',
    secondary: '#ff00ff',
    background: '#0a0a12',
    panel: '#151520',
    text: '#ffffff',
    accent: '#00ccff'
  },
  fontSize: 'md',
  borderRadius: 'none'
};

export const PASTEL_THEME: ThemeConfig = {
  id: 'pastel',
  name: 'Soft Focus',
  mode: 'light',
  font: 'playful',
  uiStyle: 'neumorphic',
  colors: {
    primary: '#93c5fd', // Blue 300
    secondary: '#fca5a5', // Red 300
    background: '#e0e5ec',
    panel: '#e0e5ec',
    text: '#4b5563',
    accent: '#c4b5fd'
  },
  fontSize: 'lg',
  borderRadius: 'full'
};

export const applyTheme = (theme: ThemeConfig) => {
  const root = document.documentElement;

  // Colors
  root.style.setProperty('--color-primary', theme.colors.primary);
  root.style.setProperty('--color-secondary', theme.colors.secondary);
  root.style.setProperty('--color-bg', theme.colors.background);
  root.style.setProperty('--color-panel', theme.colors.panel);
  root.style.setProperty('--color-text', theme.colors.text);
  root.style.setProperty('--color-accent', theme.colors.accent);

  // Fonts
  let fontFamily = "'Outfit', sans-serif";
  if (theme.font === 'serif') fontFamily = "'Merriweather', serif";
  if (theme.font === 'mono') fontFamily = "'JetBrains Mono', monospace";
  if (theme.font === 'playful') fontFamily = "'Fredoka', sans-serif";
  if (theme.font === 'futuristic') fontFamily = "'Orbitron', sans-serif";
  root.style.setProperty('--font-main', fontFamily);

  // Radius
  let radius = '0.5rem';
  if (theme.borderRadius === 'none') radius = '0px';
  if (theme.borderRadius === 'sm') radius = '0.25rem';
  if (theme.borderRadius === 'lg') radius = '1rem';
  if (theme.borderRadius === 'full') radius = '2rem'; // Extra round
  root.style.setProperty('--radius', radius);

  // UI Styles (Shadows/Borders)
  if (theme.uiStyle === 'glass') {
    root.style.setProperty('--panel-bg-opacity', '0.7');
    root.style.setProperty('--panel-border', '1px solid rgba(255,255,255,0.2)');
    root.style.setProperty('--panel-shadow', '0 8px 32px 0 rgba(31, 38, 135, 0.15)');
    root.style.setProperty('--backdrop-blur', '12px');
  } else if (theme.uiStyle === 'neumorphic') {
    root.style.setProperty('--panel-bg-opacity', '1');
    root.style.setProperty('--panel-border', 'none');
    const shadow = theme.mode === 'light' 
      ? '9px 9px 16px rgb(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)'
      : '5px 5px 10px #0b0b0b, -5px -5px 10px #252525';
    root.style.setProperty('--panel-shadow', shadow);
    root.style.setProperty('--backdrop-blur', '0px');
  } else if (theme.uiStyle === 'outline') {
    root.style.setProperty('--panel-bg-opacity', '0');
    root.style.setProperty('--panel-border', `2px solid ${theme.colors.text}`);
    root.style.setProperty('--panel-shadow', 'none');
    root.style.setProperty('--backdrop-blur', '0px');
  } else {
    // Modern / Flat
    root.style.setProperty('--panel-bg-opacity', '1');
    root.style.setProperty('--panel-border', '1px solid rgba(0,0,0,0.05)');
    root.style.setProperty('--panel-shadow', '0 4px 6px -1px rgba(0, 0, 0, 0.1)');
    root.style.setProperty('--backdrop-blur', '0px');
  }

  // Text Size
  let baseSize = '16px';
  if (theme.fontSize === 'sm') baseSize = '14px';
  if (theme.fontSize === 'lg') baseSize = '18px';
  root.style.setProperty('--text-base', baseSize);
};
