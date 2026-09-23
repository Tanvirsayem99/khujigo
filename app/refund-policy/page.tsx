'use client';

import React from 'react';
import Link from 'next/link';
import { RotateCcw, Camera, PackageCheck, Wallet, Truck, Ban } from 'lucide-react';
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

export default function RefundPolicyPage() {
  const { language, t } = useApp();
  const isBn = language === 'bn';

  const steps = [
    {
      icon: Camera,
      title: isBn ? '১. জানান ৪৮ ঘণ্টার মধ্যে' : '1. Report within 48 hours',
      body: isBn
        ? 'পণ্য হাতে পাওয়ার ৪৮ ঘণ্টার মধ্যে হটলাইন বা হোয়াটসঅ্যাপে আমাদের জানান।'
        : 'Let us know by hotline or WhatsApp within 48 hours of receiving the item.',
    },
    {
      icon: PackageCheck,
      title: isBn ? '২. পণ্য ফেরত দিন' : '2. Hand the item back',
      body: isBn
        ? 'আমাদের কুরিয়ার পার্টনার আপনার ঠিকানা থেকে পণ্যটি সংগ্রহ করে নেবে।'
        : 'Our courier partner collects the item from your address.',
    },
    {
      icon: Wallet,
      title: isBn ? '৩. রিফান্ড বুঝে নিন' : '3. Receive your refund',
      body: isBn
        ? 'যাচাই শেষে ৫-৭ কর্মদিবসের মধ্যে আপনার রিফান্ড পাঠিয়ে দেওয়া হবে।'
        : 'After verification your refund is issued within 5-7 business days.',
    },
  ];

  return (
    <InfoPage>
      <InfoPageHeader
        icon={RotateCcw}
        title={t.refundPolicy}
        subtitle={
          isBn
            ? 'পণ্য হাতে পাওয়ার ৭ দিনের মধ্যে সহজ রিটার্ন ও এক্সচেঞ্জ — শর্ত সাপেক্ষে সম্পূর্ণ রিফান্ড।'
            : 'Easy returns and exchanges within 7 days of delivery, with a full refund when eligible.'
        }
        updated={isBn ? 'সর্বশেষ আপডেট: ২৩ সেপ্টেম্বর ২০২৬' : 'Last updated: 23 September 2026'}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {steps.map(({ icon: Icon, title, body }) => (
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
        <InfoSection title={isBn ? 'রিটার্নের সময়সীমা' : 'Return Window'}>
          <p>
            {isBn
              ? 'পণ্য ডেলিভারি পাওয়ার দিন থেকে ৭ দিনের মধ্যে রিটার্নের অনুরোধ জানাতে হবে। ৭ দিন পার হওয়ার পর সাধারণত রিটার্ন গ্রহণ করা হয় না, তবে পণ্যে উৎপাদনগত ত্রুটি থাকলে আমরা আলাদাভাবে বিবেচনা করি।'
              : 'A return request must be raised within 7 days of delivery. Requests after 7 days are generally not accepted, though manufacturing defects are reviewed case by case.'}
          </p>
        </InfoSection>

        <InfoSection title={isBn ? 'রিটার্নের শর্ত' : 'Eligibility Conditions'}>
          <InfoBullets
            items={[
              isBn
                ? 'পণ্যটি অব্যবহৃত, অক্ষত ও সম্পূর্ণ অবস্থায় থাকতে হবে।'
                : 'The product must be unused, undamaged and in complete condition.',
              isBn
                ? 'অরিজিনাল প্যাকেজিং, ট্যাগ, লেবেল ও বক্স অক্ষত থাকতে হবে।'
                : 'Original packaging, tags, labels and the box must be intact.',
              isBn
                ? 'সব ফ্রি অ্যাকসেসরিজ, ম্যানুয়াল ও ওয়ারেন্টি কার্ড ফেরত দিতে হবে।'
                : 'All free accessories, manuals and warranty cards must be returned.',
              isBn
                ? 'ইলেকট্রনিক্স পণ্যের ক্ষেত্রে সিল (seal) ভাঙা থাকলে রিটার্ন গ্রহণযোগ্য নয়, তবে শুধু ডেড অন অ্যারাইভাল (DOA) ক্ষেত্রে প্রযোজ্য।'
                : 'For electronics, a broken seal is not returnable except in dead-on-arrival (DOA) cases.',
              isBn
                ? 'অর্ডার আইডি বা ডেলিভারি স্লিপ প্রদর্শন করতে হবে।'
                : 'You must be able to show the order ID or delivery slip.',
            ]}
          />
        </InfoSection>

        <InfoSection title={isBn ? 'যেসব পণ্য ফেরত নেওয়া হয় না' : 'Non-Returnable Items'}>
          <InfoBullets
            items={[
              isBn ? 'ব্যক্তিগত ব্যবহারের পণ্য যেমন আন্ডারগার্মেন্টস ও ইননারওয়্যার।' : 'Personal-use items such as innerwear and undergarments.',
              isBn ? 'খোলা বা ব্যবহৃত কসমেটিকস, স্কিন কেয়ার ও পার্সোনাল হাইজিন পণ্য।' : 'Opened or used cosmetics, skincare and personal hygiene products.',
              isBn ? 'পচনশীল ও খাদ্যপণ্য (একবার খোলার পর)।' : 'Perishable and food items (once opened).',
              isBn ? 'ডিজিটাল গিফট কার্ড, ই-ভাউচার বা কুপন।' : 'Digital gift cards, e-vouchers and coupons.',
              isBn ? 'গ্রাহকের নির্দেশে কাস্টমাইজ করা পণ্য।' : 'Products customised at the customer’s request.',
              isBn ? 'স্পষ্টভাবে ব্যবহৃত হওয়ার চিহ্ন থাকা ইলেকট্রনিকস বা গ্যাজেট।' : 'Electronics or gadgets showing clear signs of use.',
            ]}
          />
        </InfoSection>

        <InfoSection title={isBn ? 'পণ্য ভাঙা, ভুল বা অনুপস্থিত হলে' : 'Damaged, Wrong or Missing Item'}>
          <p>
            {isBn
              ? 'ডেলিভারির সময় প্যাকেট খুলে পণ্য যাচাই করে নিন। পণ্য ভাঙা, ত্রুটিপূর্ণ বা আপনার অর্ডার করা পণ্য না হলে কুরিয়ার প্রতিনিধির উপস্থিতিতেই জানান, অথবা ৪৮ ঘণ্টার মধ্যে আমাদের হটলাইনে কল করুন।'
              : 'Please check the parcel while the courier is still present. If the item is damaged, defective or different from what you ordered, inform the courier then, or call our hotline within 48 hours.'}
          </p>
          <InfoNote>
            <strong>{isBn ? 'গুরুত্বপূর্ণ:' : 'Important:'} </strong>
            {isBn
              ? 'প্যাকেট খোলার সময় অবশ্যই আনবক্সিং ভিডিও করুন। ভাঙা বা ভুল পণ্যের ক্ষেত্রে দ্রুত সমাধানের জন্য এই ভিডিওটি প্রয়োজন হয়।'
              : 'Please record an unboxing video while opening the parcel. This helps us resolve damaged or wrong-item cases quickly.'}
          </InfoNote>
        </InfoSection>
      </InfoCard>

      <InfoCard>
        <InfoSection title={isBn ? 'রিফান্ড কীভাবে পাবেন' : 'How Refunds Are Issued'}>
          <p>
            {isBn
              ? 'পণ্য আমাদের কাছে পৌঁছানোর পর ২-৩ কর্মদিবসের মধ্যে যাচাই করা হয়। অনুমোদিত হলে নিচের মাধ্যমগুলোতে রিফান্ড পাঠানো হয়:'
              : 'Once the item reaches us it is inspected within 2-3 business days. Approved refunds are sent using one of the following:'}
          </p>
          <InfoBullets
            items={[
              isBn
                ? 'ক্যাশ অন ডেলিভারি অর্ডার: বিকাশ, নাগাদ বা রকেটে রিফান্ড পাঠানো হয়।'
                : 'Cash on Delivery orders: refunded via bKash, Nagad or Rocket.',
              isBn
                ? 'অনলাইন পেমেন্ট (বিকাশ / নাগাদ / রকেট): একই নম্বরে ফেরত দেওয়া হয়।'
                : 'Online payments (bKash / Nagad / Rocket): returned to the same number.',
              isBn
                ? 'কার্ড পেমেন্ট: ৭-১০ কর্মদিবসের মধ্যে ব্যাংক কার্ডে ফেরত হয় (ব্যাংকের নীতির উপর নির্ভরশীল)।'
                : 'Card payments: credited back to the card within 7-10 business days, subject to your bank.',
            ]}
          />
          <p>
            {isBn
              ? 'রিফান্ডে কোনো অতিরিক্ত চার্জ কাটা হয় না। অর্ডারে ব্যবহার করা কুপন রিফান্ডে ফেরত পাওয়া যায় না।'
              : 'No extra charge is deducted from your refund. Coupons used on the order are not refunded.'}
          </p>
        </InfoSection>

        <InfoSection title={isBn ? 'এক্সচেঞ্জ' : 'Exchanges'}>
          <p>
            {isBn
              ? 'ভুল সাইজ বা ভিন্ন রঙের প্রয়োজন হলে ৭ দিনের মধ্যে এক্সচেঞ্জের অনুরোধ করতে পারেন। পণ্য স্টকে না থাকলে আমরা সমমূল্যের পণ্য বা সম্পূর্ণ রিফান্ডের অপশন দেব।'
              : 'If you need a different size or colour, request an exchange within 7 days. If the item is out of stock we will offer an equal-value product or a full refund.'}
          </p>
        </InfoSection>

        <InfoSection title={isBn ? 'রিটার্ন কুরিয়ার চার্জ' : 'Return Courier Charges'}>
          <InfoBullets
            items={[
              isBn
                ? 'আমাদের ভুল বা ত্রুটিপূর্ণ পণ্যের ক্ষেত্রে কুরিয়ার চার্জ KhujiGo বহন করে।'
                : 'If the fault is ours, KhujiGo bears the return courier charge.',
              isBn
                ? 'মন পরিবর্তন করে রিটার্ন করলে রিটার্ন কুরিয়ার চার্জ গ্রাহককে দিতে হবে।'
                : 'If you changed your mind, the return courier charge is paid by the customer.',
            ]}
          />
        </InfoSection>

        <InfoSection title={isBn ? 'অর্ডার বাতিল' : 'Order Cancellation'}>
          <p>
            {isBn
              ? 'পণ্য ডেলিভারির জন্য পাঠানোর আগে পর্যন্ত যেকোনো অর্ডার বাতিল করা যায়। বাতিল করতে অর্ডার আইডি নিয়ে হটলাইন বা হোয়াটসঅ্যাপে যোগাযোগ করুন। ডেলিভারি চার্জ অগ্রিম দেওয়া থাকলে সেটিও সম্পূর্ণ ফেরত দেওয়া হয়।'
              : 'An order can be cancelled any time before it is handed over for delivery. Contact us by hotline or WhatsApp with the order ID. Any delivery-charge advance is fully refunded.'}
          </p>
        </InfoSection>

        <InfoSection title={isBn ? 'যেসব ক্ষেত্রে রিটার্ন গ্রহণ করা হয় না' : 'When a Return May Be Declined'}>
          <div className="flex items-start gap-2.5">
            <Ban className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span>
              {isBn
                ? 'শর্ত পূরণ না হলে, পণ্য ব্যবহৃত বা ক্ষতিগ্রস্ত হলে, অথবা অনুরোধ নির্ধারিত সময়ের পরে এলে রিটার্ন গ্রহণ করা সম্ভব নাও হতে পারে। এমন ক্ষেত্রে আমাদের সাপোর্ট টিম আপনাকে অন্য সমাধানের চেষ্টা করবে।'
                : 'If the conditions are not met, the item is used or damaged, or the request arrives late, a return may not be possible. In such cases our support team will still try to find another solution.'}
            </span>
          </div>
        </InfoSection>

        <InfoSection title={isBn ? 'শর্তাবলি সংক্রান্ত তথ্য' : 'Related Policy'}>
          <p>
            {isBn ? 'রিটার্ন ও রিফান্ডের পাশাপাশি আমাদের ' : 'Alongside returns and refunds, please also read our '}
            <Link href="/terms-conditions" className="text-brand-orange font-bold hover:underline">
              {t.termsConditions}
            </Link>
            {isBn ? ' এবং ' : ' and '}
            <Link href="/privacy-policy" className="text-brand-orange font-bold hover:underline">
              {t.privacyPolicy}
            </Link>
            {isBn ? ' পড়ে নিন।' : '.'}
          </p>
        </InfoSection>
      </InfoCard>

      <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 flex items-start gap-3">
        <Truck className="w-6 h-6 text-brand-orange shrink-0 mt-0.5" />
        <div>
          <h2 className="text-sm sm:text-base font-black text-brand-navy tracking-tight">
            {isBn ? 'রিটার্ন রিকোয়েস্ট করতে' : 'To request a return'}
          </h2>
          <p className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-relaxed">
            {isBn
              ? `অর্ডার আইডি নিয়ে হটলাইন ${CONTACT_INFO.hotline} নম্বরে কল করুন অথবা ${CONTACT_INFO.email} ঠিকানায় ইমেইল করুন। হোয়াটসঅ্যাপে ছবি বা ভিডিও পাঠালে দ্রুত সমাধান পাবেন।`
              : `Call our hotline at ${CONTACT_INFO.hotline} or email ${CONTACT_INFO.email} with your order ID. Sending photos or a video on WhatsApp gets the fastest resolution.`}
          </p>
        </div>
      </div>

      <InfoContactStrip />
    </InfoPage>
  );
}
