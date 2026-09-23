import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Browse Categories',
  description:
    'Pick a category to explore its trending products — gadgets, lifestyle, home essentials and more, all with cash on delivery across Bangladesh.',
  path: '/categories',
  keywords: ['shop by category', 'product categories bangladesh', 'khujigo categories'],
});

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
