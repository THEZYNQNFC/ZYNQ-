import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Palette, Check, Sparkles, Smartphone, Eye, Save } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import { ProfileTheme } from '../../types/profile';
import { profileService, sanitizeUsername } from '../../services/profileService';
import { Profile } from '../../types/profile';
import { LinkItem } from '../../types/link';
import { THEME_PRESETS, getThemeConfig } from '../../config/themes';

export const CustomizePage: React.FC = () => {
  const { currentUser, user } = useAuth();
  const toast = useToast();
  const activeUser = currentUser || user;
  const userId = activeUser?.userId || 'usr_demo_101';

  const [selectedTheme, setSelectedTheme] = useState<ProfileTheme>('midnight-dark');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [loadedProfile, loadedLinks] = await Promise.all([
          profileService.getProfileByUserId(userId),
          profileService.getProfileLinks(userId),
        ]);

        if (loadedProfile) {
          setProfile(loadedProfile);
          if (loadedProfile.theme) {
            setSelectedTheme(loadedProfile.theme);
          }
        }
        if (loadedLinks) {
          setLinks(loadedLinks);
        }
      } catch (err) {
        console.warn('Error loading theme customization data:', err);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      loadData();
    }
  }, [userId]);

  const handleApplyTheme = async () => {
    setIsSaving(true);
    try {
      const updatedProfileData: Partial<Profile> = {
        ...(profile || {}),
        theme: selectedTheme,
        userId,
      };

      await profileService.saveProfileAndLinks(userId, updatedProfileData, links);
      setProfile((prev) => (prev ? { ...prev, theme: selectedTheme } : null));

      const themeConfig = getThemeConfig(selectedTheme);
      toast.success(`Theme updated to ${themeConfig.name}!`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save theme setting.');
    } finally {
      setIsSaving(false);
    }
  };

  const activeThemeConfig = getThemeConfig(selectedTheme);
  const displayName = profile?.fullName || activeUser?.name || 'Your Name';
  const displayTitle = profile?.title || 'Professional Title';
  const displayCompany = profile?.company || '';
  const username = sanitizeUsername(
    profile?.username ||
    activeUser?.username ||
    activeUser?.email?.split('@')[0] ||
    'profile'
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" className="text-slate-800" />
          <p className="text-xs font-medium text-slate-500">Loading theme settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 overflow-x-hidden">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Card Customization & Themes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Tailor the visual branding, color schemes, and styles of your digital profile.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {username && (
            <Link
              to={`/u/${username}`}
              className="inline-flex"
            >
              <Button size="sm" variant="outline" leftIcon={<Eye className="w-4 h-4 text-emerald-600" />}>
                View Live
              </Button>
            </Link>
          )}
          <Button
            size="sm"
            onClick={handleApplyTheme}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isSaving ? 'Applying...' : 'Apply Theme'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left 2 cols: Theme selection grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Select Visual Preset
            </h2>
            <span className="text-xs font-medium text-emerald-600">
              Active: {activeThemeConfig.name}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {THEME_PRESETS.map((theme) => {
              const isSelected = selectedTheme === theme.id;

              return (
                <div
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/20 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-slate-900">{theme.name}</span>
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-300" />
                    )}
                  </div>

                  {/* Swatch preview */}
                  <div className={`h-16 rounded-xl p-3 flex items-end justify-between ${theme.previewSwatchBg}`}>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white font-semibold">
                      Aa
                    </span>
                    <span className={`w-3.5 h-3.5 rounded-full ${theme.previewAccent}`} />
                  </div>

                  <p className="text-xs text-slate-500 mt-3 leading-relaxed">{theme.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right col: Phone Live Preview Frame */}
        <div className="space-y-4 lg:sticky lg:top-20">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-slate-700" />
              Live Phone Preview
            </h2>
            <Badge variant="neutral" size="sm">Real-Time</Badge>
          </div>

          <div className="p-3 bg-slate-950 rounded-[2.5rem] shadow-xl border-4 border-slate-850 max-w-xs mx-auto w-full">
            {/* Phone Screen Area */}
            <div className={`rounded-[2rem] overflow-hidden text-center transition-all duration-300 ${activeThemeConfig.cardBg} ${activeThemeConfig.cardBorder}`}>
              {/* Header Banner */}
              <div className={`h-20 ${activeThemeConfig.headerGradient} p-3 flex justify-between items-start`}>
                <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${activeThemeConfig.headerBadge}`}>
                  NFC Verified
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>

              {/* Avatar & Content */}
              <div className="p-4 pt-0 -mt-10">
                <div className={`w-16 h-16 rounded-full mx-auto mb-2 border-2 ${activeThemeConfig.avatarRing} shadow-md overflow-hidden bg-slate-800 flex items-center justify-center`}>
                  {profile?.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-base font-bold text-emerald-400">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <h4 className={`text-sm font-bold truncate ${activeThemeConfig.textPrimary}`}>
                  {displayName}
                </h4>
                <p className={`text-[11px] truncate mt-0.5 ${activeThemeConfig.textSecondary}`}>
                  {displayTitle}
                  {displayCompany ? ` • ${displayCompany}` : ''}
                </p>

                {profile?.bio && (
                  <p className={`text-[10px] line-clamp-2 mt-2 p-1.5 rounded ${activeThemeConfig.bioBox}`}>
                    {profile.bio}
                  </p>
                )}

                <div className="mt-4 space-y-2">
                  <div className={`py-2 px-3 rounded-xl text-xs font-medium ${activeThemeConfig.actionPrimaryClass}`}>
                    Save Contact (.vcf)
                  </div>
                  <div className={`py-2 px-3 rounded-xl text-xs font-medium ${activeThemeConfig.actionSecondaryClass}`}>
                    Exchange Info
                  </div>
                </div>

                {links && links.length > 0 && (
                  <div className="mt-3 space-y-1.5 text-left">
                    {links.slice(0, 2).map((l) => (
                      <div
                        key={l.id}
                        className={`p-2 rounded-lg text-[11px] font-medium flex items-center justify-between border ${activeThemeConfig.linkItemClass}`}
                      >
                        <span className="truncate">{l.title}</span>
                        <Sparkles className="w-3 h-3 opacity-60 shrink-0" />
                      </div>
                    ))}
                  </div>
                )}

                <p className={`text-[9px] mt-4 font-mono truncate ${activeThemeConfig.textMuted}`}>
                  tapcard.in/u/{username}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
