import type { MetadataRoute } from 'next';
import { SITE_URL, getAllProductsForSeo } from '@/lib/seo';

/** Regenerated hourly so new products appear without a redeploy. */
export const revalidate = 3600;

type ChangeFrequency = MetadataRoute.Sitemap[number]['changeFrequency'];

const STATIC_PAGES: {
  path: string;
  priority: number;
  changeFrequency: ChangeFrequency;
}[] = [
  { path: '/', priority: 1, changeFrequency: 'daily' },
  { path: '/shop', priority: 0.9, changeFrequency: 'daily' },
  { path: '/categories', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/about-us', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/contact-us', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/refund-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/privacy-policy', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/terms-conditions', priority: 0.3, changeFrequency: 'yearly' },
];

function toDate(value?: string | null): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((page) => ({
    url: `${SITE_URL}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));

  // A dead API degrades to the static pages rather than failing the build.
  const products = await getAllProductsForSeo();

  const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.slug}`,
    lastModified: toDate(product.createdAt) ?? now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticEntries, ...productEntries];
}
