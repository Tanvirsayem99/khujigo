'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { InlineSpinner } from '@/components/common/LoadingStates';
import { useMyOrders } from '@/lib/hooks/api';
import { formatBDT } from '@/lib/constants';
import { BANGLADESH_DIVISIONS } from '@/lib/bangladesh-data';
import {
  User,
  Package,
  MapPin,
  LogOut,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import OrderStatusBadge from '@/components/storefront/OrderStatusBadge';

export default function AccountPage() {
  const router = useRouter();
  const { customer, isCustomerLoggedIn, isAuthLoading, logoutCustomer, updateCustomerProfile } = useAuth();
  const { t, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'address'>('orders');

  // Profile edit state. `null` means "untouched", so each input shows the
  // server value without needing an effect to copy it in.
  const [name, setName] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [division, setDivision] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { orders: customerOrders, isLoading: ordersLoading } = useMyOrders({
    enabled: isCustomerLoggedIn,
  });

  const nameValue = name ?? customer?.name ?? '';
  const phoneValue = phone ?? customer?.phone ?? '';
  const emailValue = email ?? customer?.email ?? '';
  const addressValue = address ?? customer?.address ?? '';
  const divisionValue = division ?? customer?.division ?? 'dhaka';
  const districtValue = district ?? customer?.district ?? 'dhaka-city';

  // Stored tokens are still being exchanged for a profile.
  if (isAuthLoading) {
    return (
      <main className="max-w-md mx-auto py-24 px-4">
        <InlineSpinner />
      </main>
    );
  }

  // If not logged in
  if (!isCustomerLoggedIn || !customer) {
    return (
      <main className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
          <div className="w-16 h-16 bg-orange-50 text-brand-orange rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-brand-navy mb-2">
            {t({ en: 'Please Log In', bn: 'অনুগ্রহ করে লগইন করুন' })}
          </h1>
          <p className="text-neutral-600 text-sm mb-6">
            {t({
              en: 'Log in to view your orders, saved addresses, and profile details.',
              bn: 'আপনার অর্ডার হিস্ট্রি, অ্যাড্রেস ও প্রোফাইল দেখতে অ্যাকাউন্টে লগইন করুন।',
            })}
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full py-3 bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold rounded-xl transition"
            >
              {t({ en: 'Login to Account', bn: 'লগইন করুন' })}
            </Link>
            <Link
              href="/register"
              className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium rounded-xl transition"
            >
              {t({ en: 'Create New Account', bn: 'নতুন অ্যাকাউন্ট তৈরি করুন' })}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const result = await updateCustomerProfile({
      name: nameValue,
      phone: phoneValue,
      email: emailValue,
      address: addressValue,
      division: divisionValue,
      district: districtValue,
    });
    setIsSaving(false);
    showToast(
      result.success
        ? t({ en: 'Profile updated successfully!', bn: 'প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!' })
        : result.error ?? t({ en: 'Could not update profile', bn: 'প্রোফাইল আপডেট করা যায়নি' }),
      result.success ? 'success' : 'error'
    );
  };

  const currentDivision = BANGLADESH_DIVISIONS.find((d) => d.id === divisionValue);

  return (
    <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* User Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-orange-light text-white flex items-center justify-center font-bold text-2xl shadow-sm">
            {customer.name ? customer.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-brand-navy flex items-center gap-2">
              {customer.name}
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </h1>
            <p className="text-xs text-neutral-500 flex items-center gap-2 mt-0.5">
              <span>{customer.phone}</span>
              <span>•</span>
              <span>{customer.email}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            void logoutCustomer();
            showToast(t({ en: 'Logged out successfully', bn: 'লগআউট সফল হয়েছে' }), 'info');
            router.push('/');
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-neutral-200 text-neutral-700 text-xs font-medium rounded-xl hover:bg-neutral-50 transition w-full md:w-auto"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          {t({ en: 'Sign Out', bn: 'লগআউট' })}
        </button>
      </div>

      {/* Grid Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <aside className="md:col-span-1 space-y-1.5">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-medium transition ${
              activeTab === 'orders'
                ? 'bg-brand-orange text-white shadow-sm'
                : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>{t({ en: 'My Orders', bn: 'আমার অর্ডার সমূহ' })}</span>
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {customerOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-medium transition ${
              activeTab === 'profile'
                ? 'bg-brand-orange text-white shadow-sm'
                : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4" />
              <span>{t({ en: 'Profile Details', bn: 'প্রোফাইল তথ্য' })}</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>

          <button
            onClick={() => setActiveTab('address')}
            className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-sm font-medium transition ${
              activeTab === 'address'
                ? 'bg-brand-orange text-white shadow-sm'
                : 'bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4" />
              <span>{t({ en: 'Shipping Address', bn: 'ডেলিভারি ঠিকানা' })}</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </button>
        </aside>

        {/* Tab Content */}
        <section className="md:col-span-3">
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
                <h2 className="text-lg font-bold text-brand-navy mb-4">
                  {t({ en: 'Order History', bn: 'অর্ডার হিস্ট্রি' })}
                </h2>

                {ordersLoading ? (
                  <InlineSpinner />
                ) : customerOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-500 text-sm mb-4">
                      {t({ en: 'You have not placed any orders yet.', bn: 'আপনার কোনো পূর্ববর্তী অর্ডার নেই।' })}
                    </p>
                    <Link
                      href="/shop"
                      className="inline-flex px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-xl transition"
                    >
                      {t({ en: 'Explore Trending Products', bn: 'ট্রেন্ডিং প্রোডাক্ট দেখুন' })}
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customerOrders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-neutral-200 rounded-2xl p-5 hover:border-brand-orange/40 transition"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-100 mb-4">
                          <div>
                            <span className="text-xs text-neutral-500">{t({ en: 'Order ID: ', bn: 'অর্ডার নং: ' })}</span>
                            <Link
                              href={`/account/orders/${order.id}`}
                              className="text-xs font-bold text-brand-navy hover:text-brand-orange transition"
                            >
                              {order.id}
                            </Link>
                            <span className="mx-2 text-neutral-300">•</span>
                            <span className="text-xs text-neutral-500">
                              {new Date(order.created_at).toLocaleDateString('bn-BD', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <OrderStatusBadge status={order.order_status} />
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3 mb-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-100 shrink-0">
                                <Image
                                  src={item.thumbnail_url}
                                  alt={item.name_en}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-semibold text-brand-navy truncate">
                                  {t({ en: item.name_en, bn: item.name_bn })}
                                </h4>
                                <p className="text-[11px] text-neutral-500">
                                  {item.quantity} x {formatBDT(item.price)}
                                </p>
                              </div>
                              <span className="text-xs font-bold text-brand-orange">
                                {formatBDT(item.total)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
                          <span className="text-xs text-neutral-600">
                            {t({ en: 'Payment Method: ', bn: 'পেমেন্ট মাধ্যম: ' })}
                            <strong className="text-brand-navy">{order.payment_method}</strong>
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-brand-navy">
                              {t({ en: 'Total: ', bn: 'সর্বমোট: ' })}
                              <span className="text-brand-orange">{formatBDT(order.total_amount)}</span>
                            </span>
                            <Link
                              href={`/account/orders/${order.id}`}
                              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold transition"
                            >
                              {t({ en: 'Track Order', bn: 'অর্ডার ট্র্যাক' })}
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
              <h2 className="text-lg font-bold text-brand-navy mb-4">
                {t({ en: 'Personal Information', bn: 'ব্যক্তিগত তথ্য' })}
              </h2>
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase">
                    {t({ en: 'Full Name', bn: 'পূর্ণ নাম' })}
                  </label>
                  <input
                    type="text"
                    value={nameValue}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase">
                    {t({ en: 'Mobile Number', bn: 'মোবাইল নম্বর' })}
                  </label>
                  <input
                    type="tel"
                    value={phoneValue}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase">
                    {t({ en: 'Email Address', bn: 'ইমেইল অ্যাড্রেস' })}
                  </label>
                  <input
                    type="email"
                    value={emailValue}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-xl transition"
                >
                  {isSaving ? t({ en: 'Saving...', bn: 'সংরক্ষণ হচ্ছে...' }) : t({ en: 'Update Details', bn: 'তথ্য সংরক্ষণ করুন' })}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'address' && (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
              <h2 className="text-lg font-bold text-brand-navy mb-4">
                {t({ en: 'Shipping Address', bn: 'ডেলিভারি ঠিকানা' })}
              </h2>
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase">
                      {t({ en: 'Division', bn: 'বিভাগ' })}
                    </label>
                    <select
                      value={divisionValue}
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
                    <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase">
                      {t({ en: 'District', bn: 'জেলা' })}
                    </label>
                    <select
                      value={districtValue}
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
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5 uppercase">
                    {t({ en: 'Full Street / House Address', bn: 'বাসা / রোড / বিস্তারিত ঠিকানা' })}
                  </label>
                  <textarea
                    rows={3}
                    value={addressValue}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House #..., Road #..., Area..."
                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-brand-orange"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-semibold rounded-xl transition"
                >
                  {isSaving ? t({ en: 'Saving...', bn: 'সংরক্ষণ হচ্ছে...' }) : t({ en: 'Save Address', bn: 'ঠিকানা সংরক্ষণ করুন' })}
                </button>
              </form>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
