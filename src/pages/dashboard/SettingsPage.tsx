import React, { useState } from 'react';
import { Settings, Shield, Bell, Key, Globe, Lock, Save, AlertTriangle } from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [tapNotifications, setTapNotifications] = useState(false);
  const [customDomain, setCustomDomain] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Account preferences saved.');
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Account & Security Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage authentication credentials, hardware security, and notification triggers.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Account Credentials */}
        <Card padding="md">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" /> Account Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Primary Login Email"
              type="email"
              value={user?.email || 'alex@tapcard.in'}
              disabled
              helperText="Contact support to update your registered email."
            />
            <Input
              label="User ID"
              value={user?.userId || 'usr_demo_101'}
              disabled
              helperText="Unique identifier in Firestore database."
            />
          </div>
        </Card>

        {/* Custom Domain Settings */}
        <Card padding="md">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-600" /> Custom Domain (Pro)
          </h2>

          <p className="text-xs text-slate-500 mb-4">
            Directly route your physical NFC cards and online links to your personal or company domain (e.g., <code>card.yourbrand.com</code>).
          </p>

          <Input
            label="Custom Domain"
            placeholder="e.g. card.auravt.io"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            helperText="Add a CNAME record pointing to proxy.tapcard.in"
          />
        </Card>

        {/* Notifications */}
        <Card padding="md">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-purple-600" /> Notifications & Alerts
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-800">Email Me on Lead Submission</p>
                <p className="text-[11px] text-slate-500">Receive an email immediately whenever a card tap submits their contact.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-emerald-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-800">Real-Time Tap Notifications</p>
                <p className="text-[11px] text-slate-500">Alert me when a physical NFC tap occurs in a new location.</p>
              </div>
              <input
                type="checkbox"
                checked={tapNotifications}
                onChange={(e) => setTapNotifications(e.target.checked)}
                className="w-4 h-4 accent-emerald-600"
              />
            </label>
          </div>
        </Card>

        {/* Emergency Hardware Lockdown */}
        <Card padding="md" className="border-rose-200 bg-rose-50/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-rose-900">Emergency NFC Hardware Deactivation</h3>
              <p className="text-xs text-rose-700/80 mt-1 leading-relaxed">
                If you lose your physical card, you can immediately suspend its URL routing here. Anyone tapping the physical card will see an inactive message, preventing unauthorized contact extraction.
              </p>
              <div className="mt-3">
                <Button size="sm" variant="danger">
                  Suspend Active Cards
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button type="submit" isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
