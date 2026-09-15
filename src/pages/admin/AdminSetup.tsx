import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import supabase from '../../lib/supabase';
import { Lock, Mail, CheckCircle2, AlertCircle, Loader2, ArrowRight, KeyRound } from 'lucide-react';

export const AdminSetup: React.FC = () => {
  const navigate = useNavigate();

  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [passwordCreated, setPasswordCreated] = useState(false);

  // Check for recovery session from URL hash if user clicked email link
  useEffect(() => {
    const handleUrlHash = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.replace('#', '?'));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken && refreshToken) {
          const { data } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (data.session?.user?.email) {
            setEmailInput(data.session.user.email);
          }
        }
      }
    };

    handleUrlHash();
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (password.length < 8) {
      setStatusMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    if (password !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Passwords do not match. Please re-enter.' });
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const recoveryEmail = session?.user?.email?.trim().toLowerCase();

      if (!session || recoveryEmail !== emailInput.trim().toLowerCase()) {
        throw new Error('Open the secure setup link sent to the administrator email before creating a password.');
      }

      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      await supabase.auth.signOut();
      setPasswordCreated(true);
      setStatusMessage({
        type: 'success',
        text: 'Your administrator password has been securely created. You can now sign in.',
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to set password. Please request a new setup link.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendSetupLink = async () => {
    if (!emailInput.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter your administrator email to receive a setup link.',
      });
      return;
    }

    setEmailLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_link',
          email: emailInput.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send setup email.');
      }

      setStatusMessage({
        type: 'info',
        text: 'Setup invitation sent! If this email belongs to an authorized account, check your inbox to confirm, then set your password.',
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'Error requesting setup link. Please try again.',
      });
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-lg mx-auto mb-4">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Administrator Setup
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create your private administrator password
          </p>
        </div>

        {statusMessage && (
          <div className={`p-3.5 rounded-xl flex items-start gap-2.5 text-xs ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-200'
              : statusMessage.type === 'error'
              ? 'bg-red-950/60 border border-red-800 text-red-200'
              : 'bg-blue-950/60 border border-blue-800 text-blue-200'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            ) : statusMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            ) : (
              <Mail className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
            )}
            <span className="leading-relaxed">{statusMessage.text}</span>
          </div>
        )}

        {passwordCreated ? (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-emerald-900/30 border border-emerald-700/50 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">Password Created Successfully!</h3>
              <p className="text-xs text-slate-300">
                You can now visit <code>/admin/login</code>, enter your email and your password to access the admin dashboard.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/admin/login')}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition flex items-center justify-center gap-2"
            >
              <span>Go to Admin Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Password creation form */
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Administrator Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600/40 focus:border-red-600 placeholder:text-slate-600"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Choose Password (Min 8 Characters)
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600/40 focus:border-red-600 placeholder:text-slate-600"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600/40 focus:border-red-600 placeholder:text-slate-600"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Configuring Password...</span>
                </>
              ) : (
                <>
                  <span>Create Password &amp; Activate</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Email link alternative */}
            <div className="pt-2 text-center">
              <button
                type="button"
                disabled={emailLoading}
                onClick={handleSendSetupLink}
                className="text-[11px] text-slate-400 hover:text-white transition inline-flex items-center gap-1.5"
              >
                {emailLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
                <span>Or email me a password setup link</span>
              </button>
            </div>
          </form>
        )}

        <div className="pt-3 text-center border-t border-slate-800 flex items-center justify-between text-xs">
          <Link to="/admin/login" className="text-slate-400 hover:text-white transition">
            ← Back to Admin Login
          </Link>
          <Link to="/" className="text-slate-500 hover:text-slate-300 transition">
            Public Website
          </Link>
        </div>

      </div>
    </div>
  );
};
