import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Wifi,
  Smartphone,
  Share2,
  Users,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Palette,
  Download,
  Mail,
  Phone,
  Globe,
  ExternalLink,
} from 'lucide-react';
import BRAND_CONFIG from '../../config/brand';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { THEME_PRESETS, getThemeConfig } from '../../config/themes';

export const HomePage: React.FC = () => {
  const [demoThemeId, setDemoThemeId] = useState<string>('midnight-dark');
  const demoTheme = getThemeConfig(demoThemeId);

  return (
    <div className="relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 left-1/4 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full bg-slate-300/30 blur-3xl" />
      </div>

      {/* HERO SECTION (id="product") */}
      <section id="product" className="pt-20 pb-16 sm:pt-28 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-6">
          <Badge variant="success" size="md" dot>
            Next-Gen Networking Hardware + Cloud Platform
          </Badge>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.08]">
          The physical card with a <span className="text-emerald-600 underline decoration-emerald-300 decoration-wavy decoration-2">living digital identity</span>.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Tap your physical NFC card to any smartphone to instantly share your digital business card, social links, and contact file. Update your information anytime without reprinting.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/signup">
            <Button size="lg" className="px-8 font-semibold shadow-lg shadow-slate-900/10" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Claim Your Profile
            </Button>
          </Link>
          <a href="#preview">
            <Button size="lg" variant="outline" leftIcon={<Sparkles className="w-4 h-4 text-emerald-600" />}>
              Explore Live Card Demo
            </Button>
          </a>
        </div>

        {/* Feature Badges Grid (id="features") */}
        <div id="features" className="mt-16 pt-12 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <Wifi className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">100% App-Free</h4>
            <p className="text-xs text-slate-500 mt-1">Recipients tap and view instantly on iOS or Android without installing an app.</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center mb-2">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">Dynamic URL</h4>
            <p className="text-xs text-slate-500 mt-1">Update your phone, email, bio, or company anytime without replacing your physical card.</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">Two-Way Leads</h4>
            <p className="text-xs text-slate-500 mt-1">Allow prospective clients to send back their contact in 5 seconds into your dashboard.</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-slate-900">Real Telemetry</h4>
            <p className="text-xs text-slate-500 mt-1">Track actual views, link clicks, and NFC taps in real-time on your SaaS analytics hub.</p>
          </div>
        </div>
      </section>

      {/* HOW NFC ARCHITECTURE WORKS (id="how-it-works") */}
      <section id="how-it-works" className="py-20 bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="purple" size="md">
              Hardware Architecture
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mt-3">
              How the {BRAND_CONFIG.name} NFC Pipeline Works
            </h2>
            <p className="text-slate-400 mt-4 text-sm sm:text-base">
              Unlike static paper cards, our physical NFC hardware never stores outdated contact text. It holds a persistent redirect URL that dynamically resolves to your real-time cloud profile.
            </p>
          </div>

          {/* Interactive Pipeline Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold text-emerald-400 uppercase">Step 01</span>
                <h3 className="text-lg font-semibold text-white mt-1">NFC Card Tap</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  The client taps your NFC business card against their iPhone or Android phone.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700/60 font-mono text-xs text-slate-300">
                13.56 MHz Radio Frequency
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
                  <Wifi className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold text-sky-400 uppercase">Step 02</span>
                <h3 className="text-lg font-semibold text-white mt-1">Unique URL Read</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  The phone reads the card's persistent hardware endpoint without needing any app.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700/60 font-mono text-xs text-emerald-400">
                tapcard.in/c/{'{CARD_ID}'}
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold text-amber-400 uppercase">Step 03</span>
                <h3 className="text-lg font-semibold text-white mt-1">Cloud Resolution</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Our cloud engine resolves Card ID → Customer Profile in &lt;100ms.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700/60 font-mono text-xs text-slate-300">
                Card ID → Dynamic Profile
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono font-semibold text-purple-400 uppercase">Step 04</span>
                <h3 className="text-lg font-semibold text-white mt-1">Digital Card Opens</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Visitor saves contact, taps WhatsApp, reviews portfolio, and exchanges their contact.
                </p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700/60 font-mono text-xs text-emerald-400">
                Instant .vcf + Lead Capture
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GENERIC ILLUSTRATIVE DEMO PREVIEW SECTION (id="preview") */}
      <section id="preview" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="neutral" size="md">
            Product Demonstration
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-3">
            See What Your Recipients Experience
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base">
            This generic illustrative preview shows what a visitor sees when tapping your NFC card. Try switching themes below to see how themes customize your digital presence.
          </p>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
            (Generic illustrative preview — contains no real customer data)
          </p>

          {/* Theme Switcher Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setDemoThemeId(preset.id)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                  demoThemeId === preset.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Phone Frame Container */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm p-4 bg-slate-950 rounded-[2.5rem] shadow-2xl border-4 border-slate-800">
            {/* Inner Phone Screen */}
            <div className={`rounded-[2rem] overflow-hidden ${demoTheme.cardBg} ${demoTheme.cardBorder} transition-all duration-300`}>
              {/* Cover Banner */}
              <div className={`h-24 ${demoTheme.headerGradient} p-3 flex items-start justify-between`}>
                <span className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-md font-semibold ${demoTheme.headerBadge}`}>
                  NFC Verified
                </span>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>

              {/* Profile Card Body */}
              <div className="p-5 pt-0 -mt-10 flex flex-col items-center text-center">
                <div className={`w-20 h-20 rounded-full border-4 ${demoTheme.avatarRing} shadow-lg overflow-hidden bg-slate-800 flex items-center justify-center mb-2`}>
                  <div className="w-full h-full bg-gradient-to-tr from-slate-800 to-slate-700 flex items-center justify-center text-xl font-bold text-emerald-400">
                    AV
                  </div>
                </div>

                <h3 className={`text-lg font-bold ${demoTheme.textPrimary}`}>
                  Alex Vance
                </h3>
                <p className={`text-xs ${demoTheme.textSecondary}`}>
                  Principal Architect • Vance Studio
                </p>
                <p className={`text-[11px] ${demoTheme.textMuted} mt-0.5`}>
                  San Francisco, CA
                </p>

                <p className={`text-[11px] mt-2.5 p-2.5 rounded-xl leading-relaxed w-full ${demoTheme.bioBox}`}>
                  Specializing in sustainable architecture and modern spatial experiences.
                </p>

                {/* Demo Action Buttons */}
                <div className="grid grid-cols-2 gap-2 w-full mt-4">
                  <div className={`py-2.5 px-2 rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 ${demoTheme.actionPrimaryClass}`}>
                    <Download className="w-3.5 h-3.5" />
                    <span>Save Contact</span>
                  </div>
                  <div className={`py-2.5 px-2 rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 ${demoTheme.actionSecondaryClass}`}>
                    <Users className="w-3.5 h-3.5" />
                    <span>Exchange Info</span>
                  </div>
                </div>

                {/* Demo Communication Icons */}
                <div className="flex items-center justify-center gap-2 mt-3 w-full py-2.5 border-y border-slate-200/20">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${demoTheme.contactBtnClass}`}>
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${demoTheme.contactBtnClass}`}>
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${demoTheme.contactBtnClass}`}>
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Demo Links */}
                <div className="w-full mt-3 space-y-1.5 text-left">
                  <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${demoTheme.linkItemClass}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${demoTheme.linkIconBox}`}>
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <span>Portfolio & Case Studies</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                  </div>
                  <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${demoTheme.linkItemClass}`}>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${demoTheme.linkIconBox}`}>
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <span>Book Advisory Session</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-200/20 w-full text-center">
                  <span className={`text-[10px] font-mono ${demoTheme.textMuted}`}>
                    tapcard.in/u/demo-alex
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/signup">
            <Button size="md" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Create Your Digital Card Now
            </Button>
          </Link>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-emerald-50 border border-emerald-200/80">
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-900">
            Ready to upgrade your professional first impression?
          </h2>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
            Create your account today, customize your Linktree-style digital business card, and connect it to physical NFC cards.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/signup">
              <Button size="lg">Create Free Account</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">Sign In to Customer Hub</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
