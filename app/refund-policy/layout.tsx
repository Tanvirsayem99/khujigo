import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Refund & Return Policy',
  description:
    'KhujiGo refund, return and exchange policy — 7-day hassle-free returns on eligible products, with delivery across all 64 districts of Bangladesh.',
  path: '/refund-policy',
  keywords: ['return policy', 'refund policy bangladesh', 'product exchange'],
});

export default function RefundPolicyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
