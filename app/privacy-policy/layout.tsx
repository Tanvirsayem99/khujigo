import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'How KhujiGo collects, uses, stores and protects your personal information when you browse the store or place an order.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
