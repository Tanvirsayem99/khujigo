'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { InlineSpinner } from '@/components/common/LoadingStates';
import { UserPlus, User, Phone, Mail, Lock, MapPin, ArrowRight } from 'lucide-react';
import { BANGLADESH_DIVISIONS } from '@/lib/bangladesh-data';

export default function RegisterPage() {
  const router = useRouter();
  const { registerCustomer, isCustomerLoggedIn, isAuthLoading } = useAuth();
  const { t, showToast } = useApp();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [division, setDivision] = useState('dhaka');
  const [district, setDistrict] = useState('dhaka-city');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect once the stored session has been restored.
  useEffect(() => {
    if (!isAuthLoading && isCustomerLoggedIn) {
      router.push('/account');
    }
  }, [isAuthLoading, isCustomerLoggedIn, router]);

  if (isAuthLoading || isCustomerLoggedIn) {
    return (
      <main className="max-w-md mx-auto py-24 px-4">
        <InlineSpinner
          label={t({
            en: 'Taking you to your account...',
            bn: 'আপনার অ্যাকাউন্টে নিয়ে যাচ্ছি...',
          })}
        />
      </main>
    );
  }

  const currentDivision = BANGLADESH_DIVISIONS.find((d) => d.id === division);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !phone || !password) {
      setError(t({ en: 'Please fill in name, phone and password', bn: 'নাম, মোবাইল নম্বর ও পাসওয়ার্ড অবশ্যই পূরণ করুন' }));
      return;
    }

    if (phone.length < 11) {
      setError(t({ en: 'Please enter a valid 11-digit phone number', bn: 'সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন (যেমন: 01712345678)' }));
      return;
    }

    if (password.length < 6) {
      setError(t({ en: 'Password must be at least 6 characters', bn: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' }));
      return;
    }

    setLoading(true);
    const fullAddress = address ? `${address}, ${district}, ${division}` : '';
    const res = await registerCustomer({
      name,
      phone,
      email: email || `${phone}@khujigo.customer`,
      password,
      address: fullAddress,
      // Persist these so checkout pre-fills the right delivery zone.
      division,
      district,
    });
    setLoading(false);

    if (res.success) {
      showToast(t({ en: 'Registration successful! Welcome.', bn: 'অ্যাকাউন্ট তৈরি সফল হয়েছে! স্বাগতম।' }), 'success');
      router.push('/account');
    } else {
      setError(res.error || t({ en: 'Registration failed', bn: 'রেজিস্ট্রেশন ব্যর্থ হয়েছে' }));
    }
  };

  return (
    <main className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-neutral-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-brand-orange">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-brand-navy">
            {t({ en: 'Create New Account', bn: 'নতুন অ্যাকাউন্ট তৈরি করুন' })}
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            {t({
              en: 'Join KhujiGo for fastest checkout and order tracking',
              bn: 'দ্রুত অর্ডার ও ডেলিভারি ট্র্যাকিং পেতে যুক্ত থাকুন',
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
              {t({ en: 'Full Name *', bn: 'আপনার পুরো নাম *' })}
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: তানভীর আহমেদ"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
              {t({ en: 'Mobile Number *', bn: 'মোবাইল নম্বর *' })}
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
              {t({ en: 'Email (Optional)', bn: 'ইমেইল অ্যাড্রেস (ঐচ্ছিক)' })}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
              {t({ en: 'Password *', bn: 'পাসওয়ার্ড *' })}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="কমপক্ষে ৬ অক্ষর"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:bg-white transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
                {t({ en: 'Division', bn: 'বিভাগ' })}
              </label>
              <select
                value={division}
                onChange={(e) => {
                  setDivision(e.target.value);
                  const div = BANGLADESH_DIVISIONS.find((d) => d.id === e.target.value);
                  if (div && div.districts.length > 0) {
                    setDistrict(div.districts[0].id);
                  }
                }}
                className="w-full py-2.5 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-orange"
              >
                {BANGLADESH_DIVISIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {t({ en: d.name_en, bn: d.name_bn })}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
                {t({ en: 'District', bn: 'জেলা' })}
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full py-2.5 px-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-orange"
              >
                {currentDivision?.districts.map((dst) => (
                  <option key={dst.id} value={dst.id}>
                    {t({ en: dst.name_en, bn: dst.name_bn })}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase tracking-wider">
              {t({ en: 'Delivery Address', bn: 'সম্পূর্ণ ডেলিভারি ঠিকানা' })}
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="বাসা/রোড/এলাকা..."
                className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
          >
            {loading ? t({ en: 'Registering...', bn: 'অ্যাকাউন্ট তৈরি হচ্ছে...' }) : t({ en: 'Create Account', bn: 'রেজিস্ট্রেশন সম্পন্ন করুন' })}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-sm text-neutral-600 mt-6">
          {t({ en: 'Already have an account?', bn: 'ইতিমধ্যে অ্যাকাউন্ট আছে?' })}{' '}
          <Link href="/login" className="text-brand-orange font-semibold hover:underline">
            {t({ en: 'Login here', bn: 'এখানে লগইন করুন' })}
          </Link>
        </p>
      </div>
    </main>
  );
}
