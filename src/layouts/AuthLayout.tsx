import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { CreditCard, ShieldCheck } from 'lucide-react';
import BRAND_CONFIG from '../config/brand';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-emerald-500 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <CreditCard className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">
            {BRAND_CONFIG.name}
          </span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/90 rounded-2xl sm:px-10">
          <Outlet />
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Encrypted with 256-bit SSL & Zero-Trust Cloud Architecture</span>
        </div>
      </div>
    </div>
  );
};
