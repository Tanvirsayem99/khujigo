import type {Metadata, Viewport} from 'next';
import Script from 'next/script';
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
      <head>
        {/* Meta Pixel Code */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1471809464847775');
fbq('track', 'PageView');`}
        </Script>
        {/* End Meta Pixel Code */}
      </head>
      <body suppressHydrationWarning className="bg-[#FFF9F2] text-[#07111F] antialiased">
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{display: 'none'}}
            alt=""
            src="https://www.facebook.com/tr?id=1471809464847775&ev=PageView&noscript=1"
          />
        </noscript>
        <StorefrontWrapper>{children}</StorefrontWrapper>
      </body>
    </html>
  );
}
