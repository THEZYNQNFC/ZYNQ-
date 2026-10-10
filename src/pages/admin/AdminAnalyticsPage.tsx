import React from 'react';
import { TrendingUp, BarChart3, Wifi, Smartphone, Users } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const AdminAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Global Platform Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          High-level metrics across all active digital cards, devices, and user registrations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Card padding="md">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Global Taps</span>
          <p className="text-3xl font-bold text-slate-900 mt-2">64,800</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">+29% vs last month</p>
        </Card>

        <Card padding="md">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active NFC Cards</span>
          <p className="text-3xl font-bold text-slate-900 mt-2">2,890</p>
          <p className="text-xs text-slate-500 font-medium mt-1">94% claiming rate</p>
        </Card>

        <Card padding="md">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Contacts Exchanged</span>
          <p className="text-3xl font-bold text-slate-900 mt-2">14,210</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">+33% conversion</p>
        </Card>

        <Card padding="md">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Gross Revenue</span>
          <p className="text-3xl font-bold text-slate-900 mt-2">$86,400</p>
          <p className="text-xs text-emerald-600 font-medium mt-1">Hardware + SaaS subs</p>
        </Card>
      </div>

      <Card padding="lg">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900 mb-4">
          Hardware Tap Growth (Monthly Aggregation)
        </h3>
        <div className="h-48 flex items-end gap-4 pt-6 px-4 border-b border-slate-100">
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-slate-200 rounded-t-lg h-[40%]" />
            <span className="text-[10px] text-slate-400 font-mono">Nov</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-slate-200 rounded-t-lg h-[55%]" />
            <span className="text-[10px] text-slate-400 font-mono">Dec</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-slate-300 rounded-t-lg h-[70%]" />
            <span className="text-[10px] text-slate-400 font-mono">Jan</span>
          </div>
          <div className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-emerald-500 rounded-t-lg h-[92%]" />
            <span className="text-[10px] text-slate-800 font-bold font-mono">Feb</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
