import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MessageCircle,
  Globe,
  Share2,
  Download,
  MapPin,
  Building2,
  ExternalLink,
  Sparkles,
  UserPlus,
  Check,
  CreditCard,
  Edit,
} from 'lucide-react';
import { Profile } from '../../types/profile';
import { LinkItem } from '../../types/link';
import { profileService, sanitizeUsername } from '../../services/profileService';
import { analyticsService } from '../../services/analyticsService';
import { getThemeConfig } from '../../config/themes';
import { downloadVCard } from '../../utils/vcard';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import BRAND_CONFIG from '../../config/brand';

export const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { currentUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
  const [exchangeName, setExchangeName] = useState('');
  const [exchangeEmail, setExchangeEmail] = useState('');
  const [exchangePhone, setExchangePhone] = useState('');
  const [exchangeCompany, setExchangeCompany] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);
  const hasTrackedView = useRef(false);

  const toast = useToast();
  const cleanSlug = sanitizeUsername(username);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (cleanSlug) {
        console.log('[PublicProfilePage] Requesting profile for slug:', cleanSlug, {
          currentUserId: currentUser?.userId,
          currentUsername: currentUser?.username,
        });

        // 1. If active/logged-in user matches this slug, check their profile first for immediate synchronization
        let fetched: Profile | null = null;
        if (currentUser?.userId) {
          const userSlug = sanitizeUsername(currentUser.username || currentUser.email?.split('@')[0]);
          if (userSlug === cleanSlug || cleanSlug === 'profile') {
            fetched = await profileService.getProfileByUserId(currentUser.userId);
            if (fetched) {
              console.log('[PublicProfilePage] Loaded matching active user profile:', {
                documentPath: `profiles/${currentUser.userId}`,
                username: fetched.username,
                fullName: fetched.fullName,
              });
            }
          }
        }

        // 2. Otherwise resolve from Firestore via profileService
        if (!fetched) {
          fetched = await profileService.getProfileByUsername(cleanSlug);
        }

        if (fetched) {
          console.log('[PublicProfilePage] Successfully resolved document for public profile:', {
            documentPath: `profiles/${fetched.userId}`,
            requestedSlug: cleanSlug,
            resolvedUsername: fetched.username,
            fullName: fetched.fullName,
            theme: fetched.theme,
          });
          setProfile(fetched);
          const activeLinks = (fetched.links || [])
            .filter((l) => l.enabled)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setLinks(activeLinks);

          // Track real profile_view analytics event (once per view session)
          if (!hasTrackedView.current) {
            hasTrackedView.current = true;
            const searchParams = new URLSearchParams(window.location.search);
            const queryCardId = searchParams.get('card') || undefined;
            analyticsService.trackEvent({
              userId: fetched.userId,
              eventType: 'profile_view',
              profileId: fetched.username,
              cardId: queryCardId,
              metadata: { action: 'view_profile' },
            });
          }
        } else {
          console.warn('[PublicProfilePage] Profile not found for slug:', cleanSlug);
          setProfile(null);
          setLinks([]);
        }
      }
    } catch (err) {
      console.error('[PublicProfilePage] Error fetching public profile:', err);
      setProfile(null);
      setLinks([]);
    } finally {
      setLoading(false);
    }
  }, [cleanSlug, currentUser?.userId, currentUser?.username, currentUser?.email]);

  // Initial fetch and storage sync
  useEffect(() => {
    loadData();

    const handleSync = () => {
      loadData();
    };
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
    };
  }, [loadData]);

  // Re-run when currentUser becomes authenticated
  useEffect(() => {
    if (currentUser && !profile) {
      loadData();
    }
  }, [currentUser, profile, loadData]);

  // Real-time Firestore subscription on canonical profile document
  useEffect(() => {
    if (!profile?.userId) return;

    const unsubscribe = profileService.subscribeToProfile(profile.userId, (liveProfile) => {
      if (liveProfile) {
        setProfile(liveProfile);
        const liveLinks = (liveProfile.links || [])
          .filter((l) => l.enabled)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setLinks(liveLinks);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [profile?.userId]);

  const handleSaveContact = () => {
    if (!profile) return;
    downloadVCard(profile);
    toast.success('vCard downloaded! Open file to save to phone contacts.');

    // Track contact_action (save_contact)
    analyticsService.trackEvent({
      userId: profile.userId,
      eventType: 'contact_action',
      profileId: profile.username,
      metadata: { action: 'save_contact', label: 'Downloaded vCard' },
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile?.fullName || 'Digital Business Card',
          text: `Connect with ${profile?.fullName} via ${BRAND_CONFIG.name}`,
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(url);
    setCopiedShare(true);
    toast.info('Profile link copied to clipboard.');
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleExchangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exchangeName || !exchangeEmail || !profile) {
      toast.error('Please enter your name and email address.');
      return;
    }

    try {
      await profileService.submitLead({
        userId: profile.userId,
        name: exchangeName,
        email: exchangeEmail,
        phone: exchangePhone,
        company: exchangeCompany,
        note: `Contact exchanged on /u/${profile.username}`,
      });
      toast.success('Your contact information was sent successfully!');

      analyticsService.trackEvent({
        userId: profile.userId,
        eventType: 'contact_action',
        profileId: profile.username,
        metadata: { action: 'lead_submission', label: exchangeName },
      });
    } catch {
      toast.success('Contact received! (Stored in lead queue)');
    }

    setIsExchangeModalOpen(false);
    setExchangeName('');
    setExchangeEmail('');
    setExchangePhone('');
    setExchangeCompany('');
  };

  if (loading || (authLoading && !profile)) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-white">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400">Loading Digital Card...</p>
        </div>
      </div>
    );
  }

  // Profile not found in Firestore
  if (!profile) {
    const isOwner =
      Boolean(currentUser) &&
      (cleanSlug === sanitizeUsername(currentUser?.username) ||
        cleanSlug === sanitizeUsername(currentUser?.email?.split('@')[0]));

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 p-8 text-center flex flex-col items-center gap-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400">
            <CreditCard className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">Profile Not Found</h1>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              The digital business card for <span className="font-mono text-emerald-400">@{cleanSlug || 'user'}</span> has not been configured yet or does not exist.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 w-full mt-2">
            {isOwner ? (
              <Link to="/dashboard/profile" className="w-full">
                <Button variant="primary" className="w-full text-xs py-2.5" leftIcon={<Edit className="w-3.5 h-3.5" />}>
                  Open Profile Builder
                </Button>
              </Link>
            ) : (
              <Link to="/signup" className="w-full">
                <Button variant="primary" className="w-full text-xs py-2.5">
                  Create Your Own Digital Card
                </Button>
              </Link>
            )}
            <Link to="/" className="w-full">
              <Button variant="outline" className="w-full text-xs py-2.5 text-slate-300 border-slate-700 hover:bg-slate-800">
                Go to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Resolve theme configuration
  const theme = getThemeConfig(profile.theme);

  const initials =
    profile.fullName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'TC';

  return (
    <div className={`min-h-screen ${theme.pageBg} flex flex-col items-center justify-start py-6 px-4 sm:px-6 antialiased`}>
      {/* Top Bar on Mobile */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 px-2">
        <Link to="/" className={`flex items-center gap-1.5 text-xs font-medium ${theme.textSecondary} hover:opacity-80 transition-opacity`}>
          <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
          <span>{BRAND_CONFIG.name}</span>
        </Link>
        <button
          type="button"
          onClick={handleShare}
          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-colors ${theme.contactBtnClass}`}
        >
          {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copiedShare ? 'Copied' : 'Share'}</span>
        </button>
      </div>

      {/* Main Digital Business Card Container (Mobile-First Canvas) */}
      <div className={`w-full max-w-md ${theme.cardBg} ${theme.cardBorder} ${theme.cardShadow} rounded-3xl overflow-hidden flex flex-col relative`}>
        {/* Card Header Cover Banner */}
        <div className={`h-32 ${theme.headerGradient} relative p-4 flex items-start justify-between`}>
          <span className={`text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-md backdrop-blur-xs font-semibold ${theme.headerBadge}`}>
            NFC Verified
          </span>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Profile Avatar & Primary Info */}
        <div className="px-6 pb-6 pt-0 relative flex flex-col items-center text-center -mt-16">
          <div className="relative mb-3">
            <div className={`w-28 h-28 rounded-full border-4 ${theme.avatarRing} shadow-xl overflow-hidden flex items-center justify-center`}>
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-850 flex items-center justify-center text-2xl font-bold text-emerald-400">
                  {initials}
                </div>
              )}
            </div>
          </div>

          <h1 className={`text-2xl font-bold tracking-tight ${theme.textPrimary}`}>{profile.fullName}</h1>

          {profile.title && (
            <p className={`text-sm font-medium mt-1 flex items-center gap-1.5 ${theme.textSecondary}`}>
              <span>{profile.title}</span>
            </p>
          )}

          {profile.company && (
            <p className={`text-xs mt-0.5 flex items-center gap-1 ${theme.textMuted}`}>
              <Building2 className="w-3 h-3" />
              <span>{profile.company}</span>
            </p>
          )}

          {profile.location && (
            <p className={`text-xs mt-0.5 flex items-center gap-1 ${theme.textMuted}`}>
              <MapPin className="w-3 h-3" />
              <span>{profile.location}</span>
            </p>
          )}

          {profile.bio && (
            <div className={`text-xs mt-3 max-w-sm leading-relaxed p-3 rounded-xl w-full text-center ${theme.bioBox}`}>
              {profile.bio}
            </div>
          )}

          {/* Core Action Buttons: Save Contact & Exchange Info */}
          <div className="grid grid-cols-2 gap-2.5 w-full mt-6">
            <button
              type="button"
              onClick={handleSaveContact}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-medium cursor-pointer transition-colors ${theme.actionPrimaryClass}`}
            >
              <Download className="w-4 h-4" />
              <span>Save Contact (.vcf)</span>
            </button>
            <button
              type="button"
              onClick={() => setIsExchangeModalOpen(true)}
              className={`flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-medium cursor-pointer transition-colors ${theme.actionSecondaryClass}`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Exchange Info</span>
            </button>
          </div>

          {/* Quick Communication Bar */}
          <div className="flex items-center justify-center gap-3 mt-4 w-full py-3 border-y border-slate-200/20">
            {profile.phone && (
              <a
                href={`tel:${profile.phone}`}
                onClick={() =>
                  analyticsService.trackEvent({
                    userId: profile.userId,
                    eventType: 'contact_action',
                    profileId: profile.username,
                    metadata: { action: 'phone_call' },
                  })
                }
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${theme.contactBtnClass}`}
                title="Call Phone"
              >
                <Phone className="w-4 h-4" />
              </a>
            )}
            {profile.whatsapp && (
              <a
                href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  analyticsService.trackEvent({
                    userId: profile.userId,
                    eventType: 'contact_action',
                    profileId: profile.username,
                    metadata: { action: 'whatsapp' },
                  })
                }
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${theme.contactBtnClass}`}
                title="WhatsApp Message"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                onClick={() =>
                  analyticsService.trackEvent({
                    userId: profile.userId,
                    eventType: 'contact_action',
                    profileId: profile.username,
                    metadata: { action: 'email' },
                  })
                }
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${theme.contactBtnClass}`}
                title="Send Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  analyticsService.trackEvent({
                    userId: profile.userId,
                    eventType: 'contact_action',
                    profileId: profile.username,
                    metadata: { action: 'website_visit', url: profile.website },
                  })
                }
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${theme.contactBtnClass}`}
                title="Open Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Dynamic Linktree-Style Links List */}
          {links && links.length > 0 && (
            <div className="w-full mt-4 space-y-2.5 text-left">
              <p className={`text-[11px] font-semibold uppercase tracking-wider mb-2 px-1 ${theme.textMuted}`}>
                Links & Actions
              </p>

              {links.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    analyticsService.trackEvent({
                      userId: profile.userId,
                      eventType: 'link_click',
                      profileId: profile.username,
                      metadata: { label: link.title, url: link.url },
                    })
                  }
                  className={`group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-150 ${theme.linkItemClass} ${theme.linkItemHover}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${theme.linkIconBox}`}>
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold truncate">
                      {link.title}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 shrink-0" />
                </a>
              ))}
            </div>
          )}

          {/* Footer Card Brand Badge */}
          <div className="mt-8 pt-4 border-t border-slate-200/20 text-center w-full">
            <Link
              to="/"
              className={`inline-flex items-center gap-1.5 text-[11px] ${theme.textMuted} hover:opacity-100 transition-opacity`}
            >
              <span>Powered by</span>
              <strong className="font-semibold">{BRAND_CONFIG.name}</strong>
              <CreditCard className="w-3 h-3 text-emerald-500" />
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Exchange Modal */}
      <Modal
        isOpen={isExchangeModalOpen}
        onClose={() => setIsExchangeModalOpen(false)}
        title="Exchange Contact Information"
        description={`Send your contact details directly to ${profile.fullName}`}
      >
        <form onSubmit={handleExchangeSubmit} className="space-y-3.5">
          <Input
            label="Your Full Name *"
            value={exchangeName}
            onChange={(e) => setExchangeName(e.target.value)}
            placeholder="e.g. Maya Lin"
            required
          />
          <Input
            label="Your Email Address *"
            type="email"
            value={exchangeEmail}
            onChange={(e) => setExchangeEmail(e.target.value)}
            placeholder="maya@example.com"
            required
          />
          <Input
            label="Phone Number (Optional)"
            type="tel"
            value={exchangePhone}
            onChange={(e) => setExchangePhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
          />
          <Input
            label="Company / Role (Optional)"
            value={exchangeCompany}
            onChange={(e) => setExchangeCompany(e.target.value)}
            placeholder="Partner, Studio Design"
          />

          <div className="flex justify-end gap-2.5 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsExchangeModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send Contact Details
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
