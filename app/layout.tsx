import type {Metadata, Viewport} from 'next';
import './globals.css'; // Global styles
import StorefrontWrapper from '@/components/storefront/StorefrontWrapper';

// `viewportFit: 'cover'` is required for env(safe-area-inset-*) to be non-zero on iOS.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FF6A00',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'KhujiGo - খুঁজে নিন ট্রেন্ডিং সবকিছু!',
  description: 'KhujiGo is a modern Bangladeshi e-commerce platform where customers can discover trending, useful, unique, and interesting products and order them online.',
  openGraph: {
    title: 'KhujiGo - খুঁজে নিন ট্রেন্ডিং সবকিছু!',
    description: 'KhujiGo is a modern Bangladeshi e-commerce platform where customers can discover trending, useful, unique, and interesting products and order them online.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KhujiGo - খুঁজে নিন ট্রেন্ডিং সবকিছু!',
    description: 'KhujiGo is a modern Bangladeshi e-commerce platform where customers can discover trending, useful, unique, and interesting products and order them online.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-[#FFF9F2] text-[#07111F] antialiased">
        <StorefrontWrapper>{children}</StorefrontWrapper>
      </body>
    </html>
  );
}
