'use client';

import useSWR, { mutate } from 'swr';
import type { ReviewStatus } from '@/types';
import type { ApiError } from '@/lib/api/client';
import * as api from '@/lib/api/endpoints';
import type { ProductQuery } from '@/lib/api/endpoints';
import type { ApiAnalytics } from '@/lib/api/types';

/**
 * Every read in the app goes through one of these hooks, so query keys stay
 * consistent and can be invalidated as a group after a mutation.
 *
 * Key namespaces: `products` · `product` · `related` · `categories` ·
 * `reviews` · `orders` · `order` · `delivery` · and `admin` for admin-only
 * reads (so `revalidateAdmin()` can invalidate them all at once).
 *
 * Each hook returns a `refresh()` for retry buttons.
 */

type SwrError = ApiError;

const ADMIN = 'admin';

// ------------------------------------------------------------------ catalog

export function useProducts(
  query: ProductQuery = {},
  options: { enabled?: boolean } = {},
) {
  const enabled = options.enabled ?? true;
  const key = enabled ? (['products', query] as const) : null;
  const { data, error, isLoading, mutate: refresh } = useSWR<
    api.ProductPage,
    SwrError
  >(key, () => api.listProducts(query));

  return {
    products: data?.products ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    isLoading,
    error,
    refresh,
  };
}

export function useProduct(idOrSlug?: string) {
  const { data, error, isLoading, mutate: refresh } = useSWR(
    idOrSlug ? ['product', idOrSlug] : null,
    () => api.getProduct(idOrSlug as string),
  );

  return { product: data, isLoading, error, refresh };
}

export function useRelatedProducts(id?: string, limit = 4) {
  const { data, error, isLoading, mutate: refresh } = useSWR(
    id ? ['related', id, limit] : null,
    () => api.getRelatedProducts(id as string, limit),
  );

  return { products: data ?? [], isLoading, error, refresh };
}

export function useCategories() {
  const { data, error, isLoading, mutate: refresh } = useSWR(
    ['categories'],
    () => api.listCategories(),
  );

  return { categories: data ?? [], isLoading, error, refresh };
}

export function useDeliverySettings() {
  const { data, error, isLoading, mutate: refresh } = useSWR(
    ['delivery'],
    () => api.getDeliverySettings(),
  );

  return { settings: data, isLoading, error, refresh };
}

export function useBanners() {
  const { data, error, isLoading, mutate: refresh } = useSWR(
    ['banners'],
    () => api.listBanners(),
  );

  return { banners: data ?? [], isLoading, error, refresh };
}

export function usePromoSection(options: { enabled?: boolean } = {}) {
  const enabled = options.enabled ?? true;
  const { data, error, isLoading, mutate: refresh } = useSWR(
    enabled ? ['promo'] : null,
    () => api.getPromoSection(),
  );

  return { promo: data, isLoading, error, refresh };
}

// ------------------------------------------------------------------ reviews

export function useStoreReviews(limit = 4) {
  const { data, error, isLoading, mutate: refresh } = useSWR(
    ['reviews', { limit }],
    () => api.listReviews({ limit }),
  );

  return { reviews: data ?? [], isLoading, error, refresh };
}

export function useProductReviews(productId?: string) {
  const { data, error, isLoading, mutate: refresh } = useSWR(
    productId ? ['reviews', { productId }] : null,
    () => api.listReviews({ productId }),
  );

  return { reviews: data ?? [], isLoading, error, refresh };
}

// ------------------------------------------------------------------- orders

export function useOrder(id?: string, options: { refreshInterval?: number } = {}) {
  const { data, error, isLoading, mutate: refresh } = useSWR(
    id ? ['order', id] : null,
    () => api.getOrder(id as string),
    options.refreshInterval ? { refreshInterval: options.refreshInterval } : undefined,
  );

  return { order: data, isLoading, error, refresh };
}

export function useMyOrders(options: { enabled?: boolean } = {}) {
  const enabled = options.enabled ?? true;
  const { data, error, isLoading, mutate: refresh } = useSWR(
    enabled ? ['orders', 'mine'] : null,
    () => api.listMyOrders(),
  );

  return { orders: data ?? [], isLoading, error, refresh };
}

// --------------------------------------------------------------- admin reads

export function useAdminProducts(options: { enabled?: boolean } = {}) {
  const enabled = options.enabled ?? true;
  const { data, error, isLoading, mutate: refresh } = useSWR(
    enabled ? [ADMIN, 'products'] : null,
    () => api.listAdminProducts(),
  );

  return { products: data ?? [], isLoading, error, refresh };
}

export function useAdminOrders(options: { enabled?: boolean } = {}) {
  const enabled = options.enabled ?? true;
  const { data, error, isLoading, mutate: refresh } = useSWR(
    enabled ? [ADMIN, 'orders'] : null,
    () => api.listOrders(),
  );

  return { orders: data ?? [], isLoading, error, refresh };
}

export function useAdminCategories(options: { enabled?: boolean } = {}) {
  const enabled = options.enabled ?? true;
  const { data, error, isLoading, mutate: refresh } = useSWR(
    enabled ? [ADMIN, 'categories'] : null,
    () => api.listAdminCategories(),
  );

  return { categories: data ?? [], isLoading, error, refresh };
}

export function useAdminBanners(options: { enabled?: boolean } = {}) {
  const enabled = options.enabled ?? true;
  const { data, error, isLoading, mutate: refresh } = useSWR(
    enabled ? [ADMIN, 'banners'] : null,
    () => api.listAdminBanners(),
  );

  return { banners: data ?? [], isLoading, error, refresh };
}

export function useAdminCoupons(options: { enabled?: boolean } = {}) {
  const enabled = options.enabled ?? true;
  const { data, error, isLoading, mutate: refresh } = useSWR(
    enabled ? [ADMIN, 'coupons'] : null,
    () => api.listCoupons(),
  );

  return { coupons: data ?? [], isLoading, error, refresh };
}

export function useAdminReviews(
  status?: ReviewStatus,
  options: { enabled?: boolean } = {},
) {
  const enabled = options.enabled ?? true;
  const { data, error, isLoading, mutate: refresh } = useSWR(
    enabled ? [ADMIN, 'reviews', { status }] : null,
    () => api.listAdminReviews({ status }),
  );

  return { reviews: data ?? [], isLoading, error, refresh };
}

export function useAdminAnalytics(options: { enabled?: boolean } = {}) {
  const enabled = options.enabled ?? true;
  const { data, error, isLoading, mutate: refresh } = useSWR<
    ApiAnalytics,
    SwrError
  >(enabled ? [ADMIN, 'analytics'] : null, () => api.getAnalytics());

  return { analytics: data, isLoading, error, refresh };
}

export function useAdminUsers(options: { enabled?: boolean } = {}) {
  const enabled = options.enabled ?? true;
  const { data, error, isLoading, mutate: refresh } = useSWR(
    enabled ? [ADMIN, 'users'] : null,
    () => api.listUsers(),
  );

  return { users: data ?? [], isLoading, error, refresh };
}

// ------------------------------------------------------------- invalidations

/**
 * Revalidation helpers. These use SWR's explicit filter form
 * (`mutate(filter, undefined, { revalidate: true })`), which is the documented
 * way to refresh every key matching a predicate without touching its data.
 */
function revalidateWhere(predicate: (key: unknown) => boolean): Promise<unknown> {
  return mutate(predicate, undefined, { revalidate: true });
}

/** Replaces the admin page's old `triggerRefresh()`. */
export function revalidateAdmin(): Promise<unknown> {
  return revalidateWhere((key) => Array.isArray(key) && key[0] === ADMIN);
}

/** After checkout: stock levels and category counts moved. */
export function revalidateCatalog(): Promise<unknown> {
  return revalidateWhere(
    (key) =>
      Array.isArray(key) &&
      ['products', 'product', 'related', 'categories'].includes(String(key[0])),
  );
}

/** After submitting or moderating a review. */
export function revalidateReviews(): Promise<unknown> {
  return revalidateWhere((key) => Array.isArray(key) && key[0] === 'reviews');
}

/** After a profile change, login or logout. */
export function revalidateSession(): Promise<unknown> {
  return revalidateWhere((key) => Array.isArray(key) && key[0] === 'orders');
}
