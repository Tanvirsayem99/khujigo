import type { Metadata } from 'next';
import { NOINDEX } from '@/lib/seo';

export const metadata: Metadata = { robots: NOINDEX };

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
