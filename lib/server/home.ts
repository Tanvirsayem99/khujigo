import {
  getPromoSection,
  listBanners,
  listCategories,
  listProducts,
  listReviews,
} from '@/lib/api/endpoints';
import { toProductSummaryPage } from '@/lib/api/mappers';
import {
  HOME_FLASH_QUERY,
  HOME_REVIEWS_LIMIT,
  HOME_TRENDING_QUERY,
  type HomeData,
} from '@/lib/home-queries';

/**
 * Every read is attempted independently. A single failing request degrades that
 * one section (the client hook fetches it instead) rather than failing the whole
 * render — which also keeps a slow/down API from breaking `next build`.
 */
async function load<T>(label: string, request: () => Promise<T>): Promise<T | null> {
  try {
    return await request();
  } catch (error) {
    console.error(`[home] could not load ${label}`, error);
    return null;
  }
}

/**
 * Everything the homepage needs before its first paint, fetched in parallel.
 * Listings are narrowed to card fields here so the product descriptions and
 * specs stay on the server (~22 KB less data in the HTML and in the props the
 * client has to hydrate).
 */
export async function getHomeData(): Promise<HomeData> {
  const [trending, flashDeals, categories, banners, promo, reviews] = await Promise.all([
    load('trending products', async () => toProductSummaryPage(await listProducts(HOME_TRENDING_QUERY))),
    load('flash deals', async () => toProductSummaryPage(await listProducts(HOME_FLASH_QUERY))),
    load('categories', () => listCategories()),
    load('banners', () => listBanners()),
    load('promo section', () => getPromoSection()),
    load('reviews', () => listReviews({ limit: HOME_REVIEWS_LIMIT })),
  ]);

  return { trending, flashDeals, categories, banners, promo, reviews };
}
