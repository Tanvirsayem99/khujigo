import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'About Us',
  description:
    'KhujiGo is a modern Bangladeshi e-commerce platform bringing trending, useful and unique products together — 100% original items, fast nationwide delivery and easy 7-day returns.',
  path: '/about-us',
  keywords: ['about khujigo', 'bangladeshi ecommerce platform', 'online shop in bangladesh'],
});

export default function AboutUsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
