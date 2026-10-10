import { LinkItem } from './link';

export type ProfileTheme =
  | 'minimal-light'
  | 'midnight-dark'
  | 'professional'
  | 'modern-gradient'
  | 'elegant'
  | 'modern-slate'
  | 'onyx'
  | 'emerald'
  | 'cobalt'
  | 'sunset';

export interface ProfileThemeConfig {
  id: ProfileTheme;
  name: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  buttonBg: string;
  buttonText: string;
  border: string;
}

export interface Profile {
  userId: string;
  username: string;
  fullName: string;
  profileImage?: string;
  title?: string;
  company?: string;
  bio?: string;
  phone?: string;
  email: string;
  whatsapp?: string;
  website?: string;
  location?: string;
  theme?: ProfileTheme;
  socialLinks?: Record<string, string>;
  links?: LinkItem[];
  createdAt: string;
  updatedAt: string;
}

