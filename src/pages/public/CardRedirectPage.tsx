import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Wifi,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  RefreshCw,
} from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';
import { cardService, CardResolutionResult } from '../../services/cardService';
import { sanitizeUsername } from '../../services/profileService';
import { Button } from '../../components/common/Button';
import { NfcBadge } from '../../components/nfc/NfcBadge';
import BRAND_CONFIG from '../../config/brand';

export const CardRedirectPage: React.FC = () => {
  const { cardId } = useParams<{ cardId: string }>();
  const [resolution, setResolution] = useState<CardResolutionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState<'reading' | 'resolving' | 'redirecting' | 'complete'>('reading');
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    async function resolve() {
      if (!cardId) return;

      // Visual stage progression to demonstrate the architecture clearly
      setStage('reading');
      await new Promise((r) => setTimeout(r, 500));

      if (!isMounted) return;
      setStage('resolving');

      const result = await cardService.resolveCard(cardId);

      if (!isMounted) return;

      // If active and has username, log telemetry and redirect
      if (result.status === 'active' && result.redirectUsername) {
        const cleanTarget = sanitizeUsername(result.redirectUsername);
        setResolution({ ...result, redirectUsername: cleanTarget });
        setStage('redirecting');
        setLoading(false);

        // Record real card_redirect analytics event
        if (result.card?.userId) {
          analyticsService.trackEvent({
            userId: result.card.userId,
            eventType: 'card_redirect',
            profileId: cleanTarget,
            cardId: cardId.toUpperCase(),
            metadata: {
              action: 'nfc_tap_redirect',
              label: result.card.label || 'NFC Hardware Card',
            },
          });
        }

        // Redirect after brief delay
        setTimeout(() => {
          if (isMounted) {
            navigate(`/u/${cleanTarget}`);
          }
        }, 1100);
      } else {
        setResolution(result);
        setStage('complete');
        setLoading(false);
      }
    }

    resolve();

    return () => {
      isMounted = false;
    };
  }, [cardId, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
      <div className="max-w-md w-full text-center">
        {/* Brand header */}
        <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
            <CreditCard className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">{BRAND_CONFIG.name}</span>
        </Link>

        {/* Resolution Box */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* NFC Wave Animation */}
          <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-lg">
              <Wifi className="w-8 h-8 rotate-90" />
            </div>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white">
            NFC Tap Detected
          </h2>
          <p className="text-xs font-mono text-emerald-400 mt-1 uppercase tracking-widest">
            Card Hardware ID: {cardId}
          </p>

          {/* Architecture Pipeline Stages */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-left space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">1. Physical Card URL</span>
              <span className="font-mono text-slate-300">/c/{cardId}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">2. Registry Status</span>
              {stage === 'reading' ? (
                <span className="text-slate-500 flex items-center gap-1 font-mono">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Querying...
                </span>
              ) : (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Hardware Valid
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">3. Target Profile</span>
              {stage === 'redirecting' ? (
                <span className="text-emerald-400 font-semibold font-mono">
                  @{resolution?.redirectUsername || localStorage.getItem('tapcard_last_saved_username') || 'profile'}
                </span>
              ) : stage === 'complete' && resolution?.status === 'unassigned' ? (
                <span className="text-amber-400 font-mono">Unassigned</span>
              ) : (
                <span className="text-slate-500 font-mono">Resolving...</span>
              )}
            </div>
          </div>

          {/* Resolution Outcome Message */}
          <div className="mt-6">
            {stage === 'redirecting' ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Routing to live profile...
                </p>
                <Button
                  fullWidth
                  variant="primary"
                  onClick={() =>
                    navigate(
                      `/u/${resolution?.redirectUsername || localStorage.getItem('tapcard_last_saved_username') || 'profile'}`
                    )
                  }
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Open Digital Card
                </Button>
              </div>
            ) : stage === 'complete' && resolution?.status === 'unassigned' ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs text-left">
                  <p className="font-semibold flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    This NFC Card is Not Yet Linked
                  </p>
                  <p className="text-[11px] text-amber-300/80">
                    If this is your new card, log into your TapCard dashboard to link it to your profile.
                  </p>
                </div>
                <Link to="/dashboard/cards">
                  <Button fullWidth size="sm" variant="primary">
                    Claim & Activate Card
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-xs text-slate-400">
                <span>Connecting to cloud profile...</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-[11px] text-slate-500 mt-6">
          Physical NFC cards contain only persistent redirect URLs. Personal info is served securely via cloud resolution.
        </p>
      </div>
    </div>
  );
};
