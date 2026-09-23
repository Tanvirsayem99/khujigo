import type {Metadata, Viewport} from 'next';
import Script from 'next/script';
import './globals.css'; // Global styles
import StorefrontWrapper from '@/components/storefront/StorefrontWrapper';
import {
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_TITLE,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
  SITE_URL,
  jsonLd,
  organizationJsonLd,
  websiteJsonLd,
} from '@/lib/seo';

// `viewportFit: 'cover'` is required for env(safe-area-inset-*) to be non-zero on iOS.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#FF6A00',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_DEFAULT_TITLE,
    // Pages export a bare title and get "… | KhujiGo" appended.
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'shopping',
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    url: SITE_URL,
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  // Only emitted once a token is configured in the deploy environment.
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
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
        {/* Site-wide structured data: who we are, and the site-level search action. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(organizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(websiteJsonLd()) }}
        />
        <StorefrontWrapper>{children}</StorefrontWrapper>
      </body>
    </html>
  );
}
