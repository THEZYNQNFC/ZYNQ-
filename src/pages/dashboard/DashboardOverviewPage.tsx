import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Wifi,
  Eye,
  Download,
  Users,
  ExternalLink,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  Circle,
  Plus,
  CreditCard,
  QrCode,
  ArrowUpRight,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { NfcBadge } from '../../components/nfc/NfcBadge';
import { Spinner } from '../../components/common/Spinner';
import { ShareModal } from '../../components/profile/ShareModal';
import { profileService, ProfileCompletionResult, sanitizeUsername } from '../../services/profileService';
import { cardService } from '../../services/cardService';
import { analyticsService, AnalyticsSummary } from '../../services/analyticsService';
import { Profile } from '../../types/profile';
import { LinkItem } from '../../types/link';
import { Card as CardType } from '../../types/card';

export const DashboardOverviewPage: React.FC = () => {
  const { currentUser, user } = useAuth();
  const toast = useToast();

  const activeUser = currentUser || user;
  const userId = activeUser?.userId || 'usr_demo_101';

  // Compute first name from user's full name or email
  const firstName = activeUser?.name
    ? activeUser.name.trim().split(' ')[0]
    : activeUser?.email
      ? activeUser.email.split('@')[0]
      : 'Friend';

  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [cards, setCards] = useState<CardType[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Load real profile and links from Firestore
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [loadedProfile, loadedLinks, loadedCards, loadedAnalytics] = await Promise.all([
          profileService.getProfileByUserId(userId),
          profileService.getProfileLinks(userId),
          cardService.getUserCards(userId),
          analyticsService.getUserAnalytics(userId),
        ]);

        if (isMounted) {
          if (loadedProfile) {
            setProfile(loadedProfile);
          } else {
            // Default starter profile state for newly registered user
            const fallbackSlug =
              activeUser?.username ||
              activeUser?.name?.toLowerCase().replace(/[^a-z0-9_-]/g, '') ||
              activeUser?.email?.split('@')[0].replace(/[^a-z0-9_-]/g, '') ||
              '';
            setProfile({
              userId,
              username: fallbackSlug,
              fullName: activeUser?.name || '',
              email: activeUser?.email || '',
              theme: 'modern-slate',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
          setLinks(loadedLinks || []);
          setCards(loadedCards || []);
          setAnalytics(loadedAnalytics || null);
        }
      } catch (err) {
        console.warn('Error loading dashboard overview data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (userId) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, [userId, activeUser]);

  // Username from Firestore profile document, local storage, or session
  const username = sanitizeUsername(
    profile?.username ||
    localStorage.getItem('tapcard_last_saved_username') ||
    activeUser?.username ||
    activeUser?.email?.split('@')[0] ||
    'profile'
  );
  const displayUrl = `tapcard.in/u/${username}`;
  const fullLiveUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/u/${username}`
    : `https://tapcard.in/u/${username}`;

  // Dynamic Profile Completion checklist calculation
  const completionChecklist = [
    {
      id: 'account',
      label: 'Account created',
      completed: true, // Always true for logged in user
      hint: '',
    },
    {
      id: 'name',
      label: 'Name added',
      completed: Boolean(profile?.fullName && profile.fullName.trim().length > 0),
      hint: 'Add full name',
    },
    {
      id: 'photo',
      label: 'Profile photo',
      completed: Boolean(profile?.profileImage && profile.profileImage.trim().length > 0),
      hint: 'Upload headshot',
    },
    {
      id: 'title',
      label: 'Job title',
      completed: Boolean(profile?.title && profile.title.trim().length > 0),
      hint: 'Add current title',
    },
    {
      id: 'company',
      label: 'Company',
      completed: Boolean(profile?.company && profile.company.trim().length > 0),
      hint: 'Add organization',
    },
    {
      id: 'contact',
      label: 'Contact information',
      completed: Boolean(
        (profile?.phone && profile.phone.trim().length > 0) ||
        (profile?.email && profile.email.trim().length > 0) ||
        (profile?.whatsapp && profile.whatsapp.trim().length > 0)
      ),
      hint: 'Add phone/email',
    },
    {
      id: 'social',
      label: 'Social links',
      completed: links.some(
        (l) => l.type === 'social' && l.enabled && l.url && l.url.trim().length > 0
      ),
      hint: 'Connect LinkedIn/X',
    },
  ];

  const completedCount = completionChecklist.filter((c) => c.completed).length;
  const totalChecklistCount = completionChecklist.length;
  const completionPercentage = Math.round((completedCount / totalChecklistCount) * 100);

  // Copy Link Handler
  const handleCopyLink = async () => {
    if (!username) {
      toast.info('Please configure your username in My Profile first.');
      return;
    }

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(fullLiveUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = fullLiveUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedLink(true);
      toast.success('TapCard link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      toast.error('Could not copy link to clipboard.');
    }
  };

  const stats = [
    {
      label: 'Total NFC Taps',
      value: String(analytics?.totalCardTaps || 0),
      subtext: (analytics?.totalCardTaps || 0) > 0 ? 'Resolved via hardware cards' : 'No taps yet',
      icon: Wifi,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Profile Views',
      value: String(analytics?.totalViews || 0),
      subtext: (analytics?.totalViews || 0) > 0 ? `${analytics?.totalViews} total visits` : '0 views recorded',
      icon: Eye,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
    },
    {
      label: 'Contacts Saved',
      value: String(analytics?.saveContactCount || 0),
      subtext: (analytics?.saveContactCount || 0) > 0 ? `${analytics?.saveContactCount} vCards saved` : '0 contact cards saved',
      icon: Download,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'Link Clicks',
      value: String(analytics?.totalLinkClicks || 0),
      subtext: (analytics?.totalLinkClicks || 0) > 0 ? `${analytics?.totalLinkClicks} link taps` : 'Share card to track clicks',
      icon: Users,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Welcome Message Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Welcome back, {firstName}
            </h1>
            <Badge variant="success" size="sm" dot>Active</Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Your TapCard profile is live. Manage your card identity and view real-time engagement.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/dashboard/profile">
            <Button size="sm" variant="primary" leftIcon={<Sparkles className="w-4 h-4" />}>
              Edit Profile
            </Button>
          </Link>
          <Link to="/dashboard/customize">
            <Button size="sm" variant="secondary">
              Customize Theme
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Primary 2-Column Split: YOUR TAPCARD URL & DYNAMIC PROFILE COMPLETION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: SECTION 3 — YOUR TAPCARD PROFILE URL CARD */}
        <div className="lg:col-span-6 flex">
          <Card padding="md" className="flex-1 flex flex-col justify-between border-slate-200/90 relative overflow-hidden bg-gradient-to-br from-white via-white to-slate-50/50">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                      Your TapCard
                    </h2>
                    <p className="text-xs text-slate-500">Unique digital business card address</p>
                  </div>
                </div>

                <Badge variant={username ? 'success' : 'neutral'} size="sm">
                  {username ? 'Online' : 'Pending Username'}
                </Badge>
              </div>

              {/* URL Display Area */}
              <div className="my-5 p-4 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-inner flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-400 block mb-0.5">
                    Live Destination
                  </span>
                  {username ? (
                    <span className="font-mono text-sm sm:text-base font-semibold text-white tracking-tight break-all">
                      {displayUrl}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      Username not configured yet. Set up your username to activate this link.
                    </span>
                  )}
                </div>

                {username && (
                  <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg shrink-0 self-start sm:self-center border border-slate-700">
                    HTTPS
                  </span>
                )}
              </div>
            </div>

            {/* SECTION 3 REQUIRED BUTTONS: "View Profile", "Copy Link", "Share" */}
            <div className="pt-2 border-t border-slate-100">
              {username ? (
                <div className="grid grid-cols-3 gap-2.5">
                  {/* Button 1: View Profile */}
                  <Link
                    to={`/u/${username}`}
                    className="inline-flex w-full"
                  >
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      fullWidth
                      leftIcon={<ExternalLink className="w-3.5 h-3.5 text-slate-600" />}
                    >
                      View Profile
                    </Button>
                  </Link>

                  {/* Button 2: Copy Link */}
                  <Button
                    type="button"
                    size="sm"
                    variant={copiedLink ? 'secondary' : 'outline'}
                    fullWidth
                    onClick={handleCopyLink}
                    leftIcon={
                      copiedLink ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-600" />
                      )
                    }
                  >
                    {copiedLink ? 'Copied!' : 'Copy Link'}
                  </Button>

                  {/* Button 3: Share */}
                  <Button
                    type="button"
                    size="sm"
                    variant="primary"
                    fullWidth
                    onClick={() => setIsShareModalOpen(true)}
                    leftIcon={<Share2 className="w-3.5 h-3.5" />}
                  >
                    Share
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Set your username to get your custom link</span>
                  <Link to="/dashboard/profile">
                    <Button size="sm" variant="primary">
                      Set Username
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: SECTION 2 — DYNAMIC PROFILE COMPLETION CARD */}
        <div className="lg:col-span-6 flex">
          <Card padding="md" className="flex-1 flex flex-col justify-between border-slate-200/90">
            <div>
              {/* Header: Title and Percentage */}
              <div className="flex items-start justify-between mb-3 pb-2 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Profile Completion
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Complete your profile to make the most of your TapCard.
                  </p>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-lg font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                    {completionPercentage}%
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {completedCount} of {totalChecklistCount} tasks
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 mb-5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              {/* Dynamic Checklist List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {completionChecklist.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs ${
                      item.completed
                        ? 'border-emerald-100 bg-emerald-50/40 text-slate-800'
                        : 'border-slate-200/70 bg-slate-50/60 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {item.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                      )}
                      <span className={`truncate font-medium ${item.completed ? 'text-slate-900' : 'text-slate-600'}`}>
                        {item.label}
                      </span>
                    </div>

                    {!item.completed && item.hint && (
                      <Link
                        to="/dashboard/profile"
                        className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 shrink-0 ml-1.5"
                      >
                        Add →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                {completionPercentage === 100
                  ? 'All profile details are configured!'
                  : 'Add remaining details in the profile editor.'}
              </span>
              <Link
                to="/dashboard/profile"
                className="font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                Go to Profile Editor <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* 3. Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} padding="md" className="flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</span>
              <div className={`w-8 h-8 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-slate-500 font-normal mt-1">
                <span>{stat.subtext}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 4. Physical NFC Hardware Card & Quick Leads Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1/3: Physical NFC Card Hardware Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
              Primary NFC Card
            </h2>
            <Link to="/dashboard/cards" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">
              Manage fleet
            </Link>
          </div>

          {cards.length > 0 ? (
            <>
              <NfcBadge
                cardId={cards[0].cardId}
                status={cards[0].status}
                label={cards[0].label || 'Active Hardware Card'}
              />

              <Card padding="sm" className="bg-slate-50/70 text-xs text-slate-600 space-y-2">
                <div className="flex items-center justify-between font-medium">
                  <span>Card URL:</span>
                  <span className="font-mono text-slate-900">https://tapcard.in/c/{cards[0].cardId}</span>
                </div>
                <div className="flex items-center justify-between font-medium">
                  <span>Target:</span>
                  <span className="font-mono text-emerald-700">/u/{username || 'profile'}</span>
                </div>
                <div className="pt-2 border-t border-slate-200/80 flex justify-between items-center">
                  <span className="text-[11px] text-slate-500">Test physical tap flow:</span>
                  <Link
                    to={`/c/${cards[0].cardId}`}
                    className="text-emerald-600 hover:underline font-semibold text-xs flex items-center gap-1"
                  >
                    Simulate Tap <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </Card>
            </>
          ) : (
            <Card padding="md" className="bg-slate-50/70 text-center py-6">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-5 h-5 text-slate-400" />
              </div>
              <h4 className="text-xs font-semibold text-slate-800">No NFC Card Linked Yet</h4>
              <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Connect your physical TapCard hardware to resolve dynamic taps directly to your profile.
              </p>
              <div className="mt-4">
                <Link to="/dashboard/cards">
                  <Button size="sm" variant="outline">
                    Link Physical Card
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        {/* Right 2/3: Recent Contacts Preview */}
        <div className="lg:col-span-2 space-y-6">
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900">Recent Contacts Exchanged</h3>
                <p className="text-xs text-slate-500 mt-0.5">People who tapped your card and shared their info.</p>
              </div>
              <Link to="/dashboard/leads">
                <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  View all leads
                </Button>
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-900">Sarah Jenkins</p>
                  <p className="text-slate-500">sarah@nexusventures.com • Nexus Ventures</p>
                </div>
                <Badge variant="neutral" size="sm">2 hours ago</Badge>
              </div>
              <div className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-900">David Chen</p>
                  <p className="text-slate-500">david.c@hyperion.tech • VP of Engineering</p>
                </div>
                <Badge variant="neutral" size="sm">Yesterday</Badge>
              </div>
              <div className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-slate-900">Elena Rostova</p>
                  <p className="text-slate-500">elena@creativeatelier.design • Creative Director</p>
                </div>
                <Badge variant="neutral" size="sm">3 days ago</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Share Modal */}
      {username && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          username={username}
          fullName={profile?.fullName || activeUser?.name || 'TapCard'}
        />
      )}
    </div>
  );
};
