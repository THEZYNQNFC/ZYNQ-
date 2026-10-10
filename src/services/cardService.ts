import { doc, getDoc, collection, getDocs, query, where, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';
import { Card } from '../types/card';
import { Profile } from '../types/profile';
import { sanitizeUsername } from './profileService';
import { handleFirestoreError, OperationType } from './errorService';

export interface CardResolutionResult {
  card: Card | null;
  profile: Profile | null;
  status: 'active' | 'unassigned' | 'suspended' | 'lost' | 'not_found';
  redirectUsername?: string;
}

export const cardService = {
  /**
   * Resolves the hardware NFC card code into the customer profile.
   * Pipeline: cardId -> Card -> User / Profile -> Digital Card
   */
  async resolveCard(cardId: string): Promise<CardResolutionResult> {
    const cleanCardId = (cardId || '').trim().toUpperCase();

    if (isFirebaseConfigured && db) {
      try {
        const cardRef = doc(db, 'cards', cleanCardId);
        const cardSnap = await getDoc(cardRef);

        if (cardSnap.exists()) {
          const card = cardSnap.data() as Card;

          if (card.status !== 'active') {
            return {
              card,
              profile: null,
              status: card.status,
            };
          }

          const targetId = card.profileId || card.userId;
          if (!targetId) {
            return {
              card,
              profile: null,
              status: 'unassigned',
            };
          }

          // 1. Direct profile document ID
          const profileSnap = await getDoc(doc(db, 'profiles', targetId));
          if (profileSnap.exists()) {
            const profile = profileSnap.data() as Profile;
            return {
              card,
              profile,
              status: 'active',
              redirectUsername: profile.username,
            };
          }

          // 2. Fallback by username
          const q = query(collection(db, 'profiles'), where('username', '==', targetId));
          const qSnap = await getDocs(q);
          if (!qSnap.empty) {
            const profile = qSnap.docs[0].data() as Profile;
            return {
              card,
              profile,
              status: 'active',
              redirectUsername: profile.username,
            };
          }
        }
      } catch (err) {
        console.warn('Firestore card resolution error; attempting local resolution:', err);
      }
    }

    // Local Storage & Preview Mode Resolution
    try {
      // 1. Check local saved cards list
      let localCards: Card[] = [];
      const cachedCardsStr = localStorage.getItem('tapcard_cards');
      if (cachedCardsStr) {
        localCards = JSON.parse(cachedCardsStr) as Card[];
      }

      let matchedCard = localCards.find((c) => c.cardId.toUpperCase() === cleanCardId);

      // If not in custom list but matches primary demo card IDs
      if (!matchedCard) {
        if (cleanCardId === 'TC000123' || cleanCardId === 'TC000124') {
          matchedCard = {
            cardId: cleanCardId,
            userId: 'usr_demo_101',
            profileId: 'usr_demo_101',
            status: 'active',
            createdAt: '2026-01-01T00:00:00Z',
            activatedAt: '2026-01-01T00:00:00Z',
            label: cleanCardId === 'TC000123' ? 'Matte Black Premium NFC' : 'Bamboo Wood NFC',
          };
        }
      }

      if (!matchedCard) {
        return {
          card: null,
          profile: null,
          status: 'not_found',
        };
      }

      if (matchedCard.status !== 'active') {
        return {
          card: matchedCard,
          profile: null,
          status: matchedCard.status,
        };
      }

      // Resolve linked profile from local storage
      let resolvedProfile: Profile | null = null;

      // Check current profile or specific user profile
      const targetUserId = matchedCard.userId || 'usr_demo_101';
      const userProfileStr = localStorage.getItem(`tapcard_profile_${targetUserId}`);
      if (userProfileStr) {
        resolvedProfile = JSON.parse(userProfileStr) as Profile;
      }

      // Check tapcard_current_profile
      if (!resolvedProfile) {
        const currProfStr = localStorage.getItem('tapcard_current_profile');
        if (currProfStr) {
          resolvedProfile = JSON.parse(currProfStr) as Profile;
        }
      }

      // Search all tapcard_profile_* keys
      if (!resolvedProfile) {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('tapcard_profile_')) {
            const val = localStorage.getItem(key);
            if (val) {
              const p = JSON.parse(val) as Profile;
              if (
                p.userId === matchedCard.userId ||
                p.username === matchedCard.profileId
              ) {
                resolvedProfile = p;
                break;
              }
            }
          }
        }
      }

      // Check cached user if profile document wasn't found
      let redirectSlug = resolvedProfile?.username;
      if (!redirectSlug) {
        const cachedUserStr = localStorage.getItem('tapcard_current_user') || localStorage.getItem(`tapcard_user_${targetUserId}`);
        if (cachedUserStr) {
          const u = JSON.parse(cachedUserStr);
          redirectSlug = u.username || u.name?.toLowerCase().replace(/[^a-z0-9_-]/g, '');
        }
      }

      const finalUsername =
        sanitizeUsername(redirectSlug) ||
        sanitizeUsername(matchedCard.profileId);

      return {
        card: matchedCard,
        profile: resolvedProfile,
        status: finalUsername ? 'active' : 'unassigned',
        redirectUsername: finalUsername || undefined,
      };
    } catch (err) {
      console.warn('Local card resolution failed:', err);
      return {
        card: null,
        profile: null,
        status: 'not_found',
      };
    }
  },

  /**
   * Gets cards assigned to a specific user
   */
  async getUserCards(userId: string): Promise<Card[]> {
    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'cards'), where('userId', '==', userId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as Card);
        }
      } catch (err) {
        console.warn('Could not read user cards from Firestore:', err);
      }
    }

    try {
      const cached = localStorage.getItem('tapcard_cards');
      if (cached) {
        const cards = JSON.parse(cached) as Card[];
        return cards.filter((c) => c.userId === userId);
      }
    } catch {}

    // Only seeded for the built-in sandbox demo user
    if (userId === 'usr_demo_101') {
      return [
        {
          cardId: 'TC000123',
          userId,
          profileId: 'alex-morgan',
          status: 'active',
          createdAt: '2026-01-10T14:30:00Z',
          activatedAt: '2026-01-10T14:35:00Z',
          label: 'Matte Black Premium NFC',
        },
      ];
    }

    return [];
  },

  /**
   * Activates / Links an NFC card to a user profile
   */
  async activateCard(cardId: string, userId: string, profileId: string): Promise<void> {
    const formattedCardId = cardId.trim().toUpperCase();

    if (isFirebaseConfigured && db) {
      try {
        const cardRef = doc(db, 'cards', formattedCardId);
        await setDoc(
          cardRef,
          {
            cardId: formattedCardId,
            userId,
            profileId,
            status: 'active',
            activatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `cards/${formattedCardId}`);
      }
    }

    // Persist in localStorage
    try {
      let cards: Card[] = [];
      const cached = localStorage.getItem('tapcard_cards');
      if (cached) {
        cards = JSON.parse(cached) as Card[];
      }
      const existingIdx = cards.findIndex((c) => c.cardId === formattedCardId);
      const newCard: Card = {
        cardId: formattedCardId,
        userId,
        profileId,
        status: 'active',
        createdAt: new Date().toISOString(),
        activatedAt: new Date().toISOString(),
        label: `NFC Card ${formattedCardId}`,
      };
      if (existingIdx >= 0) {
        cards[existingIdx] = newCard;
      } else {
        cards.push(newCard);
      }
      localStorage.setItem('tapcard_cards', JSON.stringify(cards));
    } catch {}
  },
};
