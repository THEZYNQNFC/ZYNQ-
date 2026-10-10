import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { CreditCard, Heart } from 'lucide-react';
import { Navbar } from '../components/navigation/Navbar';
import { useAuth } from '../hooks/useAuth';
import BRAND_CONFIG from '../config/brand';

export const PublicLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="font-bold text-sm tracking-tight text-slate-900">
              {BRAND_CONFIG.name}
            </span>
            <span className="text-xs text-slate-400">
              © {BRAND_CONFIG.copyrightYear}. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500 font-medium">
            <a href="/#product" className="hover:text-slate-900 transition-colors">
              Product
            </a>
            <a href="/#features" className="hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="/#how-it-works" className="hover:text-slate-900 transition-colors">
              How It Works
            </a>
            {isAuthenticated ? (
              <Link to="/dashboard" className="hover:text-slate-900 transition-colors">
                Customer Hub
              </Link>
            ) : (
              <>
                <Link to="/signup" className="hover:text-slate-900 transition-colors">
                  Get Started
                </Link>
                <Link to="/login" className="hover:text-slate-900 transition-colors">
                  Sign In
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Engineered for modern physical-to-digital networking</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </footer>
    </div>
  );
};
