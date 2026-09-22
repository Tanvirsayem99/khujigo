'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Printer,
  MessageCircle,
  MapPin,
  CreditCard,
  Calendar,
  AlertCircle,
  User,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { InlineSpinner } from '@/components/common/LoadingStates';
import OrderStatusBadge from '@/components/storefront/OrderStatusBadge';
import OrderTrackingStepper from '@/components/storefront/OrderTrackingStepper';
import { useOrder } from '@/lib/hooks/api';
import { formatBDT, CONTACT_INFO } from '@/lib/constants';
import { PaymentStatus } from '@/types';

const PAYMENT_STATUS_LABEL: Record<PaymentStatus, { en: string; bn: string }> = {
  PAID: { en: 'Paid', bn: 'পরিশোধিত' },
  UNPAID: { en: 'Unpaid', bn: 'অপরিশোধিত' },
  REFUNDED: { en: 'Refunded', bn: 'ফেরত দেওয়া হয়েছে' },
};

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const { language, t } = useApp();
  const { customer, isCustomerLoggedIn, isAuthLoading } = useAuth();

  const { order, isLoading, error } = useOrder(orderId, { refreshInterval: 30000 });

  if (isAuthLoading) {
    return (
      <main className="max-w-md mx-auto py-24 px-4">
        <InlineSpinner />
      </main>
    );
  }

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
              en: 'Log in to track this order and see its live delivery status.',
              bn: 'অর্ডার ট্র্যাক করতে ও লাইভ ডেলিভারি স্ট্যাটাস দেখতে লগইন করুন।',
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

  if (isLoading) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20">
        <InlineSpinner />
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-amber-500 mx-auto" />
        <h1 className="text-2xl font-black text-brand-navy">
          {t({ en: 'Order not found', bn: 'অর্ডার খুঁজে পাওয়া যায়নি' })}
        </h1>
        <p className="text-sm text-gray-500">
          {t({
            en: `We couldn't load order #${orderId}. Please check the order id and try again.`,
            bn: `অর্ডার #${orderId} লোড করা যায়নি। আইডি যাচাই করে আবার চেষ্টা করুন।`,
          })}
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <Link
            href="/account"
            className="px-6 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold shadow-md"
          >
            {t({ en: 'My Orders', bn: 'আমার অর্ডারসমূহ' })}
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-gray-100 text-brand-navy text-xs font-bold hover:bg-gray-200"
          >
            {t({ en: 'Back to Home', bn: 'হোমে ফিরে যান' })}
          </Link>
        </div>
      </main>
    );
  }

  const orderDate = new Date(order.created_at).toLocaleDateString(
    language === 'bn' ? 'bn-BD' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  );

  const isInsideDhaka =
    order.district.includes('ঢাকা') || order.district.toLowerCase().includes('dhaka');

  const paymentLabel =
    order.payment_method === 'COD'
      ? t({ en: 'Cash on Delivery (COD)', bn: 'ক্যাশ অন ডেলিভারি (পণ্য পেয়ে টাকা দিন)' })
      : `${order.payment_method} Payment`;

  const paymentStatus = PAYMENT_STATUS_LABEL[order.payment_status] ?? {
    en: order.payment_status,
    bn: order.payment_status,
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        href="/account"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-brand-orange transition"
      >
        <ArrowLeft className="w-4 h-4" />
        {t({ en: 'Back to My Orders', bn: 'আমার অর্ডারে ফিরে যান' })}
      </Link>

      {/* Tracking card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-100 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3 pb-6 border-b border-neutral-100">
          <div>
            <h1 className="text-lg sm:text-xl font-black text-brand-navy">
              {t({ en: 'Track Your Order', bn: 'আপনার অর্ডার ট্র্যাক করুন' })}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              {t({ en: 'Order ID: ', bn: 'অর্ডার নং: ' })}
              <span className="font-mono font-bold text-brand-navy">#{order.id}</span>
              <span className="mx-2 text-neutral-300">•</span>
              <Calendar className="w-3 h-3 inline" />
              <span className="ml-1">{orderDate}</span>
            </p>
          </div>
          <OrderStatusBadge status={order.order_status} />
        </div>

        <OrderTrackingStepper status={order.order_status} className="mt-8" />

        <p className="mt-6 text-center text-xs text-neutral-500">
          {isInsideDhaka
            ? t({ en: 'Estimated Delivery: Within 24-48 Hours', bn: 'আনুমানিক ডেলিভারি: ২৪-৪৮ ঘণ্টার মধ্যে' })
            : t({ en: 'Estimated Delivery: 2-4 Working Days', bn: 'আনুমানিক ডেলিভারি: ২-৪ কার্যদিবসের মধ্যে' })}
        </p>
      </div>

      {/* Receipt details */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <h4 className="flex items-center gap-1.5 font-bold text-gray-400 uppercase text-[11px]">
              <MapPin className="w-3.5 h-3.5" />
              {t({ en: 'Shipping Address', bn: 'ডেলিভারি ঠিকানা' })}
            </h4>
            <p className="font-bold text-brand-navy">{order.customer_name}</p>
            <p className="text-gray-600 font-mono">{order.customer_phone}</p>
            <p className="text-gray-600">{order.full_address}</p>
            <p className="text-gray-600">
              {order.district}, {order.division}
            </p>
          </div>

          <div className="space-y-1.5 sm:text-right">
            <h4 className="flex items-center gap-1.5 font-bold text-gray-400 uppercase text-[11px] sm:justify-end">
              <CreditCard className="w-3.5 h-3.5" />
              {t({ en: 'Payment', bn: 'পেমেন্ট' })}
            </h4>
            <p className="font-bold text-brand-navy">{paymentLabel}</p>
            <p className="text-gray-600">
              {t({ en: 'Status: ', bn: 'স্ট্যাটাস: ' })}
              <span className="font-semibold text-brand-navy">{t(paymentStatus)}</span>
            </p>
            {order.payment_reference && (
              <p className="text-xs text-gray-500">
                {order.payment_method === 'COD'
                  ? t({ en: 'Delivery charge TrxID: ', bn: 'ডেলিভারি চার্জ TrxID: ' })
                  : t({ en: 'Transaction ID: ', bn: 'ট্রানজেকশন আইডি: ' })}
                <span className="font-mono text-brand-navy">{order.payment_reference}</span>
              </p>
            )}
            {order.payment_method === 'COD' && order.delivery_charge > 0 && (
              <p
                className={`text-xs font-bold ${
                  order.delivery_charge_paid ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {order.delivery_charge_paid
                  ? t({ en: 'Delivery charge paid in advance ✓', bn: 'ডেলিভারি চার্জ অগ্রিম পরিশোধিত ✓' })
                  : t({ en: 'Delivery charge under verification', bn: 'ডেলিভারি চার্জ যাচাইাধীন' })}
              </p>
            )}
          </div>
        </div>

        <div className="pt-6 border-t border-neutral-100 space-y-3">
          <h4 className="font-bold text-gray-700 text-xs">
            {t({ en: 'Ordered Products', bn: 'অর্ডারকৃত পণ্যের তালিকা' })}
          </h4>
          <div className="divide-y divide-neutral-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
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
                    <h5 className="text-xs sm:text-sm font-bold text-brand-navy line-clamp-1">
                      {t({ en: item.name_en, bn: item.name_bn })}
                    </h5>
                    <p className="text-xs text-gray-500">
                      {formatBDT(item.price, language === 'bn')} × {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black text-brand-navy">
                  {formatBDT(item.total, language === 'bn')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-100 space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between text-gray-600">
            <span>{t({ en: 'Subtotal', bn: 'সাবটোটাল' })}</span>
            <span className="font-bold text-brand-navy">{formatBDT(order.subtotal, language === 'bn')}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>{t({ en: 'Discount', bn: 'ডিসকাউন্ট' })}</span>
              <span>-{formatBDT(order.discount, language === 'bn')}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>{t({ en: 'Delivery Charge', bn: 'ডেলিভারি চার্জ' })}</span>
            <span className="font-bold text-brand-navy">
              {formatBDT(order.delivery_charge, language === 'bn')}
            </span>
          </div>
          <div className="flex justify-between pt-3 border-t border-neutral-100 items-center">
            <span className="font-black text-brand-navy">
              {t({ en: 'Total Amount', bn: 'সর্বমোট প্রদেয়' })}
            </span>
            <span className="text-xl font-black text-brand-orange">
              {formatBDT(order.total_amount, language === 'bn')}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4 print:hidden">
        <button
          onClick={() => typeof window !== 'undefined' && window.print()}
          className="px-6 py-3 rounded-2xl bg-white border border-gray-200 text-gray-800 text-xs sm:text-sm font-bold hover:bg-gray-50 transition flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>{t({ en: 'Print Receipt', bn: 'রিসিপ্ট প্রিন্ট করুন' })}</span>
        </button>

        <a
          href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(
            `Hello KhujiGo, I have placed order #${order.id}. Could you please confirm status?`,
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition shadow-md shadow-emerald-600/20 flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{t({ en: 'WhatsApp Support', bn: 'হোয়াটসঅ্যাপে আপডেট নিন' })}</span>
        </a>
      </div>
    </main>
  );
}
