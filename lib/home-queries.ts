import type { Banner, Category, PromoSection, Review } from '@/types';
import type { ProductPage, ProductQuery } from '@/lib/api/endpoints';
import { unstable_serialize } from 'swr';

/**
 * The homepage's above-the-fold reads are resolved on the server so the LCP
 * image URL is already in the initial HTML. These query objects are shared by
 * the server loader and the client hooks, so both sides derive the same SWR
 * keys and the client never refetches what the server already sent.
 */
export const HOME_TRENDING_QUERY: ProductQuery = { trending: true, limit: 8 };
export const HOME_FLASH_QUERY: ProductQuery = { onSale: true, limit: 4 };
export const HOME_REVIEWS_LIMIT = 4;

/** `null` means the server read failed and the client hook should fetch it. */
export interface HomeData {
  trending: ProductPage | null;
  flashDeals: ProductPage | null;
  categories: Category[] | null;
  banners: Banner[] | null;
  promo: PromoSection | null;
  reviews: Review[] | null;
}

/** Turns the server payload into the SWR fallback map. */
export function buildHomeFallback(data: HomeData): Record<string, unknown> {
  const fallback: Record<string, unknown> = {};

  if (data.trending) {
    fallback[unstable_serialize(['products', HOME_TRENDING_QUERY])] = data.trending;
  }
  if (data.flashDeals) {
    fallback[unstable_serialize(['products', HOME_FLASH_QUERY])] = data.flashDeals;
  }
  if (data.categories) {
    fallback[unstable_serialize(['categories'])] = data.categories;
  }
  if (data.banners) {
    fallback[unstable_serialize(['banners'])] = data.banners;
  }
  if (data.promo) {
    fallback[unstable_serialize(['promo'])] = data.promo;
  }
  if (data.reviews) {
    fallback[unstable_serialize(['reviews', { limit: HOME_REVIEWS_LIMIT }])] = data.reviews;
  }

  return fallback;
}
