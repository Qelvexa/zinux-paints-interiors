import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);

  const { signIn, isAdmin, user } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && isAdmin) {
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [user, isAdmin, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    const result = await signIn(email.trim(), password);
    setLoading(false);

    if (result.success) {
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError('Please enter your email address to receive a password reset link.');
      return;
    }

    setSendingReset(true);
    setError('');
    setInfoMessage('');

    try {
      const res = await fetch('/api/admin-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_link',
          email: email.trim(),
          redirectOrigin: window.location.origin,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch reset email.');
      }

      setInfoMessage(
        'If this email belongs to an authorized administrator account, a password setup link has been sent. Please check your inbox.'
      );
    } catch (err: any) {
      setError(err.message || 'Error sending password reset link.');
    } finally {
      setSendingReset(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background radial glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        
        {/* Top brand emblem and headers */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Administrator Access
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Zinux Paints &amp; Interior Management Portal
          </p>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Sign in to continue
          </p>
        </div>

        {infoMessage && (
          <div className="p-3.5 bg-emerald-950/60 border border-emerald-800 rounded-xl flex items-start gap-2.5 text-emerald-200 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <span className="leading-relaxed">{infoMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 bg-red-950/60 border border-red-800/80 rounded-xl flex items-center gap-2.5 text-red-200 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600/40 focus:border-red-600 placeholder:text-slate-600"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={sendingReset}
                className="text-[11px] text-red-400 hover:text-red-300 transition"
              >
                {sendingReset ? 'Sending link...' : 'Forgot password?'}
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600/40 focus:border-red-600 placeholder:text-slate-600"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center border-t border-slate-800">
          <Link
            to="/"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            ← Return to Public Website
          </Link>
        </div>

      </div>
    </div>
  );
};
