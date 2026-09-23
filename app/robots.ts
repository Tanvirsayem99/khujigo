import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

/**
 * Private, ephemeral or duplicate-summary routes. These are also marked
 * `noindex` in their own layouts — the disallow stops the crawl, the meta tag
 * stops the index.
 */
const DISALLOWED_PATHS = [
  '/admin',
  '/admin-login',
  '/account',
  '/cart',
  '/checkout',
  '/wishlist',
  '/login',
  '/register',
  '/forgot-password',
  '/order-success',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOWED_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
