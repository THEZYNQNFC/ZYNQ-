/**
 * Centralized Brand Configuration
 * Easily update the brand name, tagline, domains, and messaging
 * throughout the entire platform without altering business logic.
 */

export interface BrandConfig {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  domain: string;
  cardDomain: string;
  supportEmail: string;
  copyrightYear: number;
}

export const BRAND_CONFIG: BrandConfig = {
  name: import.meta.env.VITE_BRAND_NAME || 'TapCard',
  shortName: 'TapCard',
  tagline: import.meta.env.VITE_BRAND_TAGLINE || 'Next-Gen NFC Digital Business Cards',
  description: 'Tap. Connect. Convert. Share your professional identity in a single tap with NFC-powered digital business cards.',
  domain: import.meta.env.VITE_APP_URL || 'https://tapcard.in',
  cardDomain: import.meta.env.VITE_CARD_DOMAIN || 'tapcard.in',
  supportEmail: 'support@tapcard.in',
  copyrightYear: new Date().getFullYear(),
};

export default BRAND_CONFIG;
