'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import Logo from '@/components/common/Logo';
import { CONTACT_INFO } from '@/lib/constants';
import { useApp } from '@/context/AppContext';

export default function Footer() {
  const pathname = usePathname();
  const { language, t } = useApp();

  // Hide footer on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#07111F] text-white pt-12 pb-24 md:pb-12 border-t border-gray-800">
      {/* 1. Value / Trust Props Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-gray-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-gray-900/50 border border-gray-800/80">
            <div className="w-10 h-10 rounded-xl bg-[#FF6A00]/20 text-[#FF6A00] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight">{t.originalGuarantee}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {language === 'bn' ? 'সরাসরি অথেনটিক সোর্স থেকে সংগৃহীত' : 'Sourced from authentic brands'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-gray-900/50 border border-gray-800/80">
            <div className="w-10 h-10 rounded-xl bg-[#FFC400]/20 text-[#FFC400] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight">{t.fastDelivery}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {language === 'bn' ? 'সারা বাংলাদেশে ২-৪ দিনে ডেলিভারি' : '2-4 Days nationwide shipping'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-gray-900/50 border border-gray-800/80">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight">{t.easyReturns}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {language === 'bn' ? '৭ দিনের সহজ রিটার্ন বা এক্সচেঞ্জ' : 'Hassle-free replacement guarantee'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-gray-900/50 border border-gray-800/80">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white tracking-tight">{t.support247}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {language === 'bn' ? 'যেকোনো প্রশ্নে কল বা হোয়াটসঅ্যাপ' : 'Dedicated phone & WhatsApp care'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo variant="footer" />
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              {language === 'bn'
                ? 'KhujiGo বাংলাদেশের একটি আধুনিক ই-কমার্স প্ল্যাটফর্ম যেখানে আপনি ট্রেন্ডিং, দরকারি, ইউনিক এবং আকর্ষণীয় সব পণ্য পাবেন সাশ্রয়ী মূল্যে।'
                : 'KhujiGo is a modern Bangladeshi e-commerce platform where customers discover trending, unique, and highly useful products online.'}
            </p>

            <div className="space-y-2 text-xs text-gray-300 pt-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF6A00] shrink-0" />
                <span>{language === 'bn' ? CONTACT_INFO.address_bn : CONTACT_INFO.address_en}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FF6A00] shrink-0" />
                <span>{CONTACT_INFO.hotline}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FF6A00] shrink-0" />
                <span>{CONTACT_INFO.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#FF6A00] shrink-0" />
                <span>{language === 'bn' ? CONTACT_INFO.workingHours_bn : CONTACT_INFO.workingHours_en}</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={CONTACT_INFO.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-[#1877F2] text-gray-300 hover:text-white flex items-center justify-center transition"
                title="Facebook"
              >
                <span className="text-xs font-bold">f</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-[#E4405F] text-gray-300 hover:text-white flex items-center justify-center transition"
                title="Instagram"
              >
                <span className="text-xs font-bold">in</span>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-[#FF0000] text-gray-300 hover:text-white flex items-center justify-center transition"
                title="YouTube"
              >
                <span className="text-xs font-bold">yt</span>
              </a>
              <a
                href={CONTACT_INFO.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-[#25D366] text-gray-300 hover:text-white flex items-center justify-center transition"
                title="WhatsApp"
              >
                <span className="text-xs font-bold">wa</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide border-l-2 border-[#FF6A00] pl-2.5">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/shop" className="hover:text-[#FF6A00] transition">
                  {language === 'bn' ? 'সব পণ্য' : 'All Products'}
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=trending" className="hover:text-[#FF6A00] transition flex items-center gap-1">
                  <span>{t.trending}</span>
                  <span className="text-[9px] bg-[#FF6A00] text-white px-1 rounded font-bold">HOT</span>
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=best-sellers" className="hover:text-[#FF6A00] transition">
                  {t.bestseller}
                </Link>
              </li>
              <li>
                <Link href="/shop?filter=deals" className="hover:text-[#FF6A00] transition">
                  {t.deals}
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-[#FF6A00] transition">
                  {t.wishlist}
                </Link>
              </li>
              <li>
                <Link href="/my-account" className="hover:text-[#FF6A00] transition">
                  {t.myAccount}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide border-l-2 border-[#FFC400] pl-2.5">
              {t.customerService}
            </h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>
                <Link href="/contact-us" className="hover:text-[#FF6A00] transition">
                  {t.contactUs}
                </Link>
              </li>
              <li>
                <Link href="/my-orders" className="hover:text-[#FF6A00] transition">
                  {language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-[#FF6A00] transition">
                  {t.refundPolicy}
                </Link>
              </li>
              <li>
                <Link href="/terms-conditions" className="hover:text-[#FF6A00] transition">
                  {t.termsConditions}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#FF6A00] transition">
                  {t.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-[#FF6A00] transition">
                  {t.aboutUs}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Payment & Security in Bangladesh */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide border-l-2 border-[#FF6A00] pl-2.5">
              {language === 'bn' ? 'পেমেন্ট মেথড' : 'Payment Methods'}
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              {language === 'bn'
                ? 'ক্যাশ অন ডেলিভারি (COD) অথবা অনলাইন মোবাইল ব্যাংকিং এর মাধ্যমে নিরাপদে পেমেন্ট করুন।'
                : 'Enjoy 100% secure payments via Cash on Delivery or Mobile Banking.'}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 rounded bg-gray-800 text-[11px] font-bold text-amber-400 border border-gray-700">
                ক্যাশ অন ডেলিভারি (COD)
              </span>
              <span className="px-2 py-1 rounded bg-pink-900/60 text-[11px] font-bold text-pink-300 border border-pink-700/50">
                bKash
              </span>
              <span className="px-2 py-1 rounded bg-orange-950/70 text-[11px] font-bold text-orange-400 border border-orange-700/50">
                Nagad
              </span>
              <span className="px-2 py-1 rounded bg-purple-950/70 text-[11px] font-bold text-purple-300 border border-purple-700/50">
                Rocket
              </span>
              <span className="px-2 py-1 rounded bg-blue-950/70 text-[11px] font-bold text-blue-300 border border-blue-700/50">
                Visa / Master
              </span>
            </div>

            <div className="pt-3">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#FFC400] transition"
              >
                <span>{t.adminDashboard}</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 text-center sm:text-left">
        <div>
          © {new Date().getFullYear()} <span className="text-white font-bold">KhujiGo</span>. {t.allRightsReserved}
          <span className="text-[#FF6A00] font-semibold ml-1.5">খুঁজে নিন ট্রেন্ডিং সবকিছু!</span>
        </div>
        <div className="flex items-center gap-4 text-gray-500 text-[11px]">
          <span>Made for Bangladesh 🇧🇩</span>
          <span>•</span>
          <Link href="/privacy-policy" className="hover:text-gray-300">Privacy</Link>
          <span>•</span>
          <Link href="/terms-conditions" className="hover:text-gray-300">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
