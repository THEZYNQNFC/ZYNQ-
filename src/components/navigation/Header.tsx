import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  ExternalLink,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Badge } from '../common/Badge';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  title,
  subtitle,
}) => {
  const { currentUser, user, logout, isDemoMode } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [savedSlug, setSavedSlug] = useState<string>(
    () => localStorage.getItem('tapcard_last_saved_username') || ''
  );

  const activeUser = currentUser || user;

  // Resolve username gracefully
  const rawSlug =
    savedSlug ||
    localStorage.getItem('tapcard_last_saved_username') ||
    activeUser?.username ||
    activeUser?.name?.toLowerCase().replace(/[^a-z0-9_-]/g, '') ||
    activeUser?.email?.split('@')[0].replace(/[^a-z0-9_-]/g, '') ||
    'profile';
  const usernameSlug = rawSlug.replace(/^@+/, '').toLowerCase();

  // Extract initials
  const initials =
    activeUser?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() ||
    activeUser?.email?.charAt(0).toUpperCase() ||
    'U';

  useEffect(() => {
    const handleSync = () => {
      setSavedSlug(localStorage.getItem('tapcard_last_saved_username') || '');
    };
    window.addEventListener('storage', handleSync);
    return () => window.removeEventListener('storage', handleSync);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
    } finally {
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/90 bg-white/90 px-4 sm:px-6 lg:px-8 backdrop-blur-md">
      {/* Left: Mobile trigger & Page Header info */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          {title && <h1 className="text-base font-semibold text-slate-900 leading-none">{title}</h1>}
          {subtitle && <p className="text-xs text-slate-500 mt-1 leading-none">{subtitle}</p>}
        </div>
      </div>

      {/* Right: Actions, Notifications, Profile Preview, User Dropdown */}
      <div className="flex items-center gap-3">
        {isDemoMode && (
          <Badge variant="warning" size="sm" dot className="hidden sm:inline-flex">
            Demo Shell
          </Badge>
        )}

        {/* Profile Preview Button */}
        <Link
          to={`/u/${usernameSlug}`}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Profile Preview</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        {/* Notifications Placeholder */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white p-4 shadow-xl border border-slate-200/90 z-50 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Notifications
                </span>
                <span className="text-[11px] text-emerald-600 font-medium">1 new</span>
              </div>
              <div className="py-3 space-y-2.5">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-slate-800">Telemetry Feed Active</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Physical card scans stream live to your analytics dashboard.</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">10m ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Account Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-xl p-1.5 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold overflow-hidden ring-1 ring-slate-200">
              {activeUser?.photoURL ? (
                <img src={activeUser.photoURL} alt={activeUser.name} className="w-full h-full object-cover" />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-none">{activeUser?.name || 'Account'}</span>
              <span className="text-[10px] text-slate-500 leading-none mt-1 capitalize">{activeUser?.role || 'user'}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white py-1.5 shadow-xl border border-slate-200/90 z-50 text-left">
              {/* Account header: Avatar/Initials, User Name, User Email */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold overflow-hidden shrink-0">
                  {activeUser?.photoURL ? (
                    <img src={activeUser.photoURL} alt={activeUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">{activeUser?.name || 'User'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{activeUser?.email || ''}</p>
                </div>
              </div>

              {/* Menu options: View Profile, Settings, Log Out */}
              <div className="py-1">
                <Link
                  to={`/u/${usernameSlug}`}
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>View Profile</span>
                </Link>
                <Link
                  to="/dashboard/settings"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Settings</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
