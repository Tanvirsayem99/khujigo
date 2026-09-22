'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle2,
  Printer,
  ShoppingBag,
  Truck,
  Phone,
  MapPin,
  Calendar,
  MessageCircle,
  Clock,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { InlineSpinner } from '@/components/common/LoadingStates';
import OrderStatusBadge from '@/components/storefront/OrderStatusBadge';
import OrderTrackingStepper from '@/components/storefront/OrderTrackingStepper';
import { useOrder } from '@/lib/hooks/api';
import { formatPriceBD, toBanglaNumber } from '@/lib/bangladesh-data';
import { CONTACT_INFO } from '@/lib/constants';

export default function OrderSuccessPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId as string;

  const { language } = useApp();

  const { order, isLoading, error } = useOrder(orderId);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <InlineSpinner />
      </div>
    );
  }

  // The order was placed, but we couldn't fetch the receipt — don't claim
  // success with no details.
  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-amber-500 mx-auto" />
        <h1 className="text-2xl font-black text-brand-navy">
          {language === 'bn' ? 'রিসিপ্ট লোড করা যায়নি' : 'Could not load your receipt'}
        </h1>
        <p className="text-sm text-gray-500">
          {language === 'bn'
            ? `অর্ডার #${orderId} গ্রহণ করা হয়েছে, তবে রিসিপ্টটি দেখানো যাচ্ছে না। "আমার অর্ডারসমূহ" থেকে দেখে নিন।`
            : `Order #${orderId} was received, but the receipt couldn't be loaded. You can view it under "My Orders".`}
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <Link
            href="/account"
            className="px-6 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold shadow-md"
          >
            {language === 'bn' ? 'আমার অর্ডারসমূহ' : 'My Orders'}
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-gray-100 text-brand-navy text-xs font-bold hover:bg-gray-200"
          >
            {language === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
        <h1 className="text-2xl font-black text-brand-navy">
          {language === 'bn' ? 'অর্ডার সফলভাবে গ্রহণ করা হয়েছে!' : 'Order Placed Successfully!'}
        </h1>
        <p className="text-sm text-gray-500">
          {language === 'bn'
            ? `অর্ডার নম্বর: #${orderId}। আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।`
            : `Order #${orderId}. Our representative will contact you shortly.`}
        </p>
        <div className="pt-4 flex justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold shadow-md"
          >
            {language === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}
          </Link>
          <Link
            href="/account"
            className="px-6 py-2.5 rounded-xl bg-gray-100 text-brand-navy text-xs font-bold hover:bg-gray-200"
          >
            {language === 'bn' ? 'আমার অর্ডারসমূহ' : 'My Orders'}
          </Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.created_at).toLocaleDateString(
    language === 'bn' ? 'bn-BD' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Top Banner Celebration */}
      <div className="text-center space-y-3 bg-gradient-to-b from-emerald-50/80 to-transparent p-6 sm:p-8 rounded-3xl border border-emerald-100">
        <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
          {language === 'bn' ? 'ধন্যবাদ! আপনার অর্ডারটি নিশ্চিত হয়েছে' : 'Thank You! Your Order is Confirmed'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
          {language === 'bn'
            ? `আপনার অর্ডার আইডি #${order.id}। পার্সেল পাঠানোর পূর্বে আমাদের কাস্টমার কেয়ার প্রতিনিধি ফোন করে কনফার্ম করবেন।`
            : `Your order ID is #${order.id}. Our customer support will call you before shipping.`}
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {order.district.includes('ঢাকা') || order.district.toLowerCase().includes('dhaka')
              ? (language === 'bn' ? 'আনুমানিক ডেলিভারি: ২৪-৪৮ ঘণ্টার মধ্যে' : 'Estimated Delivery: Within 24-48 Hours')
              : (language === 'bn' ? 'আনুমানিক ডেলিভারি: ২-৪ কার্যদিবসের মধ্যে' : 'Estimated Delivery: 2-4 Working Days')}
          </span>
        </div>
      </div>

      {/* Live Order Tracking */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl">
        <h2 className="text-sm font-bold text-brand-navy mb-6 text-center">
          {language === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Order Tracking'}
        </h2>
        <OrderTrackingStepper status={order.order_status} />
      </div>

      {/* Invoice Receipt Paper Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xl space-y-6 print:border-none print:shadow-none">
        {/* Receipt Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
          <div>
            <span className="text-2xl font-black tracking-tight text-brand-navy">
              Khuji<span className="text-brand-orange">Go</span>
            </span>
            <p className="text-xs text-gray-500">অনলাইন শপিং ও ট্রেন্ডিং প্রোডাক্ট প্ল্যাটফর্ম</p>
          </div>
          <div className="sm:text-right">
            <span className="text-xs font-bold text-gray-400 block uppercase">
              {language === 'bn' ? 'অর্ডার নম্বর' : 'Order Number'}
            </span>
            <span className="text-base font-black text-brand-navy font-mono">
              #{order.id}
            </span>
            <p className="text-xs text-gray-500">{orderDate}</p>
          </div>
        </div>

        {/* Shipping & Payment Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-gray-100 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <h4 className="font-bold text-gray-400 uppercase text-[11px]">
              {language === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Shipping Address'}
            </h4>
            <p className="font-bold text-brand-navy">{order.customer_name}</p>
            <p className="text-gray-600 font-mono">{order.customer_phone}</p>
            <p className="text-gray-600">{order.full_address}</p>
            <p className="text-gray-600">
              {order.district}, {order.division}
            </p>
          </div>

          <div className="space-y-1.5 sm:text-right">
            <h4 className="font-bold text-gray-400 uppercase text-[11px]">
              {language === 'bn' ? 'পেমেন্ট ও স্ট্যাটাস' : 'Payment & Status'}
            </h4>
            <p className="font-bold text-brand-navy">
              {order.payment_method === 'COD'
                ? (language === 'bn' ? 'ক্যাশ অন ডেলিভারি (পণ্য পেয়ে টাকা দিন)' : 'Cash on Delivery (COD)')
                : `${order.payment_method} Payment`}
            </p>
            <OrderStatusBadge status={order.order_status} />
            {order.payment_reference && (
              <p className="text-xs text-gray-500">
                {order.payment_method === 'COD'
                  ? (language === 'bn' ? 'ডেলিভারি চার্জ TrxID' : 'Delivery charge TrxID')
                  : (language === 'bn' ? 'ট্রানজেকশন আইডি' : 'Transaction ID')}
                :{' '}
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
                  ? (language === 'bn' ? 'ডেলিভারি চার্জ অগ্রিম পরিশোধিত ✓' : 'Delivery charge paid in advance ✓')
                  : (language === 'bn' ? 'ডেলিভারি চার্জ যাচাইাধীন' : 'Delivery charge under verification')}
              </p>
            )}
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          <h4 className="font-bold text-gray-700 text-xs">
            {language === 'bn' ? 'অর্ডারকৃত পণ্যের তালিকা' : 'Ordered Products'}
          </h4>
          <div className="divide-y divide-gray-100">
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
                      {language === 'bn' ? item.name_bn : item.name_en}
                    </h5>
                    <p className="text-xs text-gray-500">
                      ৳{formatPriceBD(item.price)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-black text-brand-navy">
                  ৳{formatPriceBD(item.total)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Totals */}
        <div className="pt-4 border-t border-gray-100 space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between text-gray-600">
            <span>{language === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
            <span className="font-bold text-brand-navy">৳{formatPriceBD(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>{language === 'bn' ? 'কুপন ডিসকাউন্ট' : 'Discount'}</span>
              <span>-৳{formatPriceBD(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>{language === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Charge'}</span>
            <span className="font-bold text-brand-navy">৳{formatPriceBD(order.delivery_charge)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-100 text-base font-black text-brand-navy">
            <span>{language === 'bn' ? 'সর্বমোট প্রদেয়' : 'Total Amount'}</span>
            <span className="text-xl font-black text-brand-orange">৳{formatPriceBD(order.total_amount)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2 print:hidden">
        <button
          onClick={handlePrint}
          className="px-6 py-3 rounded-2xl bg-white border border-gray-200 text-gray-800 text-xs sm:text-sm font-bold hover:bg-gray-50 transition shadow-xs flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>{language === 'bn' ? 'রিসিপ্ট প্রিন্ট করুন' : 'Print Receipt'}</span>
        </button>

        <a
          href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(
            `Hello KhujiGo, I have placed order #${order.id}. Could you please confirm status?`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition shadow-md shadow-emerald-600/20 flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে আপডেট নিন' : 'WhatsApp Support'}</span>
        </a>

        <Link
          href="/shop"
          className="px-6 py-3 rounded-2xl bg-brand-navy hover:bg-[#0c1829] text-white text-xs sm:text-sm font-bold transition shadow-md flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{language === 'bn' ? 'আরও শপিং করুন' : 'Continue Shopping'}</span>
        </Link>
      </div>
    </div>
  );
}
