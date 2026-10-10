import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useToast } from '../../hooks/useToast';
import { Spinner } from '../../components/common/Spinner';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const { user, login, loginWithGoogle, isFirebaseConfigured, enableDemoUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // Preserve intended destination if user was redirected from a protected route
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/dashboard';

  // Automatically redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isGoogleSubmitting) return; // Prevent duplicate submissions

    setFormError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setFormError('Please enter your email address.');
      return;
    }

    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(trimmedEmail, password);
      toast.success('Successfully signed in.');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Invalid login credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isSubmitting || isGoogleSubmitting) return; // Prevent duplicate submissions

    setFormError('');
    setIsGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      toast.success('Signed in with Google.');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Google sign-in was cancelled or failed.');
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const handleDemoSignIn = (role: 'user' | 'admin') => {
    enableDemoUser(role);
    toast.info(`Entered preview mode as ${role}.`);
    navigate(role === 'admin' ? '/admin' : '/dashboard', { replace: true });
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back.</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
          Sign in to manage your TapCard profile.
        </p>
      </div>

      {formError && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <span className="leading-relaxed">{formError}</span>
        </div>
      )}

      {!isFirebaseConfigured && (
        <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs space-y-2">
          <p className="font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Local Development / Demo Mode
          </p>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Firebase credentials are not yet supplied in <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">.env</code>. You can test authentication and routing immediately below:
          </p>
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => handleDemoSignIn('user')}
              className="bg-white text-xs border-amber-300 hover:bg-amber-100"
            >
              Sign in as User
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => handleDemoSignIn('admin')}
              className="bg-white text-xs border-amber-300 hover:bg-amber-100"
            >
              Sign in as Admin
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          leftIcon={<Mail className="w-4 h-4" />}
          disabled={isSubmitting || isGoogleSubmitting}
          required
        />

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            disabled={isSubmitting || isGoogleSubmitting}
            required
          />
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={isSubmitting || isGoogleSubmitting}
          isLoading={isSubmitting}
          rightIcon={!isSubmitting ? <ArrowRight className="w-4 h-4" /> : undefined}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-5 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-400">Or continue with</span>
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting || isGoogleSubmitting}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isGoogleSubmitting ? (
            <>
              <Spinner size="sm" className="text-slate-700" />
              <span>Connecting to Google...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>
      </div>

      <div className="mt-6 text-center text-xs text-slate-500">
        Don't have an account yet?{' '}
        <Link to="/signup" className="font-semibold text-emerald-600 hover:text-emerald-700">
          Create an account
        </Link>
      </div>
    </div>
  );
};
