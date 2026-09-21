import type {Metadata} from 'next';
import './globals.css'; // Global styles
import StorefrontWrapper from '@/components/storefront/StorefrontWrapper';

export const metadata: Metadata = {
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
