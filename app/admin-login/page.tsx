'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { InlineSpinner } from '@/components/common/LoadingStates';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import Logo from '@/components/common/Logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginAdmin, isAdminLoggedIn, isAuthLoading, adminUser } = useAuth();
  const { showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Stored tokens are still being exchanged for a profile.
  if (isAuthLoading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <InlineSpinner />
      </main>
    );
  }

  if (isAdminLoggedIn && adminUser) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center text-white">
          <ShieldCheck className="w-14 h-14 text-emerald-400 mx-auto mb-3" />
          <h1 className="text-xl font-bold mb-1">Already Authenticated</h1>
          <p className="text-sm text-slate-300 mb-6">
            Logged in as <span className="text-amber-400 font-semibold">{adminUser.name}</span> ({adminUser.role})
          </p>
          <button
            onClick={() => router.push('/admin')}
            className="w-full py-3 bg-brand-orange hover:bg-brand-orange-hover text-white font-medium rounded-xl transition"
          >
            Go to Admin Dashboard
          </button>
        </div>
      </main>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }

    setLoading(true);
    const res = await loginAdmin(email, password);
    setLoading(false);

    if (res.success) {
      showToast('Welcome to KhujiGo Admin Control Center', 'success');
      router.push('/admin');
    } else {
      setError(res.error || 'Authentication failed');
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="px-4 sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-block p-3 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl mb-3">
          <Logo />
        </div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
          Admin Control Center
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          KhujiGo E-Commerce Enterprise Operations & Catalog Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10 text-white">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-950/80 border border-rose-800 text-rose-200 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Admin Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Master Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50 transition disabled:opacity-50 mt-4"
            >
              {loading ? 'Authenticating...' : 'Sign In to Admin Portal'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
