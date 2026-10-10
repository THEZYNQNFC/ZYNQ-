export type SocialPlatform =
  | 'linkedin'
  | 'instagram'
  | 'x'
  | 'facebook'
  | 'youtube'
  | 'tiktok'
  | 'github'
  | 'telegram';

export type LinkType = 'social' | 'custom';

export interface LinkItem {
  id: string;
  userId: string;
  type: LinkType;
  platform?: SocialPlatform;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  order: number;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
  clicksCount?: number;
}
