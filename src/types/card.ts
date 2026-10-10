export type CardStatus = 'unassigned' | 'active' | 'suspended' | 'lost';

export interface Card {
  cardId: string;       // Unique hardware NFC code, e.g. "TC000123"
  userId: string | null; // Customer UID or null if not yet claimed
  profileId: string | null; // Profile username or ID linked to card
  status: CardStatus;
  createdAt: string;
  activatedAt?: string | null;
  label?: string;       // Optional custom label by user, e.g. "Matte Black Card #1"
}
