import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Menu, X, ArrowRight, Sparkles, User } from 'lucide-react';
import BRAND_CONFIG from '../../config/brand';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../common/Button';
import { sanitizeUsername } from '../../services/profileService';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, currentUser, isAuthenticated, isFirebaseConfigured, enableDemoUser } = useAuth();
  const navigate = useNavigate();

  const activeUser = currentUser || user;
  const userSlug = sanitizeUsername(
    activeUser?.username ||
    activeUser?.email?.split('@')[0] ||
    localStorage.getItem('tapcard_last_saved_username') ||
    ''
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      {!isFirebaseConfigured && (
        <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Firebase environment credentials pending. Exploring in Preview mode?</span>
          <button
            onClick={() => {
              enableDemoUser('user');
              navigate('/dashboard');
            }}
            className="text-white underline font-semibold hover:text-amber-300 ml-1 cursor-pointer"
          >
            Launch Customer Dashboard
          </button>
          <span className="text-slate-500">|</span>
          <button
            onClick={() => {
              enableDemoUser('admin');
              navigate('/admin');
            }}
            className="text-white underline font-semibold hover:text-amber-300 cursor-pointer"
          >
            Launch Admin Portal
          </button>
        </div>
      )}

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs group-hover:bg-slate-800 transition-colors">
            <CreditCard className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">
              {BRAND_CONFIG.name}
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 leading-none mt-0.5">
              NFC Digital Identity
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="/#product" className="hover:text-slate-900 transition-colors">
            Product
          </a>
          <a href="/#features" className="hover:text-slate-900 transition-colors">
            Features
          </a>
          <a href="/#how-it-works" className="hover:text-slate-900 transition-colors">
            How It Works
          </a>
          <a href="/#preview" className="hover:text-slate-900 transition-colors flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Live Card Demo
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <Button size="sm" variant="secondary">
                  Customer Hub
                </Button>
              </Link>
              {userSlug ? (
                <Link to={`/u/${userSlug}`}>
                  <Button size="sm" variant="primary">
                    My Live Card
                  </Button>
                </Link>
              ) : (
                <Link to="/dashboard/profile">
                  <Button size="sm" variant="primary">
                    Build Card
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button size="sm" variant="ghost">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
          <a
            href="/#product"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-800"
          >
            Product
          </a>
          <a
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-800"
          >
            Features
          </a>
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-800"
          >
            How It Works
          </a>
          <a
            href="/#preview"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-800 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Live Card Demo
          </a>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <Button fullWidth variant="secondary">
                    Customer Hub
                  </Button>
                </Link>
                {userSlug && (
                  <Link to={`/u/${userSlug}`} onClick={() => setMobileMenuOpen(false)}>
                    <Button fullWidth variant="primary">
                      My Live Card
                    </Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button fullWidth variant="outline">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button fullWidth variant="primary">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
