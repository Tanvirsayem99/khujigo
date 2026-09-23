import type { Metadata } from 'next';
import { NOINDEX } from '@/lib/seo';

/** Cart contents are per-visitor — nothing here is useful to a crawler. */
export const metadata: Metadata = { robots: NOINDEX };

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
