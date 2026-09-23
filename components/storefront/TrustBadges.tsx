'use client';

import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const FEATURES = [
  {
    icon: ShieldCheck,
    title_bn: '১০০% অরিজিনাল পণ্য',
    title_en: '100% Authentic Quality',
    desc_bn: 'যাচাইকৃত ও পরীক্ষিত সেরা কোয়ালিটি',
    desc_en: 'Verified top quality guaranteed',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    icon: Truck,
    title_bn: '৬৪ জেলায় ক্যাশ অন ডেলিভারি',
    title_en: 'Cash on Delivery Nationwide',
    desc_bn: 'পণ্য হাতে পেয়ে নিশ্চিন্তে টাকা পরিশোধ করুন',
    desc_en: 'Pay securely after receiving parcel',
    color: 'text-brand-orange bg-orange-50',
  },
  {
    icon: RefreshCw,
    title_bn: '৭ দিনের সহজ রিটার্ন',
    title_en: '7-Day Easy Returns',
    desc_bn: 'কোনো সমস্যা থাকলে দ্রুত সমাধান বা পরিবর্তন',
    desc_en: 'Hassle-free replacement policy',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: Headphones,
    title_bn: 'সার্বক্ষণিক কাস্টমার সাপোর্ট',
    title_en: 'Dedicated Helpdesk',
    desc_bn: 'কল ও হোয়াটসঅ্যাপে সার্বক্ষণিক সহায়তা',
    desc_en: 'Live phone & WhatsApp assistance',
    color: 'text-purple-600 bg-purple-50',
  },
];

export default function TrustBadges() {
  const { language } = useApp();


  return (
    <div className="hidden md:block w-full bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {FEATURES.map((f, idx) => {
          const Icon = f.icon;
          return (
            <div key={idx} className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl ${f.color} flex items-center justify-center shrink-0 shadow-xs`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-brand-navy mb-0.5">
                  {language === 'bn' ? f.title_bn : f.title_en}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {language === 'bn' ? f.desc_bn : f.desc_en}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
