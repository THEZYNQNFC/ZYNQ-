import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../config/firebase';

export type AnalyticsEventType =
  | 'profile_view'
  | 'page_view'
  | 'card_redirect'
  | 'link_click'
  | 'contact_action'
  | 'save_contact'
  | 'lead_submission'
  | 'nfc_tap';

export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: AnalyticsEventType;
  timestamp: string;
  profileId?: string;
  cardId?: string;
  metadata?: {
    action?: string;
    label?: string;
    url?: string;
    platform?: string;
    location?: string;
  };
}

export interface AnalyticsSummary {
  totalViews: number;
  totalCardTaps: number;
  totalLinkClicks: number;
  totalContactActions: number;
  saveContactCount: number;
  recentEvents: Array<{
    id: string;
    type: string;
    card: string;
    device: string;
    location: string;
    time: string;
    label: string;
    timestamp: string;
  }>;
  platformDistribution: Record<string, number>;
}

function detectPlatform(): string {
  if (typeof navigator === 'undefined') return 'Web Browser';
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return 'Apple iOS';
  if (/Android/i.test(ua)) return 'Android Mobile';
  if (/Macintosh/i.test(ua)) return 'macOS Desktop';
  if (/Windows/i.test(ua)) return 'Windows PC';
  return 'Modern Web';
}

function getLocalEvents(userId: string): AnalyticsEvent[] {
  try {
    const raw = localStorage.getItem(`tapcard_analytics_${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return [];
}

function saveLocalEvent(event: AnalyticsEvent) {
  try {
    const current = getLocalEvents(event.userId);
    // Keep max 200 recent events locally
    const updated = [event, ...current].slice(0, 200);
    localStorage.setItem(`tapcard_analytics_${event.userId}`, JSON.stringify(updated));
  } catch {}
}

export const analyticsService = {
  /**
   * Tracks an interaction event in Firestore and locally
   */
  async trackEvent(params: {
    userId: string;
    eventType: AnalyticsEventType;
    profileId?: string;
    cardId?: string;
    metadata?: {
      action?: string;
      label?: string;
      url?: string;
      location?: string;
    };
  }): Promise<void> {
    if (!params.userId) return;

    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const event: AnalyticsEvent = {
      id: eventId,
      userId: params.userId,
      eventType: params.eventType,
      timestamp: new Date().toISOString(),
      profileId: params.profileId,
      cardId: params.cardId,
      metadata: {
        ...params.metadata,
        platform: detectPlatform(),
      },
    };

    // 1. Save locally for instantaneous zero-latency updates
    saveLocalEvent(event);

    // 2. Persist to Firestore if configured
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'analytics', eventId), event);
      } catch (err) {
        console.warn('[analyticsService] Failed to persist event to Firestore:', err);
      }
    }
  },

  /**
   * Calculates real analytics metrics aggregated from actual recorded telemetry events
   */
  async getUserAnalytics(userId: string): Promise<AnalyticsSummary> {
    let events: AnalyticsEvent[] = [];

    // Read from Firestore if online & configured
    if (isFirebaseConfigured && db) {
      try {
        const q = query(
          collection(db, 'analytics'),
          where('userId', '==', userId),
          limit(300)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          events = snap.docs.map((d) => d.data() as AnalyticsEvent);
        }
      } catch (err) {
        console.warn('[analyticsService] Firestore analytics read fallback to local cache:', err);
      }
    }

    // Merge with local storage events ensuring no duplicates
    const localEvents = getLocalEvents(userId);
    const existingIds = new Set(events.map((e) => e.id));
    for (const le of localEvents) {
      if (!existingIds.has(le.id)) {
        events.push(le);
      }
    }

    // Sort descending by timestamp
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    let totalViews = 0;
    let totalCardTaps = 0;
    let totalLinkClicks = 0;
    let totalContactActions = 0;
    let saveContactCount = 0;
    const platformDistribution: Record<string, number> = {};

    for (const ev of events) {
      if (ev.eventType === 'profile_view' || ev.eventType === 'page_view') {
        totalViews += 1;
      } else if (ev.eventType === 'card_redirect' || ev.eventType === 'nfc_tap') {
        totalCardTaps += 1;
      } else if (ev.eventType === 'link_click') {
        totalLinkClicks += 1;
      } else if (ev.eventType === 'contact_action') {
        totalContactActions += 1;
        if (ev.metadata?.action === 'save_contact') {
          saveContactCount += 1;
        }
      } else if (ev.eventType === 'save_contact') {
        totalContactActions += 1;
        saveContactCount += 1;
      }

      const platform = ev.metadata?.platform || 'Web Browser';
      platformDistribution[platform] = (platformDistribution[platform] || 0) + 1;
    }

    const recentEvents = events.slice(0, 20).map((ev) => {
      const date = new Date(ev.timestamp);
      const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });

      let readableType = 'Profile View';
      if (ev.eventType === 'card_redirect' || ev.eventType === 'nfc_tap') readableType = 'NFC Tap';
      else if (ev.eventType === 'link_click') readableType = 'Link Click';
      else if (ev.eventType === 'contact_action') readableType = 'Contact Action';
      else if (ev.eventType === 'save_contact') readableType = 'Saved Contact';

      return {
        id: ev.id,
        type: readableType,
        card: ev.cardId || 'Web URL',
        device: ev.metadata?.platform || 'Direct Device',
        location: ev.metadata?.location || 'Direct Scan',
        time: `${dateStr}, ${timeStr}`,
        label: ev.metadata?.label || ev.metadata?.action || readableType,
        timestamp: ev.timestamp,
      };
    });

    return {
      totalViews,
      totalCardTaps,
      totalLinkClicks,
      totalContactActions,
      saveContactCount,
      recentEvents,
      platformDistribution,
    };
  },
};
