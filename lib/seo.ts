import type { Metadata } from 'next';
import { CONTACT_INFO } from '@/lib/constants';
import { API_BASE_URL } from '@/lib/api/client';
import type { ApiCategory, ApiProduct, Paginated } from '@/lib/api/types';

/**
 * Server-only SEO config + helpers.
 *
 * Imported by `metadata` / `generateMetadata`, `robots.ts`, `sitemap.ts`,
 * `manifest.ts` and the JSON-LD blocks in route layouts. Never import this from
 * a `'use client'` module — it reads the API directly on the server.
 */

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.khujigo.shop';

/** Canonical origin for the storefront, without a trailing slash. */
export const SITE_URL = RAW_SITE_URL.replace(/\/+$/, '');

export const SITE_NAME = 'KhujiGo';
export const SITE_LOCALE = 'bn_BD';
export const SITE_LANGUAGE = 'bn-BD';

export const SITE_DEFAULT_TITLE = 'KhujiGo - খুঁজে নিন ট্রেন্ডিং সবকিছু!';
export const SITE_DEFAULT_DESCRIPTION =
  'KhujiGo is a modern Bangladeshi online shop where you can discover trending, useful and unique products and order them online with cash on delivery across all 64 districts.';

export const SITE_KEYWORDS = [
  'KhujiGo',
  'khujigo.shop',
  'online shopping bangladesh',
  'ecommerce bangladesh',
  'cash on delivery',
  'trending products',
  'অনলাইন শপিং',
  'ট্রেন্ডিং পণ্য',
];

/** Shared `robots` block for pages that must stay out of the index. */
export const NOINDEX = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
} as const;

// ------------------------------------------------------------------- helpers

export function absoluteUrl(path = '/'): string {
  return new URL(path, `${SITE_URL}/`).toString();
}

/** Collapses whitespace and trims to a length search engines will display. */
export function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trimEnd()}…`;
}

/** `JSON.stringify` with `<` escaped so a description can't close the script tag. */
export function jsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/**
 * Builds the metadata block for a static page: canonical URL plus matching
 * Open Graph and Twitter tags. `title` is composed with the root template.
 */
export function pageMetadata(input: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  images?: string[];
  noindex?: boolean;
}): Metadata {
  const { title, description, path, keywords, images, noindex } = input;

  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical: path },
    ...(noindex ? { robots: NOINDEX } : {}),
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      url: absoluteUrl(path),
      title,
      description,
      ...(images?.length ? { images: images.map((url) => ({ url })) } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(images?.length ? { images } : {}),
    },
  };
}

// ------------------------------------------------------------ server fetches

const API_BASE = API_BASE_URL.replace(/\/+$/, '');
const REVALIDATE_SECONDS = 3600;
const REQUEST_TIMEOUT_MS = 8000;
/** Upper bound on sitemap pagination so a bad `totalPages` can't loop forever. */
const MAX_SITEMAP_PAGES = 50;

/** Returns `null` instead of throwing so a dead API can't break a build. */
async function apiGet<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export function getProductForSeo(slug: string): Promise<ApiProduct | null> {
  return apiGet<ApiProduct>(`/products/${encodeURIComponent(slug)}`);
}

export function getCategoriesForSeo(): Promise<ApiCategory[] | null> {
  return apiGet<ApiCategory[]>('/categories');
}

/** Every publicly listed product, paginated through the public catalog. */
export async function getAllProductsForSeo(): Promise<ApiProduct[]> {
  const first = await apiGet<Paginated<ApiProduct>>('/products?page=1&limit=100');
  if (!first?.items) return [];

  const products = [...first.items];
  const lastPage = Math.min(first.totalPages || 1, MAX_SITEMAP_PAGES);

  for (let page = 2; page <= lastPage; page += 1) {
    const next = await apiGet<Paginated<ApiProduct>>(`/products?page=${page}&limit=100`);
    if (!next?.items?.length) break;
    products.push(...next.items);
  }

  return products;
}

// -------------------------------------------------------------- structured data

export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DEFAULT_DESCRIPTION,
    logo: absoluteUrl('/icon.svg'),
    image: absoluteUrl('/icon.svg'),
    email: CONTACT_INFO.email,
    telephone: `+${CONTACT_INFO.whatsapp}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT_INFO.address_en,
      addressLocality: 'Dhaka',
      addressCountry: 'BD',
    },
    areaServed: 'BD',
    sameAs: [CONTACT_INFO.facebookUrl],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: `+${CONTACT_INFO.whatsapp}`,
        contactType: 'customer service',
        areaServed: 'BD',
        availableLanguage: ['bn', 'en'],
      },
    ],
  };
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DEFAULT_DESCRIPTION,
    inLanguage: SITE_LANGUAGE,
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/shop?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function productJsonLd(product: ApiProduct): Record<string, unknown> {
  const url = absoluteUrl(`/products/${product.slug}`);
  const images = [product.thumbnailUrl, ...(product.galleryUrls ?? [])].filter(Boolean);

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.nameEn,
    description: truncate(
      product.seoDescription ||
        product.shortDescEn ||
        product.descriptionEn ||
        product.nameEn,
      500,
    ),
    sku: product.sku,
    url,
    image: images,
    brand: { '@type': 'Brand', name: product.brand || SITE_NAME },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'BDT',
      price: product.price,
      availability:
        product.stockQuantity > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': `${SITE_URL}/#organization` },
    },
  };

  if (product.category?.nameEn) {
    data.category = product.category.nameEn;
  }

  // Only emit a rating when there is at least one review behind it.
  if (product.reviewsCount > 0 && product.rating > 0) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewsCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return data;
}

export function breadcrumbJsonLd(
  trail: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
