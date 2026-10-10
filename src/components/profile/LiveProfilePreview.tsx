import React from 'react';
import {
  Phone,
  Mail,
  MessageCircle,
  Globe,
  MapPin,
  Building2,
  ExternalLink,
  Sparkles,
  Download,
  Share2,
} from 'lucide-react';
import { Profile } from '../../types/profile';
import { LinkItem, SocialPlatform } from '../../types/link';

interface LiveProfilePreviewProps {
  profile: Partial<Profile>;
  links: LinkItem[];
  className?: string;
}

export const LiveProfilePreview: React.FC<LiveProfilePreviewProps> = ({
  profile,
  links,
  className = '',
}) => {
  const socialIcons: Record<SocialPlatform, { name: string; bg: string; icon: string }> = {
    linkedin: { name: 'LinkedIn', bg: 'bg-[#0077B5]', icon: '💼' },
    instagram: { name: 'Instagram', bg: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]', icon: '📸' },
    x: { name: 'X / Twitter', bg: 'bg-black', icon: '𝕏' },
    facebook: { name: 'Facebook', bg: 'bg-[#1877F2]', icon: '👥' },
    youtube: { name: 'YouTube', bg: 'bg-[#FF0000]', icon: '▶️' },
    tiktok: { name: 'TikTok', bg: 'bg-[#000000]', icon: '🎵' },
    github: { name: 'GitHub', bg: 'bg-[#24292e]', icon: '🐙' },
    telegram: { name: 'Telegram', bg: 'bg-[#229ED9]', icon: '✈️' },
  };

  const enabledSocialLinks = links.filter((l) => l.type === 'social' && l.enabled && l.url.trim().length > 0);
  const enabledCustomLinks = links.filter((l) => l.type === 'custom' && l.enabled && l.url.trim().length > 0);

  const initials =
    profile.fullName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'TC';

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Phone Hardware Mockup Frame */}
      <div className="relative w-full max-w-[340px] rounded-[42px] bg-slate-950 p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50">
        {/* Dynamic Island / Speaker Pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-900 rounded-full z-20 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-950 mr-2" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
        </div>

        {/* Screen Canvas */}
        <div className="relative rounded-[32px] overflow-hidden bg-slate-900 text-white min-h-[580px] max-h-[640px] overflow-y-auto flex flex-col justify-between scrollbar-none border border-slate-800">
          {/* Top Banner Gradient */}
          <div className="h-28 bg-gradient-to-br from-slate-800 via-slate-800/80 to-emerald-950/70 p-3 pt-6 flex items-start justify-between">
            <span className="text-[9px] font-mono tracking-wider uppercase text-emerald-400 bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur-xs">
              Live Preview
            </span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Profile Header & Info */}
          <div className="px-5 pb-5 -mt-14 flex flex-col items-center text-center flex-1">
            {/* Avatar / Photo */}
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-full border-4 border-slate-900 shadow-xl overflow-hidden bg-slate-800 flex items-center justify-center">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt={profile.fullName || 'Profile Avatar'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-xl font-bold text-emerald-400">
                    {initials}
                  </div>
                )}
              </div>
            </div>

            {/* Name */}
            <h3 className="text-xl font-bold tracking-tight text-white leading-tight">
              {profile.fullName || 'Your Name'}
            </h3>

            {/* Job Title & Company */}
            {(profile.title || profile.company) && (
              <p className="text-xs font-medium text-emerald-400 mt-1 flex items-center justify-center gap-1.5 flex-wrap">
                {profile.title && <span>{profile.title}</span>}
                {profile.title && profile.company && <span className="text-slate-600">•</span>}
                {profile.company && (
                  <span className="text-slate-300 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    {profile.company}
                  </span>
                )}
              </p>
            )}

            {/* Location */}
            {profile.location && (
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-500" />
                <span>{profile.location}</span>
              </p>
            )}

            {/* Bio */}
            {profile.bio && (
              <p className="text-xs text-slate-300 mt-2.5 max-w-[280px] leading-relaxed line-clamp-3">
                {profile.bio}
              </p>
            )}

            {/* Action Buttons Mockup */}
            <div className="grid grid-cols-2 gap-2 w-full mt-4">
              <div className="bg-emerald-600 text-white rounded-xl py-2 px-3 text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-sm">
                <Download className="w-3.5 h-3.5" /> Save Contact
              </div>
              <div className="bg-slate-800 border border-slate-700 text-slate-200 rounded-xl py-2 px-3 text-[11px] font-medium flex items-center justify-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-slate-400" /> Share
              </div>
            </div>

            {/* Contact Channels Bar */}
            {(profile.phone || profile.whatsapp || profile.email || profile.website) && (
              <div className="flex items-center justify-center gap-2.5 mt-4 py-2 px-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 w-full">
                {profile.phone && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center text-xs" title="Phone">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                )}
                {profile.whatsapp && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/40 flex items-center justify-center text-xs" title="WhatsApp">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </div>
                )}
                {profile.email && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center text-xs" title="Email">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                )}
                {profile.website && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-200 flex items-center justify-center text-xs" title="Website">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            )}

            {/* Social Media Grid */}
            {enabledSocialLinks.length > 0 && (
              <div className="w-full mt-4 text-left">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Social Profiles
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {enabledSocialLinks.map((link) => {
                    const info = link.platform && socialIcons[link.platform] ? socialIcons[link.platform] : { name: link.title, bg: 'bg-slate-800', icon: '🔗' };
                    return (
                      <div
                        key={link.id}
                        className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-800/70 border border-slate-700/60 text-center hover:bg-slate-800 transition-colors"
                        title={info.name}
                      >
                        <span className="text-base leading-none mb-1">{info.icon}</span>
                        <span className="text-[9px] font-medium text-slate-300 truncate w-full">
                          {link.platform || link.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Custom Links List */}
            {enabledCustomLinks.length > 0 && (
              <div className="w-full mt-4 text-left space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Custom Links
                </p>
                {enabledCustomLinks.map((link) => (
                  <div
                    key={link.id}
                    className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between hover:bg-slate-800 transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-semibold text-slate-100 truncate">{link.title || 'Untitled Link'}</p>
                      {link.description && (
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{link.description}</p>
                      )}
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Branding Bar */}
          <div className="p-3 border-t border-slate-800/60 bg-slate-950/40 text-center">
            <span className="text-[10px] text-slate-500 font-mono">
              tapcard.in/u/{profile.username || 'username'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
