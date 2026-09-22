import type {
  AdminRole,
  Banner,
  Category,
  Coupon,
  DeliverySettings,
  ManagedUser,
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  Product,
  PromoSection,
  Review,
  ReviewStatus,
} from '@/types';
import type { CustomerUser } from '@/context/AuthContext';
import { apiRequest } from './client';
import {
  toBanner,
  toBannerPayload,
  toCategory,
  toCategoryPayload,
  toCoupon,
  toCouponPayload,
  toCustomerUser,
  toDeliverySettings,
  toManagedUser,
  toOrder,
  toProduct,
  toProductPayload,
  toPromoSection,
  toReview,
} from './mappers';
import type {
  ApiAdmin,
  ApiAnalytics,
  ApiBanner,
  ApiCategory,
  ApiCoupon,
  ApiCouponValidation,
  ApiCustomer,
  ApiDeliverySettings,
  ApiOrder,
  ApiProduct,
  ApiPromoSection,
  ApiReview,
  ApiUser,
  AuthTokens,
  Paginated,
  ProductSort,
  TokenSubject,
} from './types';

// =========================================================================
// Catalog (public reads)
// =========================================================================

export interface ProductQuery {
  search?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  trending?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  featured?: boolean;
  inStock?: boolean;
  onSale?: boolean;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}

export interface ProductPage {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function listProducts(query: ProductQuery = {}): Promise<ProductPage> {
  const response = await apiRequest<Paginated<ApiProduct>>('/products', {
    query: {
      search: query.search,
      categorySlug: query.categorySlug,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      trending: query.trending,
      bestSeller: query.bestSeller,
      newArrival: query.newArrival,
      featured: query.featured,
      inStock: query.inStock,
      onSale: query.onSale,
      sort: query.sort,
      page: query.page,
      limit: query.limit,
    },
  });

  return {
    products: response.items.map(toProduct),
    total: response.total,
    page: response.page,
    limit: response.limit,
    totalPages: response.totalPages,
  };
}

export async function getProduct(idOrSlug: string): Promise<Product> {
  return toProduct(await apiRequest<ApiProduct>(`/products/${encodeURIComponent(idOrSlug)}`));
}

export async function getRelatedProducts(idOrSlug: string, limit = 4): Promise<Product[]> {
  const products = await apiRequest<ApiProduct[]>(
    `/products/${encodeURIComponent(idOrSlug)}/related`,
    { query: { limit } },
  );
  return products.map(toProduct);
}

export async function listCategories(): Promise<Category[]> {
  const categories = await apiRequest<ApiCategory[]>('/categories');
  return categories.map(toCategory);
}

export async function listAdminCategories(): Promise<Category[]> {
  const categories = await apiRequest<ApiCategory[]>('/categories/admin/all', {
    auth: 'admin',
  });
  return categories.map(toCategory);
}

export async function getDeliverySettings(): Promise<DeliverySettings> {
  return toDeliverySettings(
    await apiRequest<ApiDeliverySettings>('/delivery-settings'),
  );
}

export async function getPromoSection(): Promise<PromoSection> {
  return toPromoSection(await apiRequest<ApiPromoSection>('/promo-section'));
}

/** Active hero banners in display order — what the storefront renders. */
export async function listBanners(): Promise<Banner[]> {
  const banners = await apiRequest<ApiBanner[]>('/banners');
  return banners.map(toBanner);
}

export async function listAdminBanners(): Promise<Banner[]> {
  const banners = await apiRequest<ApiBanner[]>('/banners/admin/all', {
    auth: 'admin',
  });
  return banners.map(toBanner);
}

// =========================================================================
// Reviews
// =========================================================================

export async function listReviews(options: {
  productId?: string;
  limit?: number;
} = {}): Promise<Review[]> {
  const reviews = await apiRequest<ApiReview[]>('/reviews', {
    query: { productId: options.productId, limit: options.limit },
  });
  return reviews.map(toReview);
}

export async function listAdminReviews(options: {
  status?: ReviewStatus;
  limit?: number;
} = {}): Promise<Review[]> {
  const page = await apiRequest<Paginated<ApiReview>>('/reviews/admin/all', {
    auth: 'admin',
    query: { status: options.status, limit: options.limit ?? 100 },
  });
  return page.items.map(toReview);
}

export interface ReviewSubmission {
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
}

/** `optional` auth so a signed-in reviewer's account is recorded when present. */
export async function submitReview(payload: ReviewSubmission): Promise<Review> {
  return toReview(
    await apiRequest<ApiReview>('/reviews', {
      method: 'POST',
      body: payload,
      auth: 'customer',
      optional: true,
    }),
  );
}

export async function setReviewStatus(
  id: string,
  status: ReviewStatus,
): Promise<void> {
  await apiRequest(`/reviews/${encodeURIComponent(id)}/status`, {
    method: 'PATCH',
    body: { status },
    auth: 'admin',
  });
}

export async function deleteReview(id: string): Promise<void> {
  await apiRequest(`/reviews/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    auth: 'admin',
  });
}

// =========================================================================
// Coupons
// =========================================================================

export async function validateCoupon(
  code: string,
  subtotal: number,
): Promise<ApiCouponValidation> {
  return apiRequest<ApiCouponValidation>('/coupons/validate', {
    method: 'POST',
    body: { code, subtotal },
  });
}

export async function listCoupons(): Promise<Coupon[]> {
  const coupons = await apiRequest<ApiCoupon[]>('/coupons', { auth: 'admin' });
  return coupons.map(toCoupon);
}

export async function createCoupon(
  input: Record<string, unknown>,
): Promise<Coupon> {
  return toCoupon(
    await apiRequest<ApiCoupon>('/coupons', {
      method: 'POST',
      body: toCouponPayload(input),
      auth: 'admin',
    }),
  );
}

export async function toggleCoupon(id: string): Promise<Coupon> {
  return toCoupon(
    await apiRequest<ApiCoupon>(`/coupons/${encodeURIComponent(id)}/toggle`, {
      method: 'PATCH',
      auth: 'admin',
    }),
  );
}

export async function deleteCoupon(id: string): Promise<void> {
  await apiRequest(`/coupons/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    auth: 'admin',
  });
}

// =========================================================================
// Orders
// =========================================================================

export interface CheckoutPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  division: string;
  district: string;
  area: string;
  fullAddress: string;
  deliveryNotes?: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  paymentReference?: string;
  items: { productId: string; quantity: number }[];
}

/**
 * Server recomputes every amount; we deliberately send no money fields.
 * `optional` auth so a signed-in buyer's order is attached to their account.
 */
export async function createOrder(payload: CheckoutPayload): Promise<Order> {
  return toOrder(
    await apiRequest<ApiOrder>('/orders', {
      method: 'POST',
      body: payload,
      auth: 'customer',
      optional: true,
    }),
  );
}

export async function getOrder(id: string): Promise<Order> {
  return toOrder(await apiRequest<ApiOrder>(`/orders/${encodeURIComponent(id)}`));
}

export async function listMyOrders(limit = 100): Promise<Order[]> {
  const page = await apiRequest<Paginated<ApiOrder>>('/orders/mine', {
    auth: 'customer',
    query: { limit },
  });
  return page.items.map(toOrder);
}

export interface OrderQuery {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export async function listOrders(query: OrderQuery = {}): Promise<Order[]> {
  const page = await apiRequest<Paginated<ApiOrder>>('/orders', {
    auth: 'admin',
    query: {
      status: query.status,
      paymentStatus: query.paymentStatus,
      search: query.search,
      page: query.page,
      limit: query.limit ?? 100,
    },
  });
  return page.items.map(toOrder);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order> {
  return toOrder(
    await apiRequest<ApiOrder>(`/orders/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      body: { status },
      auth: 'admin',
    }),
  );
}

export async function updateOrderPaymentStatus(
  id: string,
  paymentStatus: PaymentStatus,
): Promise<Order> {
  return toOrder(
    await apiRequest<ApiOrder>(
      `/orders/${encodeURIComponent(id)}/payment-status`,
      { method: 'PATCH', body: { paymentStatus }, auth: 'admin' },
    ),
  );
}

/** Permanently removes a cancelled order (and its items) from the database. */
export async function deleteOrder(id: string): Promise<void> {
  await apiRequest(`/orders/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    auth: 'admin',
  });
}

// =========================================================================
// Admin catalog writes & analytics
// =========================================================================

export async function listAdminProducts(limit = 100): Promise<Product[]> {
  const page = await apiRequest<Paginated<ApiProduct>>('/products/admin/all', {
    auth: 'admin',
    query: { limit },
  });
  return page.items.map(toProduct);
}

export async function createProduct(
  input: Record<string, unknown>,
): Promise<Product> {
  return toProduct(
    await apiRequest<ApiProduct>('/products', {
      method: 'POST',
      body: toProductPayload(input),
      auth: 'admin',
    }),
  );
}

export async function updateProduct(
  id: string,
  input: Record<string, unknown>,
): Promise<Product> {
  return toProduct(
    await apiRequest<ApiProduct>(`/products/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: toProductPayload(input),
      auth: 'admin',
    }),
  );
}

export async function setProductStock(
  id: string,
  stockQuantity: number,
): Promise<Product> {
  return toProduct(
    await apiRequest<ApiProduct>(`/products/${encodeURIComponent(id)}/stock`, {
      method: 'PATCH',
      body: { stockQuantity },
      auth: 'admin',
    }),
  );
}

export async function deleteProduct(id: string): Promise<void> {
  await apiRequest(`/products/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    auth: 'admin',
  });
}

export async function createCategory(
  input: Record<string, unknown>,
): Promise<Category> {
  return toCategory(
    await apiRequest<ApiCategory>('/categories', {
      method: 'POST',
      body: toCategoryPayload(input),
      auth: 'admin',
    }),
  );
}

export async function getAnalytics(): Promise<ApiAnalytics> {
  return apiRequest<ApiAnalytics>('/analytics', { auth: 'admin' });
}

export async function updateDeliverySettings(
  input: Partial<DeliverySettings>,
): Promise<DeliverySettings> {
  return toDeliverySettings(
    await apiRequest<ApiDeliverySettings>('/delivery-settings', {
      method: 'PATCH',
      body: input,
      auth: 'admin',
    }),
  );
}

/** `null` clears a value server-side (e.g. deselecting the coupon). */
export interface PromoSectionUpdate {
  isActive?: boolean;
  couponId?: string | null;
  titleEn?: string | null;
  titleBn?: string | null;
  descriptionEn?: string | null;
  descriptionBn?: string | null;
}

export async function updatePromoSection(
  input: PromoSectionUpdate,
): Promise<PromoSection> {
  return toPromoSection(
    await apiRequest<ApiPromoSection>('/promo-section', {
      method: 'PATCH',
      body: input,
      auth: 'admin',
    }),
  );
}

export async function createBanner(
  input: Record<string, unknown>,
): Promise<Banner> {
  return toBanner(
    await apiRequest<ApiBanner>('/banners', {
      method: 'POST',
      body: toBannerPayload(input),
      auth: 'admin',
    }),
  );
}

export async function updateBanner(
  id: string,
  input: Record<string, unknown>,
): Promise<Banner> {
  return toBanner(
    await apiRequest<ApiBanner>(`/banners/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: toBannerPayload(input),
      auth: 'admin',
    }),
  );
}

export async function deleteBanner(id: string): Promise<void> {
  await apiRequest(`/banners/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    auth: 'admin',
  });
}

// =========================================================================
// Staff / user management (SUPER_ADMIN only)
// =========================================================================

export async function listUsers(): Promise<ManagedUser[]> {
  const users = await apiRequest<ApiUser[]>('/users', { auth: 'admin' });
  return users.map(toManagedUser);
}

export async function updateUserRole(
  id: string,
  role: AdminRole,
): Promise<ManagedUser> {
  return toManagedUser(
    await apiRequest<ApiUser>(`/users/${encodeURIComponent(id)}/role`, {
      method: 'PATCH',
      body: { role },
      auth: 'admin',
    }),
  );
}

// =========================================================================
// Auth — returns raw tokens; the AuthContext owns the session
// =========================================================================

export async function loginCustomer(
  identifier: string,
  password: string,
): Promise<AuthTokens> {
  return apiRequest<AuthTokens>('/auth/customer/login', {
    method: 'POST',
    body: { identifier, password },
  });
}

export async function registerCustomer(input: {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  division?: string;
  district?: string;
}): Promise<AuthTokens> {
  return apiRequest<AuthTokens>('/auth/customer/register', {
    method: 'POST',
    body: input,
  });
}

export async function loginAdmin(
  email: string,
  password: string,
): Promise<AuthTokens> {
  return apiRequest<AuthTokens>('/auth/admin/login', {
    method: 'POST',
    body: { email, password },
  });
}

export async function meCustomer(): Promise<CustomerUser> {
  return toCustomerUser(
    await apiRequest<ApiCustomer>('/auth/customer/me', { auth: 'customer' }),
  );
}

export async function updateMeCustomer(
  input: Partial<CustomerUser>,
): Promise<CustomerUser> {
  return toCustomerUser(
    await apiRequest<ApiCustomer>('/auth/customer/me', {
      method: 'PATCH',
      body: input,
      auth: 'customer',
    }),
  );
}

export async function meAdmin(): Promise<{
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string | null;
}> {
  return apiRequest<ApiAdmin>('/auth/admin/me', { auth: 'admin' });
}

/** Idempotent: revoking an already-dead token is fine. */
export async function revokeRefreshToken(
  subject: TokenSubject,
  refreshToken: string,
): Promise<void> {
  const scope = subject === 'ADMIN' ? 'admin' : 'customer';
  await apiRequest(`/auth/${scope}/logout`, {
    method: 'POST',
    body: { refreshToken },
  });
}
