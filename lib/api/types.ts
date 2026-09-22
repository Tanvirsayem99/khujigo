import type {
  AdminRole,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ProductStatus,
  ReviewStatus,
  UserKind,
} from '@/types';

/**
 * camelCase shapes returned by the KhujiGo API. Kept separate from
 * `types/index.ts` (which is snake_case, as the components expect) — see
 * `mappers.ts` for the translation.
 */

export type TokenSubject = 'CUSTOMER' | 'ADMIN';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
  tokenType: TokenSubject;
  user: ApiCustomer | ApiAdmin;
}

export interface ApiCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  division?: string | null;
  district?: string | null;
  area?: string | null;
  address?: string | null;
  createdAt?: string;
}

export interface ApiAdmin {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: AdminRole;
  avatarUrl?: string | null;
  createdAt?: string;
}

export interface ApiUser {
  id: string;
  kind: UserKind;
  name: string;
  email: string;
  phone?: string | null;
  role: AdminRole | null;
  avatarUrl?: string | null;
  createdAt?: string;
}

export interface ApiCategorySummary {
  id: string;
  nameEn: string;
  nameBn: string;
  slug: string;
}

export interface ApiCategory extends ApiCategorySummary {
  descriptionEn: string | null;
  descriptionBn: string | null;
  imageUrl: string;
  icon: string | null;
  displayOrder: number;
  isActive: boolean;
  productCount: number;
}

export interface ApiSpecification {
  keyEn: string;
  keyBn: string;
  valueEn: string;
  valueBn: string;
}

export interface ApiProduct {
  id: string;
  nameEn: string;
  nameBn: string;
  slug: string;
  sku: string;
  categoryId: string;
  category?: ApiCategorySummary;
  brand: string;
  shortDescEn: string;
  shortDescBn: string;
  descriptionEn: string;
  descriptionBn: string;
  price: number;
  comparePrice: number | null;
  discountPercent: number | null;
  stockQuantity: number;
  lowStockThreshold: number;
  thumbnailUrl: string;
  galleryUrls: string[];
  status: ProductStatus;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  rating: number;
  reviewsCount: number;
  specifications: ApiSpecification[];
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: string;
}

export interface ApiOrderItem {
  id?: string;
  orderId?: string;
  productId: string | null;
  nameEn: string;
  nameBn: string;
  thumbnailUrl: string;
  price: number;
  quantity: number;
  total: number;
}

export interface ApiOrder {
  id: string;
  customerId?: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  division: string;
  district: string;
  area: string;
  fullAddress: string;
  deliveryNotes: string | null;
  items: ApiOrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  couponCode: string | null;
  paymentReference: string | null;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApiReview {
  id: string;
  productId: string;
  customerId?: string | null;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
}

export interface ApiCoupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  expiryDate: string;
  isActive: boolean;
}

export interface ApiBanner {
  id: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  buttonTextEn: string;
  buttonTextBn: string;
  buttonUrl: string;
  imageUrl: string;
  badgeEn: string | null;
  badgeBn: string | null;
  displayOrder: number;
  isActive: boolean;
}

export interface ApiPromoSection {
  id: string;
  isActive: boolean;
  couponId: string | null;
  titleEn: string | null;
  titleBn: string | null;
  descriptionEn: string | null;
  descriptionBn: string | null;
  coupon: ApiCoupon | null;
}

export interface ApiDeliverySettings {
  id: string;
  insideDhaka: number;
  outsideDhaka: number;
  freeDeliveryThreshold: number;
  estimatedDaysInsideDhaka: string;
  estimatedDaysOutsideDhaka: string;
}

export interface ApiAnalytics {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  deliveredOrders: number;
  lowStockCount: number;
  averageOrderValue: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Why a coupon was rejected — mirrors the API's `reason` codes. */
export type CouponRejectionReason =
  | 'INVALID'
  | 'NOT_STARTED'
  | 'EXPIRED'
  | 'USAGE_LIMIT'
  | 'MIN_ORDER';

export interface ApiCouponValidation {
  valid: boolean;
  message: string;
  reason?: CouponRejectionReason;
  /** Only sent for a `MIN_ORDER` rejection. */
  minOrderAmount?: number;
  coupon?: ApiCoupon;
  discount?: number;
}

export type ProductSort =
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'rating'
  | 'trending'
  | 'discount';

export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  error?: string;
}
