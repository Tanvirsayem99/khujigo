import type { Metadata } from 'next';
import { CONTACT_INFO } from '@/lib/constants';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Contact Us',
  description: `Order, delivery, returns or any question — reach KhujiGo by phone, WhatsApp or email. Hotline ${CONTACT_INFO.hotline}, open ${CONTACT_INFO.workingHours_en}.`,
  path: '/contact-us',
  keywords: ['khujigo contact', 'customer support bangladesh', 'order help'],
});

export default function ContactUsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
