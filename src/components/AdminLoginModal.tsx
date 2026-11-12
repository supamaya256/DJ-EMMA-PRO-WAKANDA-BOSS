import React, { useState } from 'react';
import { ShieldCheck, X, Lock, KeyRound, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'pin' | 'supabase'>('pin');
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState('supamaya256@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();

      if (data.success && data.token) {
        onLoginSuccess(data.token);
        onClose();
        setPin('');
      } else {
        setError(data.message || 'Invalid Admin PIN');
      }
    } catch (err: any) {
      setError('Connection error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSupabaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.session) {
        sessionStorage.setItem('dj_emma_supabase_token', data.session.access_token);
        onLoginSuccess(data.session.access_token);
        onClose();
        setPassword('');
      } else {
        setError('Login failed. Please check credentials.');
      }
    } catch (err: any) {
      setError('Supabase auth error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl glass-nav-bar p-6 sm:p-8 text-white shadow-2xl border border-white/30 space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center mx-auto shadow-lg">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-black chrome-text font-display uppercase tracking-wider">
            DJ EMMA PRO ADMIN
          </h3>

          <p className="text-xs text-slate-300">
            Sign in to access your master DJ control dashboard.
          </p>
        </div>

        {/* Method Selector Tabs */}
        <div className="flex rounded-full bg-white/10 p-1 text-xs font-bold border border-white/10">
          <button
            type="button"
            onClick={() => { setAuthMode('pin'); setError(''); }}
            className={`flex-1 py-1.5 rounded-full transition ${
              authMode === 'pin'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Master PIN (2560)
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('supabase'); setError(''); }}
            className={`flex-1 py-1.5 rounded-full transition ${
              authMode === 'supabase'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Supabase Account
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs text-center font-semibold">
            {error}
          </div>
        )}

        {/* PIN Form */}
        {authMode === 'pin' && (
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN (Default: 2560)"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-white/20 text-white text-center text-sm tracking-widest focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-extrabold text-xs uppercase tracking-widest shadow-lg hover:scale-102 active:scale-98 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'VERIFYING...' : 'UNLOCK DASHBOARD'}</span>
            </button>
          </form>
        )}

        {/* Supabase Email/Password Form */}
        {authMode === 'supabase' && (
          <form onSubmit={handleSupabaseSubmit} className="space-y-3">
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin Email"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Supabase Password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-extrabold text-xs uppercase tracking-widest shadow-lg hover:scale-102 active:scale-98 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'AUTHENTICATING...' : 'SIGN IN WITH SUPABASE'}</span>
            </button>
          </form>
        )}

        <div className="text-center">
          <span className="text-[11px] text-slate-400 font-mono">
            Master PIN: <span className="text-amber-300 font-bold">2560</span> • Email: <span className="text-amber-300">supamaya256@gmail.com</span>
          </span>
        </div>
      </div>
    </div>
  );
};
