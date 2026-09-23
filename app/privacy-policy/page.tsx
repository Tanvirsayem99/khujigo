'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Cookie, UserCheck, Database, Megaphone } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CONTACT_INFO } from '@/lib/constants';
import {
  InfoPage,
  InfoPageHeader,
  InfoCard,
  InfoSection,
  InfoBullets,
  InfoNote,
  InfoContactStrip,
} from '@/components/common/InfoPage';

export default function PrivacyPolicyPage() {
  const { language, t } = useApp();
  const isBn = language === 'bn';

  const highlights = [
    {
      icon: Lock,
      title: isBn ? 'সুরক্ষিত ডেটা' : 'Data Security',
      body: isBn
        ? 'আপনার তথ্য এনক্রিপ্টেড সংযোগে আদান-প্রদান করা হয়।'
        : 'Your data is exchanged over encrypted connections.',
    },
    {
      icon: Megaphone,
      title: isBn ? 'তথ্য বিক্রি নয়' : 'We Never Sell Data',
      body: isBn
        ? 'আমরা কোনো তৃতীয় পক্ষের কাছে আপনার তথ্য বিক্রি করি না।'
        : 'We do not sell your personal data to any third party.',
    },
    {
      icon: UserCheck,
      title: isBn ? 'আপনার নিয়ন্ত্রণ' : 'Your Control',
      body: isBn
        ? 'যেকোনো সময় তথ্য সংশোধন বা মুছে ফেলার অনুরোধ করতে পারেন।'
        : 'You can request correction or deletion of your data at any time.',
    },
  ];

  return (
    <InfoPage>
      <InfoPageHeader
        icon={ShieldCheck}
        title={t.privacyPolicy}
        subtitle={
          isBn
            ? 'আপনার ব্যক্তিগত তথ্য কীভাবে সংগ্রহ, ব্যবহার ও সুরক্ষিত রাখা হয় তা এই নীতিতে ব্যাখ্যা করা হয়েছে।'
            : 'This policy explains what personal information we collect, how we use it, and how we keep it safe.'
        }
        updated={isBn ? 'সর্বশেষ আপডেট: ২৩ সেপ্টেম্বর ২০২৬' : 'Last updated: 23 September 2026'}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {highlights.map(({ icon: Icon, title, body }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-orange flex items-center justify-center">
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-brand-navy mt-3">{title}</h3>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-relaxed">{body}</p>
          </div>
        ))}
      </div>

      <InfoCard>
        <InfoSection title={isBn ? 'আমরা কী তথ্য সংগ্রহ করি' : 'Information We Collect'}>
          <InfoBullets
            items={[
              isBn
                ? 'অর্ডারের জন্য দেওয়া নাম, মোবাইল নম্বর, ইমেইল ও ডেলিভারি ঠিকানা।'
                : 'Name, mobile number, email and delivery address provided for an order.',
              isBn
                ? 'অর্ডার হিস্ট্রি, পছন্দের পণ্য এবং অর্ডার সংক্রান্ত যোগাযোগের রেকর্ড।'
                : 'Order history, preferred products and records of order-related communication.',
              isBn
                ? 'অ্যাকাউন্ট তৈরি করলে লগইন পরিচয় (নাম, মোবাইল/ইমেইল) — পাসওয়ার্ড এনক্রিপ্টেড অবস্থায় সংরক্ষিত হয়।'
                : 'If you create an account, your login identity (name, phone/email) — passwords are stored in encrypted form.',
              isBn
                ? 'ব্রাউজার সংক্রান্ত সাধারণ তথ্য যেমন ডিভাইসের ধরন, আইপি ঠিকানা ও ভিজিট করা পেজ।'
                : 'General browser information such as device type, IP address and pages visited.',
            ]}
          />
        </InfoSection>

        <InfoSection title={isBn ? 'আপনার ব্রাউজারে যা সংরক্ষিত থাকে' : 'What Is Stored in Your Browser'}>
          <p>
            {isBn
              ? 'সাইটটি দ্রুত ও সুবিধাজনক রাখতে আপনার ব্রাউজারের লোকাল স্টোরেজে নিচের তথ্যগুলো সংরক্ষণ করা হয়। এগুলো আপনার নিজের ডিভাইসেই থাকে এবং ব্রাউজার ডেটা মুছে ফেললে মুছে যায়:'
              : 'To keep the site fast and convenient, the following items are stored in your browser’s local storage. They stay on your own device and are removed when you clear your browser data:'}
          </p>
          <InfoBullets
            items={[
              isBn ? 'কার্টের পণ্য ও পরিমাণ।' : 'Cart items and quantities.',
              isBn ? 'পছন্দের তালিকা (উইশলিস্ট)।' : 'Your wishlist.',
              isBn ? 'নির্বাচিত ভাষা (বাংলা / English)।' : 'Your selected language (Bangla / English).',
              isBn ? 'লগইন সেশন টোকেন (লগআউট করলে বা টোকেনের সময় শেষ হলে মুছে যায়)।' : 'Login session token (removed on logout or when the token expires).',
            ]}
          />
        </InfoSection>

        <InfoSection title={isBn ? 'তথ্য কীভাবে ব্যবহার করি' : 'How We Use Your Information'}>
          <InfoBullets
            items={[
              isBn ? 'অর্ডার প্রসেস করা, প্যাকিং করা এবং ডেলিভারি সম্পন্ন করা।' : 'To process, pack and deliver your orders.',
              isBn ? 'অর্ডারের স্ট্যাটাস ও ডেলিভারি আপডেট জানানো।' : 'To notify you about order status and delivery updates.',
              isBn ? 'রিটার্ন, রিফান্ড বা অভিযোগ নিষ্পত্তি করা।' : 'To resolve returns, refunds and complaints.',
              isBn ? 'গ্রাহক সহায়তা দেওয়া এবং আপনার প্রশ্নের উত্তর দেওয়া।' : 'To provide customer support and answer your questions.',
              isBn ? 'প্রতারণামূলক অর্ডার শনাক্ত করা ও সাইটের নিরাপত্তা রক্ষা করা।' : 'To detect fraudulent orders and protect the security of the site.',
              isBn ? 'আপনি সম্মতি দিলে নতুন অফার ও ট্রেন্ডিং পণ্যের আপডেট পাঠানো।' : 'To send offers and trending-product updates, if you have consented.',
            ]}
          />
        </InfoSection>
      </InfoCard>

      <InfoCard>
        <InfoSection title={isBn ? 'কুকিজ ও ট্র্যাকিং' : 'Cookies and Tracking'}>
          <div className="flex items-start gap-2.5">
            <Cookie className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
            <div className="space-y-2">
              <p>
                {isBn
                  ? 'সাইটের প্রয়োজনীয় কার্যকারিতা, ভাষার পছন্দ মনে রাখা এবং ভিজিটর সংখ্যা বুঝতে আমরা কুকি ও লোকাল স্টোরেজ ব্যবহার করি।'
                  : 'We use cookies and local storage for essential site functionality, remembering your language preference, and understanding visitor activity.'}
              </p>
              <p>
                {isBn
                  ? 'এছাড়াও আমরা Facebook Meta Pixel ব্যবহার করি, যা সাইটের ভিজিট, পণ্য দেখা ও অর্ডার সংক্রান্ত ইভেন্ট পরিমাপ করে এবং ভবিষ্যতে প্রাসঙ্গিক বিজ্ঞাপন দেখাতে সাহায্য করে। Meta-এর নিজস্ব গোপনীয়তা নীতি তাদের সংগৃহীত তথ্যের উপর প্রযোজ্য।'
                  : 'We also use the Facebook Meta Pixel, which measures site visits, product views and order events, and helps show relevant ads in the future. Meta’s own privacy policy governs the data it collects.'}
              </p>
              <p>
                {isBn
                  ? 'আপনি চাইলে ব্রাউজার সেটিংস থেকে কুকি বন্ধ বা মুছে ফেলতে পারেন। তবে কুকি বন্ধ করলে কার্ট ও ভাষার পছন্দের মতো সুবিধা কাজ নাও করতে পারে।'
                  : 'You can block or delete cookies from your browser settings. Doing so may disable conveniences such as the saved cart and language preference.'}
              </p>
            </div>
          </div>
        </InfoSection>

        <InfoSection title={isBn ? 'তৃতীয় পক্ষের সাথে তথ্য শেয়ার' : 'Sharing With Third Parties'}>
          <p>
            {isBn
              ? 'আমরা আপনার তথ্য বিক্রি করি না। অর্ডার সম্পন্ন করতে যতটুকু প্রয়োজন কেবল ততটুকু তথ্য নিচের পক্ষগুলোর সাথে শেয়ার করা হয়:'
              : 'We do not sell your data. Only the information needed to complete your order is shared with:'}
          </p>
          <InfoBullets
            items={[
              isBn
                ? 'কুরিয়ার ও ডেলিভারি পার্টনার — শুধু নাম, ঠিকানা ও মোবাইল নম্বর।'
                : 'Courier and delivery partners — name, address and phone number only.',
              isBn
                ? 'পেমেন্ট প্রোভাইডার (বিকাশ, নাগাদ, রকেট, কার্ড প্রসেসর) — লেনদেন নিশ্চিত করার জন্য।'
                : 'Payment providers (bKash, Nagad, Rocket, card processors) — to confirm the transaction.',
              isBn
                ? 'বিশ্লেষণ ও বিজ্ঞাপন সেবা (যেমন Meta Pixel) — সাধারণ ব্যবহারের পরিসংখ্যান ও বিজ্ঞাপন পরিমাপের জন্য।'
                : 'Analytics and advertising services (such as Meta Pixel) — for aggregate usage statistics and ad measurement.',
              isBn
                ? 'আইন অনুযায়ী প্রয়োজন হলে সংশ্লিষ্ট সরকারি কর্তৃপক্ষের সাথে।'
                : 'Relevant government authorities, where required by law.',
            ]}
          />
        </InfoSection>

        <InfoSection title={isBn ? 'ডেটা কতদিন সংরক্ষণ করা হয়' : 'How Long We Keep Data'}>
          <p>
            {isBn
              ? 'অর্ডার ও লেনদেনের রেকর্ড হিসাবরক্ষণ ও ওয়ারেন্টি সাপোর্টের প্রয়োজনে নির্দিষ্ট সময় ধরে সংরক্ষণ করা হয়। অ্যাকাউন্টের তথ্য আপনার অ্যাকাউন্ট সক্রিয় থাকা পর্যন্ত রাখা হয়। আপনি তথ্য মুছে ফেলার অনুরোধ করলে, আইনগতভাবে সংরক্ষণ করা বাধ্যতামূলক নয় — এমন তথ্য মুছে ফেলা হয়।'
              : 'Order and transaction records are kept for the period required for accounting and warranty support. Account data is retained while your account is active. If you ask us to delete your data, everything we are not legally required to keep is removed.'}
          </p>
        </InfoSection>

        <InfoSection title={isBn ? 'ডেটার নিরাপত্তা' : 'Data Security'}>
          <div className="flex items-start gap-2.5">
            <Database className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
            <p>
              {isBn
                ? 'তথ্য আদান-প্রদানে এনক্রিপ্টেড (HTTPS) সংযোগ, পাসওয়ার্ড এনক্রিপশন এবং সীমিত অ্যাকসেস নীতিমালা ব্যবহার করা হয়। তবে ইন্টারনেটে কোনো পদ্ধতিই শতভাগ নিরাপদ নয়, তাই পাসওয়ার্ড কারও সাথে শেয়ার করবেন না।'
                : 'We use encrypted (HTTPS) connections, password hashing and restricted access policies. No method on the internet is completely secure, so please never share your password with anyone.'}
            </p>
          </div>
        </InfoSection>
      </InfoCard>

      <InfoCard>
        <InfoSection title={isBn ? 'আপনার অধিকার' : 'Your Rights'}>
          <InfoBullets
            items={[
              isBn ? 'আপনার সম্পর্কে সংরক্ষিত তথ্য জানতে চাওয়ার অধিকার।' : 'The right to know what data we hold about you.',
              isBn ? 'ভুল তথ্য সংশোধনের অনুরোধ করার অধিকার।' : 'The right to request correction of inaccurate data.',
              isBn ? 'অ্যাকাউন্ট ও ব্যক্তিগত তথ্য মুছে ফেলার অনুরোধ করার অধিকার।' : 'The right to request deletion of your account and personal data.',
              isBn ? 'মার্কেটিং বার্তা বন্ধ করার অনুরোধ করার অধিকার।' : 'The right to opt out of marketing messages.',
            ]}
          />
          <p>
            {isBn
              ? 'এই অধিকারগুলো ব্যবহার করতে হটলাইন বা ইমেইলে আমাদের সাথে যোগাযোগ করুন। আমরা পরিচয় যাচাই করে যত দ্রুত সম্ভব (সাধারণত ৭ কর্মদিবসের মধ্যে) অনুরোধ প্রক্রিয়া করি।'
              : 'To exercise any of these rights, contact us by hotline or email. We verify your identity and act on requests as quickly as possible, usually within 7 business days.'}
          </p>
        </InfoSection>

        <InfoSection title={isBn ? 'শিশুদের গোপনীয়তা' : 'Children’s Privacy'}>
          <p>
            {isBn
              ? 'আমাদের সেবা ১৮ বছরের কম বয়সী গ্রাহকদের জন্য অভিভাবকের সম্মতিতে ব্যবহারের উপযোগী। আমরা জেনে-শুনে শিশুদের কাছ থেকে ব্যক্তিগত তথ্য সংগ্রহ করি না।'
              : 'Our services are intended for use by customers under 18 with the consent of a parent or guardian. We do not knowingly collect personal information from children.'}
          </p>
        </InfoSection>

        <InfoSection title={isBn ? 'নীতির পরিবর্তন' : 'Changes to This Policy'}>
          <p>
            {isBn
              ? 'প্রয়োজনে আমরা এই নীতি হালনাগাদ করতে পারি। উল্লেখযোগ্য পরিবর্তন হলে এই পেজে নতুন আপডেট তারিখসহ জানানো হবে।'
              : 'We may update this policy when needed. Significant changes will be published on this page with a revised update date.'}
          </p>
        </InfoSection>

        <InfoSection title={isBn ? 'আমাদের সাথে যোগাযোগ' : 'Contact Us'}>
          <p>
            {isBn ? 'গোপনীয়তা সংক্রান্ত যেকোনো প্রশ্ন বা অনুরোধে ' : 'For any privacy question or request, please read our '}
            <Link href="/contact-us" className="text-brand-orange font-bold hover:underline">
              {t.contactUs}
            </Link>
            {isBn
              ? ' পেজ থেকে আমাদের সাথে যোগাযোগ করুন, অথবা সরাসরি হটলাইন ও ইমেইলে জানান।'
              : ' page to reach us, or contact us directly by hotline or email.'}
          </p>
          <InfoNote>
            {isBn ? (
              <>
                হটলাইন: <strong>{CONTACT_INFO.hotline}</strong> • ইমেইল: <strong>{CONTACT_INFO.email}</strong> • ঠিকানা:{' '}
                {CONTACT_INFO.address_bn}
              </>
            ) : (
              <>
                Hotline: <strong>{CONTACT_INFO.hotline}</strong> • Email: <strong>{CONTACT_INFO.email}</strong> • Address:{' '}
                {CONTACT_INFO.address_en}
              </>
            )}
          </InfoNote>
        </InfoSection>
      </InfoCard>

      <InfoContactStrip />
    </InfoPage>
  );
}
