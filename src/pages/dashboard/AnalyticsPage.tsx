import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Wifi,
  Smartphone,
  Globe,
  Share2,
  ExternalLink,
  MousePointerClick,
  Download,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { useAuth } from '../../hooks/useAuth';
import { analyticsService, AnalyticsSummary } from '../../services/analyticsService';
import { profileService, sanitizeUsername } from '../../services/profileService';

export const AnalyticsPage: React.FC = () => {
  const { currentUser, user } = useAuth();
  const activeUser = currentUser || user;
  const userId = activeUser?.userId || 'usr_demo_101';

  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [profileUsername, setProfileUsername] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [summary, prof] = await Promise.all([
        analyticsService.getUserAnalytics(userId),
        profileService.getProfileByUserId(userId),
      ]);
      setAnalytics(summary);
      if (prof?.username) {
        setProfileUsername(prof.username);
      } else {
        const fallback = activeUser?.username || activeUser?.email?.split('@')[0] || 'profile';
        setProfileUsername(sanitizeUsername(fallback));
      }
    } catch (err) {
      console.warn('Error loading user analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadData();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" className="text-slate-800" />
          <p className="text-xs font-medium text-slate-500">Querying real-time telemetry...</p>
        </div>
      </div>
    );
  }

  const totalViews = analytics?.totalViews || 0;
  const totalCardTaps = analytics?.totalCardTaps || 0;
  const totalLinkClicks = analytics?.totalLinkClicks || 0;
  const totalContactActions = analytics?.totalContactActions || 0;
  const saveRate = totalViews > 0 ? Math.round(((analytics?.saveContactCount || 0) / totalViews) * 100) : 0;
  const events = analytics?.recentEvents || [];
  const platforms = analytics?.platformDistribution || {};

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            NFC & Profile Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time tap analytics and engagement breakdown across your physical cards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={loadData}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Data
          </Button>
          <Badge variant="success" size="md" dot>
            Live Feed Active
          </Badge>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card padding="md">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Profile Views</span>
            <Eye className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{totalViews}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {totalViews > 0 ? `${totalViews} web & tap visits` : 'No views recorded yet'}
          </p>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Physical NFC Taps</span>
            <Wifi className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{totalCardTaps}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {totalCardTaps > 0 ? 'Resolved via hardware cards' : '0 card taps recorded'}
          </p>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Link Clicks</span>
            <MousePointerClick className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{totalLinkClicks}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {totalLinkClicks > 0 ? 'External link engagements' : '0 link clicks'}
          </p>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Contact Saves</span>
            <Download className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">{totalContactActions}</p>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {saveRate > 0 ? `${saveRate}% conversion rate` : '0 saved contacts'}
          </p>
        </Card>
      </div>

      {/* Device & Operating System Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card padding="md">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-600" /> Device Platform Distribution
          </h3>

          {Object.keys(platforms).length === 0 ? (
            <div className="p-6 text-center rounded-xl bg-slate-50 border border-slate-100">
              <Smartphone className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-700">No platform telemetry yet</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Operating system and browser telemetry will log automatically when recipients open your profile.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(platforms).map(([platform, count]) => {
                const total = totalViews + totalCardTaps + totalLinkClicks || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <div key={platform} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700">
                      <span>{platform}</span>
                      <span className="text-slate-500">{count} events ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card padding="md">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-600" /> Profile Testing & Live URL
          </h3>

          <div className="p-6 rounded-xl bg-slate-50 border border-slate-100 space-y-3 text-left">
            <p className="text-xs text-slate-600 leading-relaxed">
              Every actual interaction on your public digital business card is tracked live. Open your card link to test real telemetry logging:
            </p>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 font-mono text-xs text-slate-800 break-all select-all">
              {typeof window !== 'undefined' ? `${window.location.origin}/u/${profileUsername}` : `/u/${profileUsername}`}
            </div>
            {profileUsername && (
              <div className="pt-2 flex gap-2">
                <Link to={`/u/${profileUsername}`}>
                  <Button size="sm" variant="primary" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                    Open Public Profile
                  </Button>
                </Link>
                <Link to="/dashboard/cards">
                  <Button size="sm" variant="outline">
                    Manage NFC Cards
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Live Tap Event Stream */}
      <Card padding="none" className="overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900">Recent Telemetry Event Stream</h3>
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${events.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            {events.length > 0 ? `${events.length} Recorded Events` : 'Awaiting Events'}
          </span>
        </div>

        {events.length === 0 ? (
          <div className="p-10 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Wifi className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">No events recorded yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">
              Share your digital business card link or tap your physical NFC card to start streaming live telemetry events.
            </p>
            {profileUsername && (
              <Link to={`/u/${profileUsername}`}>
                <Button size="sm" variant="outline" leftIcon={<Eye className="w-3.5 h-3.5 text-emerald-600" />}>
                  Open My Card to Log First View
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 text-xs">
            {events.map((item) => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    {item.type.includes('NFC') ? (
                      <Wifi className="w-4 h-4" />
                    ) : item.type.includes('Link') ? (
                      <MousePointerClick className="w-4 h-4" />
                    ) : item.type.includes('Contact') ? (
                      <Download className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {item.type} <span className="text-slate-500 font-normal">({item.label})</span>
                    </p>
                    <p className="text-slate-500 text-[11px]">{item.device} • {item.card}</p>
                  </div>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">{item.time}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
