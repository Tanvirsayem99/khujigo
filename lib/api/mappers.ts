import type {
  Banner,
  Category,
  Coupon,
  DeliverySettings,
  Order,
  OrderItem,
  Product,
  PromoSection,
  Review,
  AdminUser,
  ManagedUser,
} from '@/types';
import type { CustomerUser } from '@/context/AuthContext';
import type {
  ApiAdmin,
  ApiBanner,
  ApiCategory,
  ApiCoupon,
  ApiCustomer,
  ApiDeliverySettings,
  ApiOrder,
  ApiOrderItem,
  ApiProduct,
  ApiPromoSection,
  ApiReview,
  ApiSpecification,
  ApiUser,
} from './types';

/**
 * Translates the API's camelCase payloads into the snake_case shapes the
 * existing components already render, so only the data layer had to change.
 */

// ------------------------------------------------------------ to frontend

export function toProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    name_en: p.nameEn,
    name_bn: p.nameBn,
    slug: p.slug,
    sku: p.sku,
    category_id: p.categoryId,
    category_name: p.category?.nameEn,
    brand: p.brand,
    short_desc_en: p.shortDescEn,
    short_desc_bn: p.shortDescBn,
    description_en: p.descriptionEn,
    description_bn: p.descriptionBn,
    price: p.price,
    compare_price: p.comparePrice ?? undefined,
    discount_percent: p.discountPercent ?? undefined,
    stock_quantity: p.stockQuantity,
    low_stock_threshold: p.lowStockThreshold,
    thumbnail_url: p.thumbnailUrl,
    gallery_urls: p.galleryUrls ?? [],
    status: p.status,
    is_featured: p.isFeatured,
    is_trending: p.isTrending,
    is_best_seller: p.isBestSeller,
    is_new_arrival: p.isNewArrival,
    rating: p.rating,
    reviews_count: p.reviewsCount,
    specifications: (p.specifications ?? []).map((spec) => ({
      key_en: spec.keyEn,
      key_bn: spec.keyBn,
      value_en: spec.valueEn,
      value_bn: spec.valueBn,
    })),
    tags: p.tags ?? [],
    seo_title: p.seoTitle ?? undefined,
    seo_description: p.seoDescription ?? undefined,
    created_at: p.createdAt,
  };
}

export function toCategory(c: ApiCategory): Category {
  return {
    id: c.id,
    name_en: c.nameEn,
    name_bn: c.nameBn,
    slug: c.slug,
    description_en: c.descriptionEn ?? undefined,
    description_bn: c.descriptionBn ?? undefined,
    image_url: c.imageUrl,
    icon: c.icon ?? undefined,
    display_order: c.displayOrder,
    is_active: c.isActive,
    product_count: c.productCount,
  };
}

export function toOrderItem(item: ApiOrderItem): OrderItem {
  return {
    product_id: item.productId ?? '',
    name_en: item.nameEn,
    name_bn: item.nameBn,
    thumbnail_url: item.thumbnailUrl,
    price: item.price,
    quantity: item.quantity,
    total: item.total,
  };
}

export function toOrder(o: ApiOrder): Order {
  return {
    id: o.id,
    customer_name: o.customerName,
    customer_phone: o.customerPhone,
    customer_email: o.customerEmail ?? undefined,
    division: o.division,
    district: o.district,
    area: o.area,
    full_address: o.fullAddress,
    delivery_notes: o.deliveryNotes ?? undefined,
    items: (o.items ?? []).map(toOrderItem),
    subtotal: o.subtotal,
    delivery_charge: o.deliveryCharge,
    discount: o.discount,
    coupon_code: o.couponCode ?? undefined,
    payment_reference: o.paymentReference ?? undefined,
    total_amount: o.totalAmount,
    payment_method: o.paymentMethod,
    payment_status: o.paymentStatus,
    order_status: o.orderStatus,
    created_at: o.createdAt,
    updated_at: o.updatedAt,
  };
}

export function toReview(r: ApiReview): Review {
  return {
    id: r.id,
    product_id: r.productId,
    product_name: r.productName,
    customer_name: r.customerName,
    rating: r.rating,
    comment: r.comment,
    created_at: r.createdAt,
    status: r.status,
  };
}

export function toCoupon(c: ApiCoupon): Coupon {
  return {
    id: c.id,
    code: c.code,
    discount_type: c.discountType,
    discount_value: c.discountValue,
    min_order_amount: c.minOrderAmount,
    max_discount_amount: c.maxDiscountAmount ?? undefined,
    usage_limit: c.usageLimit,
    used_count: c.usedCount,
    start_date: c.startDate,
    expiry_date: c.expiryDate,
    is_active: c.isActive,
  };
}

export function toBanner(b: ApiBanner): Banner {
  return {
    id: b.id,
    title_en: b.titleEn,
    title_bn: b.titleBn,
    subtitle_en: b.subtitleEn,
    subtitle_bn: b.subtitleBn,
    button_text_en: b.buttonTextEn,
    button_text_bn: b.buttonTextBn,
    button_url: b.buttonUrl,
    image_url: b.imageUrl,
    badge_en: b.badgeEn ?? undefined,
    badge_bn: b.badgeBn ?? undefined,
    display_order: b.displayOrder,
    is_active: b.isActive,
  };
}

export function toPromoSection(s: ApiPromoSection): PromoSection {
  return {
    is_active: s.isActive,
    coupon: s.coupon ? toCoupon(s.coupon) : undefined,
    title_en: s.titleEn ?? undefined,
    title_bn: s.titleBn ?? undefined,
    description_en: s.descriptionEn ?? undefined,
    description_bn: s.descriptionBn ?? undefined,
  };
}

/** Delivery settings are already camelCase on both sides. */
export function toDeliverySettings(s: ApiDeliverySettings): DeliverySettings {
  return {
    insideDhaka: s.insideDhaka,
    outsideDhaka: s.outsideDhaka,
    freeDeliveryThreshold: s.freeDeliveryThreshold,
    estimatedDaysInsideDhaka: s.estimatedDaysInsideDhaka,
    estimatedDaysOutsideDhaka: s.estimatedDaysOutsideDhaka,
  };
}

export function toCustomerUser(c: ApiCustomer): CustomerUser {
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    division: c.division ?? undefined,
    district: c.district ?? undefined,
    area: c.area ?? undefined,
    address: c.address ?? undefined,
  };
}

export function toAdminUser(a: ApiAdmin): AdminUser {
  return {
    id: a.id,
    name: a.name,
    email: a.email,
    phone: a.phone ?? null,
    role: a.role,
    avatar_url: a.avatarUrl ?? undefined,
    created_at: a.createdAt ?? undefined,
  };
}

export function toManagedUser(u: ApiUser): ManagedUser {
  return {
    id: u.id,
    kind: u.kind,
    name: u.name,
    email: u.email,
    phone: u.phone ?? null,
    role: u.role,
    avatar_url: u.avatarUrl ?? undefined,
    created_at: u.createdAt ?? undefined,
  };
}

// ------------------------------------------------------------ to API (writes)

/**
 * Explicit allowlists: the API runs with `forbidNonWhitelisted`, so sending an
 * extra key (a category name, a row id) is a 400 rather than a silent ignore.
 */
const PRODUCT_FIELDS: Record<string, string> = {
  name_en: 'nameEn',
  name_bn: 'nameBn',
  slug: 'slug',
  sku: 'sku',
  category_id: 'categoryId',
  brand: 'brand',
  short_desc_en: 'shortDescEn',
  short_desc_bn: 'shortDescBn',
  description_en: 'descriptionEn',
  description_bn: 'descriptionBn',
  price: 'price',
  compare_price: 'comparePrice',
  discount_percent: 'discountPercent',
  stock_quantity: 'stockQuantity',
  low_stock_threshold: 'lowStockThreshold',
  thumbnail_url: 'thumbnailUrl',
  gallery_urls: 'galleryUrls',
  status: 'status',
  is_featured: 'isFeatured',
  is_trending: 'isTrending',
  is_best_seller: 'isBestSeller',
  is_new_arrival: 'isNewArrival',
  rating: 'rating',
  reviews_count: 'reviewsCount',
  tags: 'tags',
  seo_title: 'seoTitle',
  seo_description: 'seoDescription',
};

const CATEGORY_FIELDS: Record<string, string> = {
  name_en: 'nameEn',
  name_bn: 'nameBn',
  slug: 'slug',
  description_en: 'descriptionEn',
  description_bn: 'descriptionBn',
  image_url: 'imageUrl',
  icon: 'icon',
  display_order: 'displayOrder',
  is_active: 'isActive',
};

const BANNER_FIELDS: Record<string, string> = {
  title_en: 'titleEn',
  title_bn: 'titleBn',
  subtitle_en: 'subtitleEn',
  subtitle_bn: 'subtitleBn',
  button_text_en: 'buttonTextEn',
  button_text_bn: 'buttonTextBn',
  button_url: 'buttonUrl',
  image_url: 'imageUrl',
  display_order: 'displayOrder',
  is_active: 'isActive',
};

const COUPON_FIELDS: Record<string, string> = {
  code: 'code',
  discount_type: 'discountType',
  discount_value: 'discountValue',
  min_order_amount: 'minOrderAmount',
  max_discount_amount: 'maxDiscountAmount',
  usage_limit: 'usageLimit',
  start_date: 'startDate',
  expiry_date: 'expiryDate',
  is_active: 'isActive',
};

function pick(
  input: Record<string, unknown>,
  fields: Record<string, string>,
): Record<string, unknown> {
  const output: Record<string, unknown> = {};
  for (const [snake, camel] of Object.entries(fields)) {
    const value = input[snake];
    if (value === undefined || value === null || value === '') continue;
    output[camel] = value;
  }
  return output;
}

function toSpecifications(value: unknown): ApiSpecification[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return (value as Array<Record<string, unknown>>).map((spec) => ({
    keyEn: String(spec.key_en ?? ''),
    keyBn: String(spec.key_bn ?? ''),
    valueEn: String(spec.value_en ?? ''),
    valueBn: String(spec.value_bn ?? ''),
  }));
}

export function toProductPayload(
  input: Record<string, unknown>,
): Record<string, unknown> {
  const payload = pick(input, PRODUCT_FIELDS);

  const specifications = toSpecifications(input.specifications);
  if (specifications) payload.specifications = specifications;

  return payload;
}

export function toCategoryPayload(
  input: Record<string, unknown>,
): Record<string, unknown> {
  return pick(input, CATEGORY_FIELDS);
}

export function toCouponPayload(
  input: Record<string, unknown>,
): Record<string, unknown> {
  return pick(input, COUPON_FIELDS);
}

export function toBannerPayload(
  input: Record<string, unknown>,
): Record<string, unknown> {
  const payload = pick(input, BANNER_FIELDS);

  // Badges are optional and `pick` drops empty strings, so an emptied badge
  // would silently keep its old value on update. Send null to clear it.
  if ('badge_en' in input) payload.badgeEn = input.badge_en ? input.badge_en : null;
  if ('badge_bn' in input) payload.badgeBn = input.badge_bn ? input.badge_bn : null;

  return payload;
}
