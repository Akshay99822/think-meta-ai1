
// --- Core App Types ---

export enum AppMode {
  CHAT = 'chat',
  QUIZ = 'quiz',
  PLAN = 'plan',
  SUMMARY = 'summary',
  IMAGE_EDIT = 'image_edit',
  VIDEO_GEN = 'video_gen',
  VIDEO_ANALYSIS = 'video_analysis',
  SETTINGS = 'settings',
  ABOUT = 'about'
}

export interface Attachment {
  type: 'image' | 'audio';
  url: string;
  base64: string;
  mimeType: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  attachment?: Attachment;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizData {
  topic: string;
  questions: QuizQuestion[];
}

export interface StudyDay {
  day: number;
  focus: string;
  tasks: string[];
}

export interface StudyPlanData {
  subject: string;
  goal: string;
  days: StudyDay[];
}

// --- Theme & Customization Types ---

export type FontStyle = 'sans' | 'serif' | 'mono' | 'playful' | 'futuristic';
export type UIStyle = 'modern' | 'glass' | 'neumorphic' | 'retro' | 'outline';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  panel: string;
  text: string;
  accent: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  mode: 'light' | 'dark';
  font: FontStyle;
  uiStyle: UIStyle;
  colors: ThemeColors;
  fontSize: 'sm' | 'md' | 'lg';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
}
