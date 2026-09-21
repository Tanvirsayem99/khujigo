'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { InlineSpinner } from '@/components/common/LoadingStates';
import { LogIn, Phone, Lock, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginCustomer, isCustomerLoggedIn, isAuthLoading } = useAuth();
  const { t, showToast } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Stored tokens are still being exchanged for a profile.
  if (isAuthLoading) {
    return (
      <main className="max-w-md mx-auto py-24 px-4">
        <InlineSpinner />
      </main>
    );
  }

  // If already logged in
  if (isCustomerLoggedIn) {
    return (
      <main className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-brand-navy mb-2">
            {t({ en: 'You are already logged in!', bn: 'আপনি ইতিমধ্যেই লগইন অবস্থায় আছেন!' })}
          </h1>
          <p className="text-neutral-600 text-sm mb-6">
            {t({
              en: 'You can view your orders, saved addresses, or continue shopping.',
              bn: 'আপনার অর্ডার হিস্ট্রি, অ্যাড্রেস দেখতে বা শপিং চালিয়ে যেতে পারেন।',
            })}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/account"
              className="px-6 py-2.5 bg-brand-orange text-white font-medium rounded-xl hover:bg-brand-orange-hover transition"
            >
              {t({ en: 'My Account', bn: 'আমার অ্যাকাউন্ট' })}
            </Link>
            <Link
              href="/"
              className="px-6 py-2.5 bg-neutral-100 text-neutral-800 font-medium rounded-xl hover:bg-neutral-200 transition"
            >
              {t({ en: 'Go to Shop', bn: 'শপে ফিরে যান' })}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError(t({ en: 'Please fill in all fields', bn: 'সবগুলো তথ্য সঠিকভাবে পূরণ করুন' }));
      return;
    }

    setLoading(true);
    const res = await loginCustomer(identifier, password);
    setLoading(false);

    if (res.success) {
      showToast(t({ en: 'Welcome back!', bn: 'খুঁজিগোতে স্বাগতম!' }), 'success');
      router.push('/account');
    } else {
      setError(res.error || t({ en: 'Invalid credentials', bn: 'ভুল তথ্য দিয়েছেন' }));
    }
  };

  const handleDemoCustomerLogin = async () => {
    setIdentifier('01712345678');
    setPassword('customer123');
    setLoading(true);
    const res = await loginCustomer('01712345678', 'customer123');
    setLoading(false);
    if (res.success) {
      showToast(t({ en: 'Logged in as Demo Customer!', bn: 'ডেমো কাস্টমার হিসাবে লগইন হয়েছে!' }), 'success');
      router.push('/account');
    }
  };

  return (
    <main className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-brand-orange">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-brand-navy">
            {t({ en: 'Login to KhujiGo', bn: 'খুঁজিগোতে লগইন করুন' })}
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            {t({
              en: 'Track your orders and manage your saved addresses',
              bn: 'আপনার অর্ডার ট্র্যাক করুন এবং দ্রুত কেনাকাটা উপভোগ করুন',
            })}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
              {t({ en: 'Phone Number / Email', bn: 'মোবাইল নম্বর অথবা ইমেইল' })}
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="017XXXXXXXX / email@domain.com"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                {t({ en: 'Password', bn: 'পাসওয়ার্ড' })}
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-brand-orange hover:underline"
              >
                {t({ en: 'Forgot password?', bn: 'পাসওয়ার্ড ভুলে গেছেন?' })}
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
          >
            {loading ? t({ en: 'Logging in...', bn: 'লগইন হচ্ছে...' }) : t({ en: 'Login Now', bn: 'লগইন করুন' })}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Fill */}
        <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
          <p className="text-xs text-neutral-500 mb-2.5">
            {t({ en: 'Want to test quickly?', bn: 'টেস্টিং করতে চান?' })}
          </p>
          <button
            type="button"
            onClick={handleDemoCustomerLogin}
            className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-medium rounded-xl transition flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            {t({ en: 'Auto-fill Demo Customer Account', bn: 'ডেমো কাস্টমার অ্যাকাউন্ট দিয়ে সহজে ঢুকুন' })}
          </button>
        </div>

        <p className="text-center text-sm text-neutral-600 mt-6">
          {t({ en: "Don't have an account?", bn: 'কোনো অ্যাকাউন্ট নেই?' })}{' '}
          <Link href="/register" className="text-brand-orange font-semibold hover:underline">
            {t({ en: 'Create an Account', bn: 'নতুন অ্যাকাউন্ট তৈরি করুন' })}
          </Link>
        </p>
      </div>
    </main>
  );
}
