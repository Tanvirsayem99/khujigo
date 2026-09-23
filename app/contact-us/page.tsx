'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  FileText,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CONTACT_INFO } from '@/lib/constants';
import {
  InfoPage,
  InfoPageHeader,
  InfoCard,
  InfoSection,
  InfoBullets,
} from '@/components/common/InfoPage';

export default function ContactUsPage() {
  const { language, t, showToast } = useApp();
  const isBn = language === 'bn';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('order');
  const [orderId, setOrderId] = useState('');
  const [message, setMessage] = useState('');

  const topics = useMemo(
    () => [
      { value: 'order', label: isBn ? 'অর্ডার সংক্রান্ত সহায়তা' : 'Order support' },
      { value: 'delivery', label: isBn ? 'ডেলিভারি সংক্রান্ত' : 'Delivery' },
      { value: 'return', label: isBn ? 'রিটার্ন / রিফান্ড' : 'Return / Refund' },
      { value: 'payment', label: isBn ? 'পেমেন্ট সংক্রান্ত' : 'Payment' },
      { value: 'complaint', label: isBn ? 'অভিযোগ' : 'Complaint' },
      { value: 'other', label: isBn ? 'অন্যান্য' : 'Something else' },
    ],
    [isBn],
  );

  const buildEnquiry = () => {
    const topicLabel = topics.find((item) => item.value === topic)?.label ?? topic;
    return [
      isBn ? 'নতুন যোগাযোগ — KhujiGo' : 'New enquiry — KhujiGo',
      `${isBn ? 'নাম' : 'Name'}: ${name.trim()}`,
      `${isBn ? 'মোবাইল' : 'Phone'}: ${phone.trim()}`,
      email.trim() ? `${isBn ? 'ইমেইল' : 'Email'}: ${email.trim()}` : null,
      `${isBn ? 'বিষয়' : 'Topic'}: ${topicLabel}`,
      orderId.trim() ? `${isBn ? 'অর্ডার আইডি' : 'Order ID'}: ${orderId.trim()}` : null,
      `${isBn ? 'বার্তা' : 'Message'}: ${message.trim()}`,
    ]
      .filter(Boolean)
      .join('\n');
  };

  const isFormValid = name.trim().length > 0 && phone.trim().length > 0 && message.trim().length > 0;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!isFormValid) {
      showToast(
        isBn
          ? 'অনুগ্রহ করে নাম, মোবাইল নম্বর ও বার্তা লিখুন।'
          : 'Please fill in your name, phone number and message.',
        'error',
      );
      return;
    }

    const enquiry = buildEnquiry();
    window.open(
      `${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(enquiry)}`,
      '_blank',
      'noreferrer',
    );
    showToast(isBn ? 'হোয়াটসঅ্যাপে বার্তা তৈরি হয়েছে!' : 'Opening WhatsApp with your message!', 'success');
  };

  const mailtoHref = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(
    isBn ? 'KhujiGo — যোগাযোগ' : 'KhujiGo — Contact',
  )}&body=${encodeURIComponent(buildEnquiry())}`;

  const channels = [
    {
      icon: PhoneCall,
      label: isBn ? 'হটলাইন (সকাল ৯টা - রাত ১০টা)' : 'Hotline (9:00 AM - 10:00 PM)',
      value: CONTACT_INFO.hotline,
      href: `tel:${CONTACT_INFO.hotline}`,
      external: false,
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: CONTACT_INFO.whatsapp,
      href: CONTACT_INFO.whatsappUrl,
      external: true,
    },
    {
      icon: Mail,
      label: isBn ? 'ইমেইল' : 'Email',
      value: CONTACT_INFO.email,
      href: `mailto:${CONTACT_INFO.email}`,
      external: false,
    },
    {
      icon: MapPin,
      label: isBn ? 'অফিসের ঠিকানা' : 'Office Address',
      value: isBn ? CONTACT_INFO.address_bn : CONTACT_INFO.address_en,
      href: null,
      external: false,
    },
  ];

  const quickLinks = [
    { icon: RotateCcw, href: '/refund-policy', label: t.refundPolicy },
    { icon: ShieldCheck, href: '/privacy-policy', label: t.privacyPolicy },
    { icon: FileText, href: '/terms-conditions', label: t.termsConditions },
  ];

  const inputClass =
    'w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:border-brand-orange outline-hidden transition';

  return (
    <InfoPage>
      <InfoPageHeader
        icon={PhoneCall}
        title={t.contactUs}
        subtitle={
          isBn
            ? 'অর্ডার, ডেলিভারি, রিটার্ন বা যেকোনো প্রশ্নে আমরা আছি আপনার পাশে — কল, হোয়াটসঅ্যাপ বা ইমেইলে।'
            : 'Order, delivery, returns or any question — reach us by call, WhatsApp or email.'
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {channels.map(({ icon: Icon, label, value, href, external }) => {
          const inner = (
            <>
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold text-gray-500">{label}</p>
                <p className="text-xs sm:text-sm font-bold text-brand-navy mt-0.5 break-words">{value}</p>
              </div>
              {href && <ExternalLink className="w-3.5 h-3.5 text-gray-300 shrink-0 ml-auto" />}
            </>
          );

          return href ? (
            <a
              key={label}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noreferrer' : undefined}
              className="flex items-start gap-3.5 bg-white rounded-2xl border border-gray-100 p-4 hover:border-orange-200 hover:shadow-sm transition"
            >
              {inner}
            </a>
          ) : (
            <div key={label} className="flex items-start gap-3.5 bg-white rounded-2xl border border-gray-100 p-4">
              {inner}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <InfoCard className="lg:col-span-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-brand-navy tracking-tight">
              {isBn ? 'আমাদের লিখুন' : 'Send us a message'}
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-1">
              {isBn
                ? 'নিচের ফর্মটি পূরণ করে সাবমিট করুন — আপনার বার্তা সরাসরি আমাদের হোয়াটসঅ্যাপে চলে যাবে।'
                : 'Fill in the form below — your message goes straight to our WhatsApp.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isBn ? 'আপনার নাম' : 'Your Name'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={isBn ? 'পূর্ণ নাম' : 'Full name'}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isBn ? 'মোবাইল নম্বর' : 'Mobile Number'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="01XXXXXXXXX"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isBn ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {isBn ? 'বিষয়' : 'Topic'}
                </label>
                <select
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  {topics.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {isBn ? 'অর্ডার আইডি (ঐচ্ছিক)' : 'Order ID (Optional)'}
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(event) => setOrderId(event.target.value)}
                placeholder={isBn ? 'অর্ডার সংক্রান্ত হলে আইডি লিখুন' : 'Add it if this is about an order'}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {isBn ? 'আপনার বার্তা' : 'Your Message'} <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={
                  isBn
                    ? 'আপনার সমস্যা বা প্রশ্নটি বিস্তারিত লিখুন...'
                    : 'Describe your issue or question in detail...'
                }
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-orange hover:bg-[#e55f00] text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 transition disabled:opacity-60"
              disabled={!isFormValid}
            >
              <Send className="w-4 h-4" />
              <span>{isBn ? 'হোয়াটসঅ্যাপে পাঠান' : 'Send via WhatsApp'}</span>
            </button>

            <a
              href={mailtoHref}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-brand-navy text-xs font-bold transition"
            >
              <Mail className="w-4 h-4 text-brand-orange" />
              <span>{isBn ? 'ইমেইলে পাঠান' : 'Send by email'}</span>
            </a>
          </form>
        </InfoCard>

        <div className="lg:col-span-2 space-y-5">
          <InfoCard>
            <InfoSection title={isBn ? 'দ্রুত সহায়তার জন্য প্রস্তুত থাকুন' : 'Before you write to us'}>
              <InfoBullets
                items={[
                  isBn ? 'অর্ডার আইডি হাতের কাছে রাখুন।' : 'Keep your order ID handy.',
                  isBn ? 'সমস্যাটি হলে পণ্যের ছবি বা ভিডিও সংরক্ষণ করুন।' : 'Save photos or a video of the issue.',
                  isBn ? 'ডেলিভারির সময়সীমা উল্লেখ করুন।' : 'Mention the expected delivery window.',
                  isBn ? 'অর্ডারের মোবাইল নম্বরটি লিখুন।' : 'Use the phone number on the order.',
                ]}
              />
            </InfoSection>

            <InfoSection title={isBn ? 'সাপোর্টের সময়' : 'Support Hours'}>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <span>{isBn ? CONTACT_INFO.workingHours_bn : CONTACT_INFO.workingHours_en}</span>
              </div>
            </InfoSection>

            <InfoSection title={isBn ? 'দ্রুত লিংক' : 'Quick Links'}>
              <div className="flex flex-wrap gap-2">
                {quickLinks.map(({ icon: Icon, href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 hover:border-orange-200 hover:text-brand-orange text-[11px] font-bold text-brand-navy transition"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </InfoSection>
          </InfoCard>
        </div>
      </div>
    </InfoPage>
  );
}
