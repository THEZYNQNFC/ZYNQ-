export type AnalyticsEventType =
  | 'nfc_tap'
  | 'page_view'
  | 'save_contact'
  | 'link_click'
  | 'lead_submission';

export interface AnalyticsEvent {
  id?: string;
  userId: string;
  profileId: string;
  cardId?: string | null;
  eventType: AnalyticsEventType;
  timestamp: string;
  metadata?: {
    referrer?: string;
    userAgent?: string;
    linkUrl?: string;
    linkTitle?: string;
    deviceType?: 'mobile' | 'desktop' | 'tablet';
  };
}

export interface MetricSummary {
  totalTaps: number;
  totalViews: number;
  contactsSaved: number;
  leadsCaptured: number;
  clickThroughRate: number;
}
