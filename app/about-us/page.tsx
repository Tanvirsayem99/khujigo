'use client';

import React from 'react';
import Link from 'next/link';
import {
  Info,
  PackageSearch,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Store,
  Target,
  HeartHandshake,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CONTACT_INFO, DEFAULT_DELIVERY_RATES, formatBDT } from '@/lib/constants';
import {
  InfoPage,
  InfoPageHeader,
  InfoCard,
  InfoSection,
  InfoBullets,
  InfoNote,
  InfoContactStrip,
} from '@/components/common/InfoPage';

export default function AboutUsPage() {
  const { language, t } = useApp();
  const isBn = language === 'bn';

  const promises = [
    {
      icon: ShieldCheck,
      title: isBn ? '১০০% অরিজিনাল' : '100% Original',
      body: isBn
        ? 'সরাসরি অথেনটিক সোর্স থেকে সংগৃহীত পণ্য।'
        : 'Every product sourced from authentic brands and verified suppliers.',
    },
    {
      icon: Truck,
      title: isBn ? 'দ্রুত ডেলিভারি' : 'Fast Delivery',
      body: isBn
        ? 'ঢাকায় ১-২ দিনে, ঢাকার বাইরে ২-৪ দিনে হোম ডেলিভারি।'
        : `Inside Dhaka in ${DEFAULT_DELIVERY_RATES.estimatedDaysInsideDhaka}, outside Dhaka in ${DEFAULT_DELIVERY_RATES.estimatedDaysOutsideDhaka}.`,
    },
    {
      icon: RotateCcw,
      title: isBn ? 'সহজ রিটার্ন' : 'Easy Returns',
      body: isBn
        ? 'পণ্য হাতে পাওয়ার ৭ দিনের মধ্যে সহজ রিটার্ন বা এক্সচেঞ্জ।'
        : 'Hassle-free return or exchange within 7 days of delivery.',
    },
    {
      icon: Headphones,
      title: isBn ? '২৪/৭ সাপোর্ট' : '24/7 Support',
      body: isBn
        ? 'কল বা হোয়াটসঅ্যাপে যেকোনো প্রশ্নের দ্রুত উত্তর।'
        : 'Quick answers over phone or WhatsApp, whenever you need them.',
    },
  ];

  const steps = [
    {
      step: '০১',
      title: isBn ? 'ট্রেন্ড খুঁজুন' : 'Discover',
      body: isBn
        ? 'ট্রেন্ডিং, দরকারি ও ইউনিক পণ্যগুলো এক জায়গায় ব্রাউজ করুন।'
        : 'Browse trending, useful and unique products in one place.',
    },
    {
      step: '০২',
      title: isBn ? 'অর্ডার করুন' : 'Order',
      body: isBn
        ? 'নাম, মোবাইল নম্বর ও ঠিকানা দিয়ে মাত্র এক মিনিটে অর্ডার করুন।'
        : 'Place your order in under a minute with name, phone and address.',
    },
    {
      step: '০৩',
      title: isBn ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery',
      body: isBn
        ? 'পণ্য হাতে পেয়ে দেখে নিয়ে তারপর পেমেন্ট করুন।'
        : 'Receive the product, check it, then pay at your doorstep.',
    },
    {
      step: '০৪',
      title: isBn ? 'সাপোর্ট পান' : 'Get Support',
      body: isBn
        ? 'ডেলিভারির পরেও যেকোনো সমস্যায় আমরা পাশে আছি।'
        : 'We stay with you after delivery for any issue or exchange.',
    },
  ];

  return (
    <InfoPage>
      <InfoPageHeader
        icon={Info}
        title={t.aboutUs}
        subtitle={
          isBn
            ? 'KhujiGo — বাংলাদেশের আধুনিক ই-কমার্স প্ল্যাটফর্ম, যেখানে ট্রেন্ডিং, দরকারি ও ইউনিক সব পণ্য এক জায়গায়।'
            : 'KhujiGo is a modern Bangladeshi e-commerce platform bringing trending, useful and unique products together.'
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <Store className="w-5 h-5 text-brand-orange" />
          <p className="text-[11px] text-gray-500 mt-2 font-semibold">{isBn ? 'ডেলিভারি এলাকা' : 'Delivery Coverage'}</p>
          <p className="text-sm font-black text-brand-navy mt-0.5">{isBn ? '৬৪ জেলা' : 'All 64 Districts'}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <Target className="w-5 h-5 text-brand-orange" />
          <p className="text-[11px] text-gray-500 mt-2 font-semibold">{isBn ? 'ঢাকার ভিতরে ডেলিভারি' : 'Inside Dhaka Delivery'}</p>
          <p className="text-sm font-black text-brand-navy mt-0.5">{formatBDT(DEFAULT_DELIVERY_RATES.insideDhaka, isBn)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <HeartHandshake className="w-5 h-5 text-brand-orange" />
          <p className="text-[11px] text-gray-500 mt-2 font-semibold">{isBn ? 'ফ্রি ডেলিভারি' : 'Free Delivery Above'}</p>
          <p className="text-sm font-black text-brand-navy mt-0.5">
            {formatBDT(DEFAULT_DELIVERY_RATES.freeDeliveryThreshold, isBn)}
          </p>
        </div>
      </div>

      <InfoCard>
        <InfoSection title={isBn ? 'আমরা কারা' : 'Who We Are'}>
          <p>
            {isBn
              ? 'KhujiGo যাত্রা শুরু করে একটি সহজ লক্ষ্য নিয়ে — বাংলাদেশের মানুষের জন্য অনলাইন কেনাকাটাকে সহজ, নিরাপদ ও আনন্দদায়ক করে তোলা। আমরা প্রতিদিন ইন্টারনেটে Trending হওয়া পণ্যগুলো খুঁজে বের করে সাশ্রয়ী মূল্যে আপনার ঘরে পৌঁছে দিই, যাতে আপনি সময় ও অর্থ দুটোই বাঁচাতে পারেন।'
              : 'KhujiGo started with one simple goal — to make online shopping in Bangladesh easy, safe and enjoyable. Every day we hunt down the products that are trending online and deliver them to your doorstep at a fair price, so you save both time and money.'}
          </p>
          <p>
            {isBn
              ? 'আমাদের প্রতিটি পণ্য যাচাই করা সাপ্লায়ার থেকে সংগ্রহ করা হয় এবং ডেলিভারির আগে কোয়ালিটি চেক করা হয়। কোনো পণ্য পছন্দ না হলে সেটি ফেরত বা এক্সচেঞ্জ করার সুবিধাও আপনি পাবেন।'
              : 'Every product is sourced from verified suppliers and quality-checked before dispatch. And if something is not right, you can always return or exchange it.'}
          </p>
        </InfoSection>

        <InfoSection title={isBn ? 'আমাদের লক্ষ্য' : 'Our Mission'}>
          <p>
            {isBn
              ? 'ট্রেন্ডিং, দরকারি এবং ইউনিক পণ্য — সবকিছু যেন এক জায়গায় পাওয়া যায়। আমরা চাই, একজন ক্রেতা যেন দীর্ঘ ভাবনা ছাড়াই আস্থার সাথে অর্ডার করতে পারেন: সঠিক পণ্য, সঠিক মূল্য এবং সঠিক সময়ে ডেলিভারি।'
              : 'To bring trending, useful and unique products together in one trusted place — so a customer can order with confidence, knowing they get the right product, at the right price, at the right time.'}
          </p>
        </InfoSection>

        <InfoSection title={isBn ? 'আমাদের প্রতিশ্রুতি' : 'Our Promise'}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
            {promises.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-gray-100 bg-gray-50/60 p-3.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-brand-navy mt-2.5">{title}</h3>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </InfoSection>
      </InfoCard>

      <InfoCard>
        <InfoSection title={isBn ? 'কীভাবে কাজ করে' : 'How It Works'}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
            {steps.map(({ step, title, body }) => (
              <div key={step} className="rounded-2xl border border-gray-100 p-3.5 flex gap-3">
                <span className="text-lg font-black text-orange-200 leading-none shrink-0">{step}</span>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-brand-navy">{title}</h3>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </InfoSection>

        <InfoNote>
          {isBn ? (
            <>
              <strong>প্রয়োজন?</strong> পণ্য নিয়ে যেকোনো প্রশ্ন বা অভিযোগে আমাদের হটলাইন{' '}
              <strong>{CONTACT_INFO.hotline}</strong> নম্বরে কল করুন অথবা <strong>{CONTACT_INFO.email}</strong> ঠিকানায়
              ইমেইল করুন। আমাদের ঠিকানা: {CONTACT_INFO.address_bn}।
            </>
          ) : (
            <>
              <strong>Need something?</strong> Call our hotline at <strong>{CONTACT_INFO.hotline}</strong> or email{' '}
              <strong>{CONTACT_INFO.email}</strong> for any question or complaint. Our address:{' '}
              {CONTACT_INFO.address_en}.
            </>
          )}
        </InfoNote>
      </InfoCard>

      <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <PackageSearch className="w-6 h-6 text-brand-orange shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm sm:text-base font-black text-brand-navy tracking-tight">
              {isBn ? 'ট্রেন্ডিং পণ্য ঘুরে দেখুন' : 'Explore what is trending'}
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
              {isBn
                ? 'নতুন কালেকশন ও ধামাকা অফারে সাশ্রয়ী মূল্যে কেনাকাটা করুন।'
                : 'Shop the new arrivals and hot deals at honest prices.'}
            </p>
          </div>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-orange hover:bg-[#e55f00] text-white text-xs font-bold shadow-md transition shrink-0"
        >
          <span>{t.shopNow}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <InfoContactStrip />
    </InfoPage>
  );
}
