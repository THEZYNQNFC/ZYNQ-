import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Palette,
  CreditCard,
  Users,
  BarChart3,
  Settings,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import BRAND_CONFIG from '../../config/brand';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const { user } = useAuth();
  const [savedSlug, setSavedSlug] = React.useState<string>(
    () => localStorage.getItem('tapcard_last_saved_username') || ''
  );

  React.useEffect(() => {
    const handleSync = () => {
      setSavedSlug(localStorage.getItem('tapcard_last_saved_username') || '');
    };
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  const navItems = [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, end: true },
    { label: 'My Profile', to: '/dashboard/profile', icon: User },
    { label: 'Customize', to: '/dashboard/customize', icon: Palette },
    { label: 'My Cards', to: '/dashboard/cards', icon: CreditCard },
    { label: 'Leads', to: '/dashboard/leads', icon: Users },
    { label: 'Analytics', to: '/dashboard/analytics', icon: BarChart3 },
    { label: 'Settings', to: '/dashboard/settings', icon: Settings },
  ];

  const rawSlug =
    savedSlug ||
    localStorage.getItem('tapcard_last_saved_username') ||
    user?.username ||
    user?.name?.toLowerCase().replace(/[^a-z0-9_-]/g, '') ||
    user?.email?.split('@')[0].replace(/[^a-z0-9_-]/g, '') ||
    'profile';
  const usernameSlug = rawSlug.replace(/^@+/, '').toLowerCase();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200/90 bg-white select-none">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
            <CreditCard className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-slate-900 leading-none">
              {BRAND_CONFIG.name}
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 mt-0.5">
              Customer Hub
            </span>
          </div>
        </Link>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-600'
                  )}
                />
                <span className="truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <div className="pt-4 mt-4 border-t border-slate-100">
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Administration
            </div>
            <Link
              to="/admin"
              onClick={onCloseMobile}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100/80 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Admin Console</span>
            </Link>
          </div>
        )}
      </div>

      {/* Footer Profile Preview Quick Action */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <Link
          to={`/u/${usernameSlug}`}
          onClick={onCloseMobile}
          className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs group transition-all"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">Your Public Card</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">/u/{usernameSlug}</p>
            </div>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 shrink-0" />
        </Link>
      </div>
    </aside>
  );
};
