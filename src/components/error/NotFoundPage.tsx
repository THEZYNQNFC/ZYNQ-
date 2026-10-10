import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { Button } from '../common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mb-4 border border-slate-200">
        <Compass className="w-8 h-8 animate-pulse" />
      </div>
      <span className="text-xs font-mono font-bold tracking-widest text-emerald-600 uppercase mb-1">404 Error</span>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-sm mb-6">
        The digital business card, route, or resource you are looking for does not exist or may have been moved.
      </p>
      <Link to="/">
        <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Homepage
        </Button>
      </Link>
    </div>
  );
};
