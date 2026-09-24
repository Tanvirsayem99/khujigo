export type Language = 'bn' | 'en';

export interface Category {
  id: string;
  name_en: string;
  name_bn: string;
  slug: string;
  description_en?: string;
  description_bn?: string;
  image_url: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
  product_count?: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
}

/**
 * The slice of a product that a listing card, the cart, the wishlist and the
 * pixel events actually read. Listing endpoints feed this to the UI, so a
 * server-rendered grid sends only these fields instead of the full record
 * (descriptions, specifications and gallery make up ~83% of a product payload).
 * A full `Product` satisfies this type, so detail pages can pass it anywhere a
 * summary is expected.
 */
export interface ProductSummary {
  id: string;
  name_en: string;
  name_bn: string;
  slug: string;
  brand: string;
  price: number;
  compare_price?: number;
  thumbnail_url: string;
  stock_quantity: number;
  low_stock_threshold: number;
  rating: number;
  reviews_count: number;
  is_trending: boolean;
}

export interface Product extends ProductSummary {
  sku: string;
  category_id: string;
  category_name?: string;
  short_desc_en: string;
  short_desc_bn: string;
  description_en: string;
  description_bn: string;
  discount_percent?: number;
  gallery_urls: string[];
  status: 'ACTIVE' | 'DRAFT' | 'OUT_OF_STOCK' | 'ARCHIVED';
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  specifications: { key_en: string; key_bn: string; value_en: string; value_bn: string }[];
  tags: string[];
  seo_title?: string;
  seo_description?: string;
  created_at: string;
}

export type ProductStatus = Product['status'];

export interface CartItem {
  id: string;
  product_id: string;
  name_en: string;
  name_bn: string;
  slug: string;
  thumbnail_url: string;
  price: number;
  compare_price?: number;
  quantity: number;
  stock_quantity: number;
}

export interface WishlistItem {
  id: string;
  product: ProductSummary;
  added_at: string;
}

export interface DeliverySettings {
  insideDhaka: number;
  outsideDhaka: number;
  freeDeliveryThreshold: number;
  estimatedDaysInsideDhaka: string;
  estimatedDaysOutsideDhaka: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export type PaymentMethod = 'COD' | 'BKASH' | 'NAGAD' | 'ONLINE';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';

export interface OrderItem {
  product_id: string;
  name_en: string;
  name_bn: string;
  thumbnail_url: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string; // e.g. KG-84920
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  division: string;
  district: string;
  area: string;
  full_address: string;
  delivery_notes?: string;
  items: OrderItem[];
  subtotal: number;
  delivery_charge: number;
  discount: number;
  coupon_code?: string;
  /** bKash/Nagad transaction id, verified manually by staff. For COD orders
   * this is the transaction id of the delivery-charge advance. */
  payment_reference?: string;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  /** Whether the COD delivery-charge advance has been confirmed by staff. */
  delivery_charge_paid: boolean;
  order_status: OrderStatus;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  product_name: string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
}

export type ReviewStatus = Review['status'];

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'PERCENTAGE' | 'FIXED';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount?: number;
  usage_limit: number;
  used_count: number;
  start_date: string;
  expiry_date: string;
  is_active: boolean;
}

/** Homepage "Exclusive Promo Code" section. Custom copy is optional — when
 *  absent the UI derives the headline from the featured coupon. */
export interface PromoSection {
  is_active: boolean;
  coupon?: Coupon;
  title_en?: string;
  title_bn?: string;
  description_en?: string;
  description_bn?: string;
}

export interface Banner {
  id: string;
  title_en: string;
  title_bn: string;
  subtitle_en: string;
  subtitle_bn: string;
  button_text_en: string;
  button_text_bn: string;
  button_url: string;
  image_url: string;
  badge_en?: string;
  badge_bn?: string;
  display_order: number;
  is_active: boolean;
}

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: AdminRole;
  avatar_url?: string;
  created_at?: string;
}

export type UserKind = 'ADMIN' | 'CUSTOMER';

export interface ManagedUser {
  id: string;
  kind: UserKind;
  name: string;
  email: string;
  phone?: string | null;
  /** `null` for customers — only staff accounts carry a role. */
  role: AdminRole | null;
  avatar_url?: string;
  created_at?: string;
}
