'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShoppingBag,
  Tag,
  AlertCircle,
  Smartphone,
  Banknote,
  Check,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { ApiError } from '@/lib/api/client';
import { createOrder, validateCoupon } from '@/lib/api/endpoints';
import type { CouponRejectionReason } from '@/lib/api/types';
import { couponErrorMessage } from '@/lib/coupon-messages';
import { revalidateCatalog, useDeliverySettings } from '@/lib/hooks/api';
import { BANGLADESH_DIVISIONS, formatPriceBD, toBanglaNumber } from '@/lib/bangladesh-data';
import { trackInitiateCheckout, trackPurchase } from '@/lib/analytics/facebook-pixel';
import { PaymentMethod } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { language, cart, cartTotal, clearCart, showToast } = useApp();
  const { customer } = useAuth();
  const { settings: deliverySettings } = useDeliverySettings();

  // Shipping form fields initialized from logged-in customer if available
  const [fullName, setFullName] = useState(() => customer?.name || '');
  const [phone, setPhone] = useState(() => customer?.phone || '');
  const [altPhone, setAltPhone] = useState('');
  const [email, setEmail] = useState(() => customer?.email || '');
  const [division, setDivision] = useState(() => customer?.division || 'dhaka');
  const [district, setDistrict] = useState(() => customer?.district || 'dhaka-city');
  const [address, setAddress] = useState(() => customer?.address || '');
  const [notes, setNotes] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [transactionId, setTransactionId] = useState('');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preview only — the API recomputes delivery and totals authoritatively, and
  // decides inside/outside Dhaka from the DIVISION (not the district), so this
  // must use the same rule or the preview will disagree with the receipt.
  const freeDeliveryThreshold = deliverySettings?.freeDeliveryThreshold ?? 2500;
  const isDhakaZone = division === 'dhaka';
  const deliveryCharge =
    cartTotal >= freeDeliveryThreshold
      ? 0
      : isDhakaZone
      ? deliverySettings?.insideDhaka ?? 60
      : deliverySettings?.outsideDhaka ?? 120;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, cartTotal - discountAmount + deliveryCharge);

  // Once per visit to the checkout step, not per render.
  const checkoutTracked = useRef(false);

  useEffect(() => {
    if (checkoutTracked.current || cart.length === 0) return;
    checkoutTracked.current = true;
    trackInitiateCheckout(cart);
  }, [cart]);

  // Districts for current division
  const currentDivisionObj = BANGLADESH_DIVISIONS.find((d) => d.id === division);
  const availableDistricts = currentDivisionObj ? currentDivisionObj.districts : [];

  const handleDivisionChange = (newDiv: string) => {
    setDivision(newDiv);
    const divObj = BANGLADESH_DIVISIONS.find((d) => d.id === newDiv);
    if (divObj && divObj.districts.length > 0) {
      setDistrict(divObj.districts[0].id);
    }
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    try {
      const result = await validateCoupon(couponCode.trim(), cartTotal);

      if (result.valid && result.coupon) {
        setAppliedCoupon({
          code: result.coupon.code,
          discount: result.discount ?? 0,
        });
        showToast(
          language === 'bn' ? 'কুপন সফলভাবে প্রয়োগ হয়েছে!' : 'Coupon applied successfully!',
          'success'
        );
      } else {
        showToast(
          couponErrorMessage({
            reason: result.reason,
            minOrderAmount: result.minOrderAmount,
            language,
          }),
          'error'
        );
      }
    } catch {
      showToast(
        language === 'bn'
          ? 'কুপন যাচাই করা যায়নি। আবার চেষ্টা করুন।'
          : 'Could not verify the coupon. Please try again.',
        'error'
      );
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!cart || cart.length === 0) {
      showToast(
        language === 'bn' ? 'আপনার কার্টে কোনো পণ্য নেই' : 'Your cart is empty',
        'error'
      );
      router.push('/shop');
      return;
    }

    if (!fullName.trim() || !phone.trim() || !address.trim()) {
      showToast(
        language === 'bn' ? 'অনুগ্রহ করে সকল প্রয়োজনীয় তথ্য পূরণ করুন' : 'Please fill all required fields',
        'error'
      );
      return;
    }

    // Validate BD phone format loosely (starts with 01 and has 11 digits)
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length !== 11 || !cleanPhone.startsWith('01')) {
      showToast(
        language === 'bn' ? 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)' : 'Please provide a valid 11-digit Bangladeshi mobile number',
        'error'
      );
      return;
    }

    if ((paymentMethod === 'BKASH' || paymentMethod === 'NAGAD') && !transactionId.trim()) {
      showToast(
        language === 'bn' ? 'অনুগ্রহ করে বিকাশ/নগদ ট্রানজেকশন আইডি (TrxID) প্রদান করুন' : 'Please provide your Transaction ID',
        'error'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Find district name for human-readable address
      const distObj = availableDistricts.find((d) => d.id === district);
      const districtName = distObj ? distObj.name_bn : district;
      const divisionName = currentDivisionObj ? currentDivisionObj.name_bn : division;

      // Only identifiers and quantities are sent — the API prices everything.
      const order = await createOrder({
        customerName: fullName.trim(),
        customerPhone: cleanPhone,
        customerEmail: email.trim() || undefined,
        division: divisionName,
        district: districtName,
        area: districtName,
        fullAddress: address.trim(),
        deliveryNotes: notes.trim() || undefined,
        paymentMethod,
        couponCode: appliedCoupon?.code,
        paymentReference: transactionId.trim() || undefined,
        items: cart.map((item) => ({
          productId: item.product_id,
          quantity: item.quantity,
        })),
      });

      trackPurchase(order);
      clearCart();
      revalidateCatalog();

      showToast(
        language === 'bn' ? 'অর্ডার সফলভাবে গৃহীত হয়েছে!' : 'Order placed successfully!',
        'success'
      );

      router.push(`/order-success/${order.id}`);
    } catch (error) {
      setIsSubmitting(false);

      if (error instanceof ApiError) {
        const body = error.body as
          | { reason?: CouponRejectionReason; minOrderAmount?: number }
          | undefined;

        if (body?.reason) {
          showToast(
            couponErrorMessage({
              reason: body.reason,
              minOrderAmount: body.minOrderAmount,
              language,
            }),
            'error'
          );
          return;
        }

        if (error.status === 409) {
          showToast(
            language === 'bn'
              ? 'দুঃখিত, পণ্যটির স্টক শেষ হয়ে গেছে। পরিমাণ কমিয়ে আবার চেষ্টা করুন।'
              : 'Sorry, that item just went out of stock. Please adjust the quantity.',
            'error'
          );
          return;
        }

        if (error.status === 401) {
          showToast(
            language === 'bn'
              ? 'আপনার সেশনের মেয়াদ শেষ হয়েছে। আবার লগইন করুন।'
              : 'Your session expired. Please log in again.',
            'error'
          );
          return;
        }
      }

      showToast(
        language === 'bn' ? 'অর্ডার করতে সমস্যা হয়েছে, আবার চেষ্টা করুন' : 'Failed to place order. Please try again.',
        'error'
      );
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto" />
        <h2 className="text-2xl font-black text-brand-navy">
          {language === 'bn' ? 'আপনার কার্টে কোনো পণ্য নেই' : 'No items to checkout'}
        </h2>
        <p className="text-xs text-gray-500">
          {language === 'bn' ? 'চেকআউট করার পূর্বে কার্টে পণ্য যোগ করুন।' : 'Please add items to your cart first.'}
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold"
        >
          {language === 'bn' ? 'শপে যান' : 'Go to Shop'}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            {language === 'bn' ? 'অর্ডার চেকআউট' : 'Order Checkout'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {language === 'bn'
              ? 'নিরাপদ ও দ্রুত চেকআউট — ক্যাশ অন ডেলিভারিতে সারাদেশে ডেলিভারি'
              : 'Secure & Fast Checkout — Cash on delivery available in all districts'}
          </p>
        </div>

        <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <Lock className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? '২৫৬-বিট নিরাপদ পেমেন্ট' : '256-Bit SSL Secure'}</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Shipping & Payment Information */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Customer & Delivery Address */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-100 shadow-xs space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <span className="w-6 h-6 rounded-full bg-brand-orange text-white text-xs font-black flex items-center justify-center">
                  ১
                </span>
                <h2 className="text-base font-black text-brand-navy">
                  {language === 'bn' ? 'ডেলিভারি ও যোগাযোগের তথ্য' : 'Shipping & Contact Details'}
                </h2>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {language === 'bn' ? 'আপনার পূর্ণ নাম' : 'Full Name'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'bn' ? 'উদাঃ তানভীর হাসান' : 'e.g. Tanvir Hasan'}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-brand-orange outline-hidden"
                  />
                </div>

                {/* Phone Numbers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:border-brand-orange outline-hidden"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      {language === 'bn' ? 'ডেলিভারি রাইডার এই নম্বরে কল করবেন' : 'Rider will call this number'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {language === 'bn' ? 'বিকল্প নম্বর (ঐচ্ছিক)' : 'Alternative Phone (Optional)'}
                    </label>
                    <input
                      type="tel"
                      value={altPhone}
                      onChange={(e) => setAltPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-mono focus:bg-white focus:border-brand-orange outline-hidden"
                    />
                  </div>
                </div>

                {/* Division & District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {language === 'bn' ? 'বিভাগ' : 'Division'} <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={division}
                      onChange={(e) => handleDivisionChange(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-brand-orange outline-hidden cursor-pointer"
                    >
                      {BANGLADESH_DIVISIONS.map((div) => (
                        <option key={div.id} value={div.id}>
                          {language === 'bn' ? div.name_bn : div.name_en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {language === 'bn' ? 'জেলা' : 'District'} <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-brand-orange outline-hidden cursor-pointer"
                    >
                      {availableDistricts.map((dist) => (
                        <option key={dist.id} value={dist.id}>
                          {language === 'bn' ? dist.name_bn : dist.name_en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Delivery Rate Notification */}
                <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-200/70 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-brand-navy font-semibold">
                    <Truck className="w-4 h-4 text-brand-orange" />
                    <span>
                      {isDhakaZone
                        ? (language === 'bn'
                            ? `ঢাকা সিটি হোম ডেলিভারি: ৳${toBanglaNumber(deliverySettings?.insideDhaka ?? 60)} (১-২ দিন)`
                            : `Inside Dhaka Delivery: ৳${formatPriceBD(deliverySettings?.insideDhaka ?? 60)} (1-2 days)`)
                        : (language === 'bn'
                            ? `ঢাকার বাইরে হোম ডেলিভারি: ৳${toBanglaNumber(deliverySettings?.outsideDhaka ?? 120)} (২-৪ দিন)`
                            : `Outside Dhaka Delivery: ৳${formatPriceBD(deliverySettings?.outsideDhaka ?? 120)} (2-4 days)`)}
                    </span>
                  </div>
                  <span className="font-black text-brand-orange">
                    ৳{deliveryCharge}
                  </span>
                </div>

                {/* Full Detailed Address */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {language === 'bn' ? 'সম্পূর্ণ ডেলিভারি ঠিকানা' : 'Full Delivery Address'} <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={language === 'bn' ? 'রোড নম্বর, বাসা/ফ্ল্যাট নম্বর, এলাকা, থানা...' : 'House/Flat No, Road, Area, Thana...'}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-brand-orange outline-hidden"
                  />
                </div>

                {/* Order Special Notes */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {language === 'bn' ? 'বিশেষ নির্দেশাবলী (ঐচ্ছিক)' : 'Delivery Notes (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={language === 'bn' ? 'যেমন: বিকেলে ডেলিভারি দিন, ইত্যাদি' : 'e.g. Please deliver in the afternoon'}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:border-brand-orange outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-100 shadow-xs space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                <span className="w-6 h-6 rounded-full bg-brand-orange text-white text-xs font-black flex items-center justify-center">
                  ২
                </span>
                <h2 className="text-base font-black text-brand-navy">
                  {language === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন' : 'Payment Method'}
                </h2>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery (COD) */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition ${
                    paymentMethod === 'COD'
                      ? 'border-brand-orange bg-orange-50/50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="mt-1 text-brand-orange focus:ring-brand-orange"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-black text-brand-navy flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-brand-orange" />
                        <span>{language === 'bn' ? 'ক্যাশ অন ডেলিভারি (COD)' : 'Cash on Delivery'}</span>
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {language === 'bn' ? 'সবচেয়ে জনপ্রিয়' : 'Most Popular'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'bn'
                        ? 'পণ্য হাতে পেয়ে চেক করে ডেলিভারি ম্যানকে সম্পূর্ণ মূল্য পরিশোধ করুন।'
                        : 'Pay cash to the delivery rider once you receive and inspect your package.'}
                    </p>
                  </div>
                </label>

                {/* bKash */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition ${
                    paymentMethod === 'BKASH'
                      ? 'border-brand-orange bg-orange-50/50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="BKASH"
                    checked={paymentMethod === 'BKASH'}
                    onChange={() => setPaymentMethod('BKASH')}
                    className="mt-1 text-brand-orange focus:ring-brand-orange"
                  />
                  <div className="flex-1">
                    <span className="text-xs sm:text-sm font-black text-brand-navy flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#E2136E]" />
                      <span>{language === 'bn' ? 'বিকাশ (bKash Payment)' : 'bKash Online / Send Money'}</span>
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'bn'
                        ? 'আমাদের বিকাশ মার্চেন্ট/পার্সোনাল নম্বরে পেমেন্ট করুন।'
                        : 'Fast mobile wallet transfer via bKash.'}
                    </p>

                    {paymentMethod === 'BKASH' && (
                      <div className="mt-3 p-3 bg-pink-50 rounded-xl border border-pink-200 text-xs space-y-2">
                        <p className="font-semibold text-pink-900">
                          {language === 'bn'
                            ? 'বিকাশ নম্বর: 01799-887766 (Send Money / Payment)'
                            : 'bKash Number: 01799-887766 (Personal)'}
                        </p>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">
                            {language === 'bn' ? 'বিকাশ ট্রানজেকশন আইডি (TrxID):' : 'bKash TrxID:'}
                          </label>
                          <input
                            type="text"
                            required
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                            placeholder="e.g. 9J82KZ61"
                            className="w-full px-3 py-1.5 bg-white border border-pink-300 rounded-lg text-xs font-mono uppercase focus:outline-hidden"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </label>

                {/* Nagad */}
                <label
                  className={`flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition ${
                    paymentMethod === 'NAGAD'
                      ? 'border-brand-orange bg-orange-50/50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="NAGAD"
                    checked={paymentMethod === 'NAGAD'}
                    onChange={() => setPaymentMethod('NAGAD')}
                    className="mt-1 text-brand-orange focus:ring-brand-orange"
                  />
                  <div className="flex-1">
                    <span className="text-xs sm:text-sm font-black text-brand-navy flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-[#F7931E]" />
                      <span>{language === 'bn' ? 'নগদ (Nagad Payment)' : 'Nagad Mobile Banking'}</span>
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'bn'
                        ? 'আমাদের নগদ নম্বরে পেমেন্ট করুন।'
                        : 'Secure payments with Nagad mobile wallet.'}
                    </p>

                    {paymentMethod === 'NAGAD' && (
                      <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-2">
                        <p className="font-semibold text-amber-900">
                          {language === 'bn'
                            ? 'নগদ নম্বর: 01799-887766 (Send Money)'
                            : 'Nagad Number: 01799-887766 (Personal)'}
                        </p>
                        <div>
                          <label className="block text-[11px] font-bold text-gray-700 mb-1">
                            {language === 'bn' ? 'নগদ ট্রানজেকশন আইডি (TrxID):' : 'Nagad TrxID:'}
                          </label>
                          <input
                            type="text"
                            required
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                            placeholder="e.g. 7HA92K1L"
                            className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-xs font-mono uppercase focus:outline-hidden"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Items Review & Final Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-5">
              <h2 className="text-base font-black text-brand-navy pb-3 border-b border-gray-100">
                {language === 'bn' ? 'অর্ডারের পণ্যসমূহ' : 'Order Review'} ({cart.length})
              </h2>

              {/* Items List */}
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 pr-1 space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                        <Image
                          src={item.thumbnail_url}
                          alt={item.name_en}
                          fill
                          sizes="48px"
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-brand-navy line-clamp-1">
                          {language === 'bn' ? item.name_bn : item.name_en}
                        </h4>
                        <p className="text-[11px] text-gray-500">
                          ৳{formatPriceBD(item.price)} × {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-brand-navy">
                      ৳{formatPriceBD(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Code inside Checkout */}
              <div className="pt-3 border-t border-gray-100">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <span className="font-mono font-bold text-emerald-800">
                      {appliedCoupon.code} (-৳{appliedCoupon.discount})
                    </span>
                    <button
                      type="button"
                      onClick={() => setAppliedCoupon(null)}
                      className="text-rose-600 font-bold hover:underline text-[11px]"
                    >
                      {language === 'bn' ? 'মুছুন' : 'Remove'}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="কুপন কোড (KHUJIGO100)"
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono uppercase focus:bg-white focus:border-brand-orange outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                      className="px-3 py-2 rounded-xl bg-brand-navy text-white text-xs font-bold disabled:opacity-50"
                    >
                      {language === 'bn' ? 'প্রয়োগ' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2 pt-3 border-t border-gray-100 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>{language === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                  <span className="font-bold text-brand-navy">
                    ৳{language === 'bn' ? toBanglaNumber(formatPriceBD(cartTotal)) : formatPriceBD(cartTotal)}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-bold">
                    <span>{language === 'bn' ? 'ডিসকাউন্ট' : 'Discount'}</span>
                    <span>
                      -৳{language === 'bn' ? toBanglaNumber(formatPriceBD(discountAmount)) : formatPriceBD(discountAmount)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-gray-600">
                  <span>
                    {language === 'bn' ? 'ডেলিভারি ফি' : 'Delivery Fee'} ({isDhakaZone ? (language === 'bn' ? 'ঢাকা' : 'Dhaka') : (language === 'bn' ? 'ঢাকার বাইরে' : 'Outside')})
                  </span>
                  <span className="font-bold text-brand-navy">
                    ৳{language === 'bn' ? toBanglaNumber(formatPriceBD(deliveryCharge)) : formatPriceBD(deliveryCharge)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-base font-black text-brand-navy">
                  <span>{language === 'bn' ? 'মোট প্রদেয় বিল' : 'Grand Total'}</span>
                  <span className="text-xl font-black text-brand-orange">
                    ৳{language === 'bn' ? toBanglaNumber(formatPriceBD(grandTotal)) : formatPriceBD(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Final Confirm Order Button */}
              <button
                id="checkout-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-orange to-orange-500 hover:from-[#e55f00] hover:to-orange-600 text-white font-black text-sm sm:text-base shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{language === 'bn' ? 'অর্ডার প্রক্রিয়াধীন...' : 'Processing...'}</span>
                ) : (
                  <>
                    <span>{language === 'bn' ? 'অর্ডার নিশ্চিত করুন' : 'Confirm & Place Order'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Guarantee badges */}
              <div className="pt-2 text-center space-y-1">
                <p className="text-[11px] text-gray-500 font-medium">
                  {language === 'bn'
                    ? '🔒 আপনার অর্ডারটি নিশ্চিত হলে আমাদের প্রতিনিধি ফোন করে যাচাই করবেন।'
                    : '🔒 Our executive will confirm your order via phone call before dispatch.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
