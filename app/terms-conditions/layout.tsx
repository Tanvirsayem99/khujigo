import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Terms & Conditions',
  description:
    'The terms and conditions that apply when you use the KhujiGo website, place an order or receive a delivery in Bangladesh.',
  path: '/terms-conditions',
});

export default function TermsConditionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
