import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'All Trending Products',
  description:
    'Explore innovative daily gadgets, lifestyle tech and smart home items at the most attractive prices in Bangladesh. Cash on delivery available across all 64 districts.',
  path: '/shop',
  keywords: [
    'trending products bangladesh',
    'online shop bd',
    'gadgets price in bangladesh',
    'cash on delivery shopping',
  ],
});

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
