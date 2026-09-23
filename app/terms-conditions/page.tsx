'use client';

import React from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';
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

export default function TermsConditionsPage() {
  const { language, t } = useApp();
  const isBn = language === 'bn';

  const deliveryRows = [
    {
      area: isBn ? 'ঢাকার ভিতরে' : 'Inside Dhaka',
      charge: formatBDT(DEFAULT_DELIVERY_RATES.insideDhaka, isBn),
      time: isBn ? '১-২ দিন' : DEFAULT_DELIVERY_RATES.estimatedDaysInsideDhaka,
    },
    {
      area: isBn ? 'ঢাকার বাইরে' : 'Outside Dhaka',
      charge: formatBDT(DEFAULT_DELIVERY_RATES.outsideDhaka, isBn),
      time: isBn ? '২-৪ দিন' : DEFAULT_DELIVERY_RATES.estimatedDaysOutsideDhaka,
    },
    {
      area: isBn
        ? `${formatBDT(DEFAULT_DELIVERY_RATES.freeDeliveryThreshold, isBn)} বা তার বেশি অর্ডারে`
        : `Orders above ${formatBDT(DEFAULT_DELIVERY_RATES.freeDeliveryThreshold)}`,
      charge: isBn ? 'ফ্রি' : 'Free',
      time: isBn ? '২-৪ দিন' : '2-4 Days',
    },
  ];

  return (
    <InfoPage>
      <InfoPageHeader
        icon={FileText}
        title={t.termsConditions}
        subtitle={
          isBn
            ? 'KhujiGo থেকে কেনাকাটা করার আগে অনুগ্রহ করে আমাদের সেবার শর্তাবলি পড়ে নিন।'
            : 'Please read the terms of service below before ordering from KhujiGo.'
        }
        updated={isBn ? 'সর্বশেষ আপডেট: ২৩ সেপ্টেম্বর ২০২৬' : 'Last updated: 23 September 2026'}
      />

      <InfoCard>
        <InfoSection title={isBn ? '১. শর্তাবলি গ্রহণ' : '1. Acceptance of Terms'}>
          <p>
            {isBn
              ? 'KhujiGo ওয়েবসাইট ব্যবহার করে বা এখান থেকে অর্ডার করে আপনি এই শর্তাবলির সাথে সম্মত হচ্ছেন। আপনি যদি এই শর্তাবলির সাথে একমত না হন, অনুগ্রহ করে ওয়েবসাইটটি ব্যবহার করা থেকে বিরত থাকুন।'
              : 'By using the KhujiGo website or placing an order, you agree to these terms and conditions. If you do not agree, please do not use the website.'}
          </p>
          <p>
            {isBn
              ? 'আমরা যেকোনো সময় এই শর্তাবলি পরিবর্তন করার অধিকার রাখি। পরিবর্তিত শর্তাবলি এই পেজে প্রকাশ করার পর থেকেই কার্যকর হবে।'
              : 'We may update these terms at any time. Changes take effect as soon as they are published on this page.'}
          </p>
        </InfoSection>

        <InfoSection title={isBn ? '২. অ্যাকাউন্ট ও তথ্যের সঠিকতা' : '2. Account and Accuracy of Information'}>
          <InfoBullets
            items={[
              isBn
                ? 'অ্যাকাউন্ট তৈরি করার সময় সঠিক নাম, মোবাইল নম্বর ও ইমেইল দেওয়ার দায়িত্ব আপনার।'
                : 'You are responsible for providing an accurate name, phone number and email when creating an account.',
              isBn
                ? 'অর্ডারে দেওয়া ঠিকানা ও মোবাইল নম্বর সঠিক না হলে ডেলিভারি ব্যর্থ হতে পারে এবং সেক্ষেত্রে অতিরিক্ত চার্জ প্রযোজ্য হতে পারে।'
                : 'If the address or phone number on the order is incorrect, delivery may fail and an additional charge may apply.',
              isBn
                ? 'আপনার অ্যাকাউন্টের পাসওয়ার্ড গোপন রাখার দায়িত্ব আপনার।'
                : 'You are responsible for keeping your account password confidential.',
              isBn
                ? 'মিথ্যা বা প্রতারণামূলক অর্ডার শনাক্ত হলে আমরা অ্যাকাউন্ট ব্লক করার অধিকার রাখি।'
                : 'We reserve the right to block accounts involved in fraudulent or fake orders.',
            ]}
          />
        </InfoSection>

        <InfoSection title={isBn ? '৩. অর্ডার ও দাম' : '3. Orders and Pricing'}>
          <InfoBullets
            items={[
              isBn
                ? 'সব দাম বাংলাদেশি টাকায় (৳) উল্লেখ করা হয় এবং প্রযোজ্য ক্ষেত্রে ভ্যাট/কর অন্তর্ভুক্ত।'
                : 'All prices are shown in Bangladeshi Taka (৳) and include applicable VAT/tax where relevant.',
              isBn
                ? 'পণ্যের দাম, স্টক ও অফার যেকোনো সময় পরিবর্তন হতে পারে।'
                : 'Prices, stock and offers may change at any time.',
              isBn
                ? 'ভুল দাম বা ভুল তথ্যের কারণে কোনো অর্ডার বাতিল করা হলে আমরা সম্পূর্ণ পেমেন্ট ফেরত দেব।'
                : 'If an order is cancelled because of a pricing or listing error, we will refund any payment in full.',
              isBn
                ? 'স্টক শেষ হলে অর্ডারটি বাতিল হয়ে যায় এবং অগ্রিম পেমেন্ট থাকলে সম্পূর্ণ ফেরত দেওয়া হয়।'
                : 'Orders are cancelled when an item goes out of stock; any advance payment is fully refunded.',
            ]}
          />
        </InfoSection>

        <InfoSection title={isBn ? '৪. পেমেন্ট মাধ্যম' : '4. Payment Methods'}>
          <p>
            {isBn
              ? 'আমরা নিচের পেমেন্ট মাধ্যমগুলো গ্রহণ করি। অনলাইন পেমেন্টে অর্ডার নিশ্চিত করার আগে পেমেন্ট সম্পন্ন করতে হয়।'
              : 'We accept the following payment methods. For online payments, payment must be completed before the order is confirmed.'}
          </p>
          <InfoBullets
            items={[
              isBn ? 'ক্যাশ অন ডেলিভারি (COD) — সারা বাংলাদেশে।' : 'Cash on Delivery (COD) — nationwide.',
              isBn ? 'বিকাশ, নাগাদ ও রকেট মোবাইল ব্যাংকিং।' : 'bKash, Nagad and Rocket mobile banking.',
              isBn ? 'ভিসা / মাস্টারকার্ড।' : 'Visa / Mastercard.',
            ]}
          />
          <InfoNote>
            {isBn
              ? 'কিছু ক্ষেত্রে ডেলিভারি চার্জ অগ্রিম পরিশোধ করতে হতে পারে, বিশেষ করে ঢাকার বাইরে কুরিয়ার রিস্ক কমাতে। এই চার্জ অর্ডার বাতিল হলে সম্পূর্ণ ফেরত দেওয়া হয়।'
              : 'In some cases the delivery charge must be paid in advance, especially outside Dhaka, to reduce courier risk. This amount is fully refunded if the order is cancelled.'}
          </InfoNote>
        </InfoSection>
      </InfoCard>

      <InfoCard>
        <InfoSection title={isBn ? '৫. ডেলিভারি' : '5. Delivery'}>
          <div className="overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full text-left text-[11px] sm:text-xs">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-3 py-2.5 font-bold">{isBn ? 'ডেলিভারি এলাকা' : 'Delivery Area'}</th>
                  <th className="px-3 py-2.5 font-bold">{isBn ? 'চার্জ' : 'Charge'}</th>
                  <th className="px-3 py-2.5 font-bold">{isBn ? 'সময়' : 'Time'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-brand-navy">
                {deliveryRows.map((row) => (
                  <tr key={row.area}>
                    <td className="px-3 py-2.5">{row.area}</td>
                    <td className="px-3 py-2.5 font-bold">{row.charge}</td>
                    <td className="px-3 py-2.5">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            {isBn
              ? 'ডেলিভারির সময়সীমা কুরিয়ার ও আবহাওয়ার উপর নির্ভরশীল। অনুগ্রহ করে ডেলিভারির সময় মোবাইল নম্বর চালু রাখুন।'
              : 'Delivery timelines depend on the courier and weather conditions. Please keep the phone number reachable at the time of delivery.'}
          </p>
        </InfoSection>

        <InfoSection title={isBn ? '৬. অর্ডার বাতিল ও রিটার্ন' : '6. Cancellation and Returns'}>
          <p>
            {isBn
              ? 'ডেলিভারির জন্য পাঠানোর আগে পর্যন্ত যেকোনো অর্ডার বাতিল করা যাবে। রিটার্ন ও রিফান্ডের সম্পূর্ণ নিয়ম জানতে আমাদের '
              : 'An order can be cancelled any time before dispatch. For complete return and refund rules, please read our '}
            <Link href="/refund-policy" className="text-brand-orange font-bold hover:underline">
              {t.refundPolicy}
            </Link>
            {isBn ? ' পড়ে নিন।' : '.'}
          </p>
        </InfoSection>
      </InfoCard>

      <InfoCard>
        <InfoSection title={isBn ? '৭. পণ্যের তথ্য ও ছবি' : '7. Product Information and Images'}>
          <p>
            {isBn
              ? 'আমরা পণ্যের বিবরণ ও ছবি যথাসম্ভব সঠিকভাবে প্রকাশ করার চেষ্টা করি। তবে স্ক্রিন সেটিংসের কারণে ছবির রঙ আসল পণ্যের সাথে সামান্য ভিন্ন হতে পারে। হাতের তৈরি বা ইমপোর্টেড পণ্যের ক্ষেত্রে সাইজ ও ওজনে ছোট পার্থক্য থাকতে পারে।'
              : 'We try to describe products and display images as accurately as possible. Colour may vary slightly from the actual product due to screen settings, and handmade or imported items may differ marginally in size and weight.'}
          </p>
        </InfoSection>

        <InfoSection title={isBn ? '৮. মেধাস্বত্ব' : '8. Intellectual Property'}>
          <p>
            {isBn
              ? 'এই ওয়েবসাইটের লোগো, লেখা, ডিজাইন, ছবি এবং কনটেন্ট KhujiGo-এর সম্পত্তি। লিখিত অনুমতি ছাড়া কোনো অংশ কপি, পুনঃপ্রকাশ বা বাণিজ্যিকভাবে ব্যবহার করা যাবে না।'
              : 'The logo, text, design, images and content of this website belong to KhujiGo. No part may be copied, republished or used commercially without written permission.'}
          </p>
        </InfoSection>

        <InfoSection title={isBn ? '৯. নিষিদ্ধ ব্যবহার' : '9. Prohibited Use'}>
          <InfoBullets
            items={[
              isBn ? 'প্রতারণামূলক বা ভুয়া অর্ডার দেওয়া।' : 'Placing fraudulent or fake orders.',
              isBn ? 'ওয়েবসাইটের নিরাপত্তা ব্যবস্থা ভাঙার চেষ্টা করা।' : 'Attempting to breach the website’s security.',
              isBn ? 'স্বয়ংক্রিয় স্ক্রিপ্ট দিয়ে ডেটা সংগ্রহ করা।' : 'Scraping data with automated scripts.',
              isBn ? 'অন্য কারো পরিচয়ে অর্ডার করা বা অ্যাকাউন্ট ব্যবহার করা।' : 'Ordering or using an account under someone else’s identity.',
            ]}
          />
        </InfoSection>

        <InfoSection title={isBn ? '১০. দায়বদ্ধতার সীমা' : '10. Limitation of Liability'}>
          <p>
            {isBn
              ? 'কুরিয়ার পার্টনারের বিলম্ব, প্রাকৃতিক দুর্যোগ বা আমাদের নিয়ন্ত্রণের বাইরের কারণে সৃষ্ট ক্ষতির জন্য KhujiGo দায়ী থাকবে না। আমাদের সর্বোচ্চ দায় সংশ্লিষ্ট অর্ডারের মূল্য পর্যন্ত সীমাবদ্ধ।'
              : 'KhujiGo is not liable for losses caused by courier delays, natural disasters or events beyond our control. Our maximum liability is limited to the value of the relevant order.'}
          </p>
        </InfoSection>

        <InfoSection title={isBn ? '১১. প্রযোজ্য আইন' : '11. Governing Law'}>
          <p>
            {isBn
              ? 'এই শর্তাবলি বাংলাদেশের প্রচলিত আইন দ্বারা পরিচালিত হবে। যেকোনো বিরোধ বন্ধুত্বপূর্ণ আলোচনার মাধ্যমে নিষ্পত্তির চেষ্টা করা হবে।'
              : 'These terms are governed by the laws of Bangladesh. Any dispute will first be addressed through amicable discussion.'}
          </p>
        </InfoSection>

        <InfoSection title={isBn ? '১২. যোগাযোগ' : '12. Contact'}>
          <p>
            {isBn
              ? `এই শর্তাবলি সংক্রান্ত যেকোনো প্রশ্নে হটলাইন ${CONTACT_INFO.hotline} নম্বরে কল করুন, হোয়াটসঅ্যাপ করুন অথবা ${CONTACT_INFO.email} ঠিকানায় ইমেইল করুন।`
              : `For any question about these terms, call our hotline at ${CONTACT_INFO.hotline}, message us on WhatsApp, or email ${CONTACT_INFO.email}.`}
          </p>
        </InfoSection>
      </InfoCard>

      <InfoContactStrip />
    </InfoPage>
  );
}
