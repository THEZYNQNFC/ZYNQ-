import React from 'react';
import { Wifi, Sparkles } from 'lucide-react';
import { CardStatus } from '../../types/card';
import { Badge } from '../common/Badge';

export interface NfcBadgeProps {
  cardId: string;
  status: CardStatus;
  label?: string;
  className?: string;
}

export const NfcBadge: React.FC<NfcBadgeProps> = ({ cardId, status, label, className = '' }) => {
  const statusBadges: Record<CardStatus, { variant: 'success' | 'warning' | 'neutral' | 'danger'; text: string }> = {
    active: { variant: 'success', text: 'Active & Linked' },
    unassigned: { variant: 'warning', text: 'Unassigned' },
    suspended: { variant: 'danger', text: 'Suspended' },
    lost: { variant: 'neutral', text: 'Reported Lost' },
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-5 text-white shadow-md border border-slate-700/60 transition-all hover:shadow-xl ${className}`}
    >
      {/* Background Chip Grid Pattern */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-xs">
            <Wifi className="w-4 h-4 text-emerald-400 rotate-90" />
          </div>
          <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">NFC 13.56MHz</span>
        </div>
        <Badge variant={statusBadges[status].variant} size="sm" dot>
          {statusBadges[status].text}
        </Badge>
      </div>

      <div className="mt-4">
        <p className="text-xs text-slate-400 font-medium">{label || 'Hardware Card ID'}</p>
        <p className="text-xl font-mono tracking-wider font-semibold text-white mt-0.5">{cardId}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400" /> Dynamic URL Mapping
        </span>
        <span className="font-mono text-slate-300">/c/{cardId}</span>
      </div>
    </div>
  );
};
