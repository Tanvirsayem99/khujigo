'use client';

import React from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight, CheckCircle2, Phone, MessageCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CONTACT_INFO } from '@/lib/constants';

/** Width-constrained main wrapper shared by every informational page. */
export function InfoPage({ children }: { children: React.ReactNode }) {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-5">
      {children}
    </main>
  );
}

export function InfoPageHeader({
  icon: Icon,
  title,
  subtitle,
  updated,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  updated?: string;
}) {
  const { language } = useApp();

  return (
    <header className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-7 space-y-4">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500">
        <Link href="/" className="hover:text-brand-orange transition">
          {language === 'bn' ? 'হোম' : 'Home'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
        <span className="text-brand-navy font-bold truncate">{title}</span>
      </nav>

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-orange-50 text-brand-orange flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-3xl font-black text-brand-navy tracking-tight">{title}</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">{subtitle}</p>
          {updated && <p className="text-[11px] text-gray-400 mt-2 font-medium">{updated}</p>}
        </div>
      </div>
    </header>
  );
}

export function InfoCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`bg-white rounded-3xl border border-gray-100 p-5 sm:p-7 space-y-6 ${className}`}>
      {children}
    </section>
  );
}

export function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2.5">
      <h2 className="text-sm sm:text-base font-black text-brand-navy tracking-tight flex items-start gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-2 shrink-0" />
        <span>{title}</span>
      </h2>
      <div className="text-xs sm:text-sm text-gray-600 leading-relaxed space-y-2 pl-3.5">{children}</div>
    </div>
  );
}

export function InfoBullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-orange-50 border border-orange-100 p-3.5 text-[11px] sm:text-xs text-brand-navy leading-relaxed">
      {children}
    </div>
  );
}

/** Closing support block so every policy page ends with the same next step. */
export function InfoContactStrip() {
  const { language } = useApp();

  return (
    <div className="bg-brand-navy rounded-3xl p-5 sm:p-7 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5">
      <div>
        <h2 className="text-base sm:text-lg font-black tracking-tight">
          {language === 'bn' ? 'আরও কিছু জানতে চান?' : 'Still have a question?'}
        </h2>
        <p className="text-[11px] sm:text-xs text-gray-300 mt-1 leading-relaxed">
          {language === 'bn'
            ? 'আমাদের সাপোর্ট টিম প্রতিদিন সকাল ৯টা থেকে রাত ১০টা পর্যন্ত আপনার পাশে আছে।'
            : 'Our support team is available every day from 9:00 AM to 10:00 PM.'}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 sm:justify-end shrink-0">
        <a
          href={`tel:${CONTACT_INFO.hotline}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold transition"
        >
          <Phone className="w-4 h-4 text-brand-orange" />
          <span>{CONTACT_INFO.hotline}</span>
        </a>
        <a
          href={CONTACT_INFO.whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1eb256] text-xs font-bold transition"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>
        <Link
          href="/contact-us"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-orange hover:bg-[#e55f00] text-xs font-bold transition"
        >
          <span>{language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}</span>
        </Link>
      </div>
    </div>
  );
}
