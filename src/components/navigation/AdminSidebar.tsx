import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  ShieldAlert,
  Users,
  CreditCard,
  UserCheck,
  Inbox,
  Package,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react';
import BRAND_CONFIG from '../../config/brand';
import { cn } from '../../utils/cn';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile }) => {
  const adminNav = [
    { label: 'Platform Overview', to: '/admin', icon: ShieldAlert, end: true },
    { label: 'User Directory', to: '/admin/users', icon: Users },
    { label: 'Card Hardware Fleet', to: '/admin/cards', icon: CreditCard },
    { label: 'Customer Profiles', to: '/admin/profiles', icon: UserCheck },
    { label: 'Lead Records', to: '/admin/leads', icon: Inbox },
    { label: 'NFC Card Orders', to: '/admin/orders', icon: Package },
    { label: 'Platform Analytics', to: '/admin/analytics', icon: TrendingUp },
  ];

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200/90 bg-slate-900 text-white select-none">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-xs border border-amber-500/30">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-white leading-none">
              {BRAND_CONFIG.name}
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-400 mt-0.5">
              Admin Console
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Management
        </div>

        {adminNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive ? 'text-slate-950' : 'text-slate-400'
                  )}
                />
                <span className="truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Footer Switch to Customer View */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <Link
          to="/dashboard"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Customer App</span>
        </Link>
      </div>
    </aside>
  );
};
