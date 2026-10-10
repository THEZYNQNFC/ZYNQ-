import { ProfileTheme } from '../types/profile';

export interface ThemeVisualConfig {
  id: ProfileTheme;
  name: string;
  description: string;
  pageBg: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  headerGradient: string;
  headerBadge: string;
  avatarRing: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  bioBox: string;
  contactBtnClass: string;
  linkItemClass: string;
  linkItemHover: string;
  linkIconBox: string;
  actionPrimaryClass: string;
  actionSecondaryClass: string;
  previewSwatchBg: string;
  previewAccent: string;
}

export const THEME_PRESETS: ThemeVisualConfig[] = [
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    description: 'Crisp editorial aesthetic with clean paper background, fine borders, and sleek contrast.',
    pageBg: 'bg-slate-100 selection:bg-slate-900 selection:text-white',
    cardBg: 'bg-white',
    cardBorder: 'border border-slate-200/90',
    cardShadow: 'shadow-xl shadow-slate-200/60',
    headerGradient: 'bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100',
    headerBadge: 'bg-white/80 text-slate-800 border border-slate-200',
    avatarRing: 'border-white bg-slate-100',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    bioBox: 'bg-slate-50 border border-slate-100 text-slate-600',
    contactBtnClass: 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/80',
    linkItemClass: 'bg-white hover:bg-slate-50 text-slate-900 border border-slate-200/90 shadow-2xs',
    linkItemHover: 'hover:border-slate-400 hover:shadow-xs',
    linkIconBox: 'bg-slate-100 text-slate-800',
    actionPrimaryClass: 'bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/10',
    actionSecondaryClass: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300',
    previewSwatchBg: 'bg-slate-100 border border-slate-300 text-slate-900',
    previewAccent: 'bg-slate-900',
  },
  {
    id: 'midnight-dark',
    name: 'Midnight Dark',
    description: 'High-contrast obsidian black canvas with luminous emerald highlights and stealth borders.',
    pageBg: 'bg-slate-950 selection:bg-emerald-500 selection:text-white',
    cardBg: 'bg-slate-900',
    cardBorder: 'border border-slate-800',
    cardShadow: 'shadow-2xl shadow-black/80',
    headerGradient: 'bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950/60',
    headerBadge: 'bg-slate-950/70 text-emerald-400 border border-emerald-900/40',
    avatarRing: 'border-slate-900 bg-slate-800',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-400',
    textMuted: 'text-slate-500',
    bioBox: 'bg-slate-950/40 border border-slate-800/80 text-slate-300',
    contactBtnClass: 'bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700/60',
    linkItemClass: 'bg-slate-800 hover:bg-slate-750 text-white border border-slate-800',
    linkItemHover: 'hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-950/30',
    linkIconBox: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    actionPrimaryClass: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40',
    actionSecondaryClass: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700',
    previewSwatchBg: 'bg-slate-900 text-white',
    previewAccent: 'bg-emerald-500',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Executive corporate navy palette engineered for executives, partners, and high-trust advisory.',
    pageBg: 'bg-slate-950 selection:bg-sky-500 selection:text-white',
    cardBg: 'bg-[#0f172a]',
    cardBorder: 'border border-slate-800',
    cardShadow: 'shadow-2xl shadow-sky-950/20',
    headerGradient: 'bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-sky-950/50',
    headerBadge: 'bg-sky-950/80 text-sky-300 border border-sky-800/50',
    avatarRing: 'border-[#0f172a] bg-slate-800',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-400',
    bioBox: 'bg-slate-900/60 border border-slate-800 text-slate-300',
    contactBtnClass: 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60',
    linkItemClass: 'bg-slate-800/70 hover:bg-slate-800 text-white border border-slate-700/70',
    linkItemHover: 'hover:border-sky-400/60 hover:shadow-md hover:shadow-sky-950/40',
    linkIconBox: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
    actionPrimaryClass: 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-900/30',
    actionSecondaryClass: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700',
    previewSwatchBg: 'bg-slate-900 text-white',
    previewAccent: 'bg-sky-500',
  },
  {
    id: 'modern-gradient',
    name: 'Modern Gradient',
    description: 'Vibrant indigo and sunset aurora gradient for tech founders, creators, and modern innovators.',
    pageBg: 'bg-slate-950 selection:bg-purple-500 selection:text-white',
    cardBg: 'bg-[#13111c]',
    cardBorder: 'border border-purple-900/40',
    cardShadow: 'shadow-2xl shadow-purple-950/40',
    headerGradient: 'bg-gradient-to-r from-purple-900/80 via-indigo-900/60 to-pink-900/50',
    headerBadge: 'bg-purple-950/80 text-purple-300 border border-purple-800/50',
    avatarRing: 'border-[#13111c] bg-slate-800',
    textPrimary: 'text-white',
    textSecondary: 'text-purple-200/80',
    textMuted: 'text-slate-400',
    bioBox: 'bg-purple-950/20 border border-purple-800/30 text-purple-100/90',
    contactBtnClass: 'bg-purple-950/40 hover:bg-purple-900/40 text-purple-200 border border-purple-800/40',
    linkItemClass: 'bg-[#1c172e] hover:bg-[#251f3d] text-white border border-purple-900/40',
    linkItemHover: 'hover:border-purple-400 hover:shadow-lg hover:shadow-purple-950/50',
    linkIconBox: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    actionPrimaryClass: 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-950/50',
    actionSecondaryClass: 'bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-700/50',
    previewSwatchBg: 'bg-gradient-to-br from-purple-900 to-slate-900 text-white',
    previewAccent: 'bg-purple-500',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Deep forest emerald canvas paired with champagne warm accents for luxury & bespoke brands.',
    pageBg: 'bg-[#06140e] selection:bg-amber-500 selection:text-slate-900',
    cardBg: 'bg-[#091a13]',
    cardBorder: 'border border-emerald-900/50',
    cardShadow: 'shadow-2xl shadow-emerald-950/60',
    headerGradient: 'bg-gradient-to-r from-[#091a13] via-emerald-950 to-[#122b20]',
    headerBadge: 'bg-emerald-950/80 text-amber-300 border border-amber-900/40',
    avatarRing: 'border-[#091a13] bg-emerald-950',
    textPrimary: 'text-emerald-50',
    textSecondary: 'text-emerald-200/70',
    textMuted: 'text-emerald-300/50',
    bioBox: 'bg-emerald-950/40 border border-emerald-900/40 text-emerald-100/90',
    contactBtnClass: 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-800/40',
    linkItemClass: 'bg-[#0d231a] hover:bg-[#122e23] text-emerald-50 border border-emerald-900/60',
    linkItemHover: 'hover:border-amber-400/60 hover:shadow-lg hover:shadow-emerald-950/60',
    linkIconBox: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    actionPrimaryClass: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold shadow-lg shadow-amber-950/30',
    actionSecondaryClass: 'bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-800/60',
    previewSwatchBg: 'bg-[#091a13] text-white',
    previewAccent: 'bg-amber-400',
  },
];

export function getThemeConfig(themeId?: string | null): ThemeVisualConfig {
  if (!themeId) {
    return THEME_PRESETS[1]; // Midnight Dark default
  }

  let targetId = themeId;
  if (themeId === 'modern-slate' || themeId === 'onyx') {
    targetId = 'midnight-dark';
  } else if (themeId === 'cobalt') {
    targetId = 'professional';
  } else if (themeId === 'sunset') {
    targetId = 'modern-gradient';
  } else if (themeId === 'emerald') {
    targetId = 'elegant';
  }

  const found = THEME_PRESETS.find((t) => t.id === targetId);
  return found || THEME_PRESETS[1];
}
