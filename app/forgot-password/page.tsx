'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { KeyRound, Phone, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { t, showToast } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;
    setSubmitted(true);
    showToast(t({ en: 'Verification OTP sent to your phone/email', bn: 'ভেরিফিকেশন ওটিপি আপনার নম্বরে পাঠানো হয়েছে' }), 'success');
  };

  return (
    <main className="max-w-md mx-auto py-16 px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-100 text-center">
        <div className="w-12 h-12 bg-amber-50 text-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-3">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-brand-navy mb-1">
          {t({ en: 'Reset Password', bn: 'পাসওয়ার্ড রিসেট করুন' })}
        </h1>
        <p className="text-xs text-neutral-500 mb-6">
          {t({
            en: 'Enter your registered mobile number or email to receive recovery instructions',
            bn: 'আপনার নিবন্ধিত মোবাইল নম্বর বা ইমেইল দিলে আমরা ওটিপি কোড পাঠাব',
          })}
        </p>

        {submitted ? (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="font-semibold mb-1">
              {t({ en: 'Recovery instructions sent!', bn: 'পাসওয়ার্ড পুনরুদ্ধারের কোড পাঠানো হয়েছে!' })}
            </p>
            <p className="text-xs text-emerald-700">
              {t({
                en: 'Check your SMS or inbox for the 6-digit OTP to reset your password.',
                bn: 'আপনার ফোনে পাঠানো ৬ সংখ্যার ওটিপি কোড দিয়ে নতুন পাসওয়ার্ড সেট করুন।',
              })}
            </p>
            <Link
              href="/login"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 hover:underline"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t({ en: 'Return to Login', bn: 'লগইন পেজে ফিরে যান' })}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase">
                {t({ en: 'Mobile Number or Email', bn: 'মোবাইল নম্বর অথবা ইমেইল' })}
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="017XXXXXXXX / email@domain.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
            >
              <span>{t({ en: 'Send Recovery Code', bn: 'ওটিপি কোড পাঠান' })}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <Link href="/login" className="text-xs text-neutral-500 hover:text-brand-navy">
                ← {t({ en: 'Back to Login', bn: 'লগইনে ফিরে যান' })}
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
