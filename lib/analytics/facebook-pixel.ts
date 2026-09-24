import type { CartItem, Order, ProductSummary } from '@/types';

/** Every price in the catalog is a whole-taka BDT amount — no subunit conversion. */
export const PIXEL_CURRENCY = 'BDT';

type FbqFunction = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

/** The base snippet loads with `afterInteractive`, so it may not exist yet during SSR or first paint. */
function fbq(...args: unknown[]) {
  if (typeof window === 'undefined') return;
  window.fbq?.(...args);
}

function track(event: string, data?: Record<string, unknown>) {
  fbq('track', event, data);
}

interface PixelContent {
  id: string;
  quantity: number;
  item_price: number;
}

function contentsOf(items: CartItem[]): PixelContent[] {
  return items.map((item) => ({
    id: item.product_id,
    quantity: item.quantity,
    item_price: item.price,
  }));
}

function sumOf(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function countOf(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function trackPageView() {
  track('PageView');
}

export function trackViewContent(product: ProductSummary) {
  track('ViewContent', {
    content_ids: [product.id],
    content_name: product.name_en,
    content_type: 'product',
    value: product.price,
    currency: PIXEL_CURRENCY,
  });
}

export function trackAddToCart(product: ProductSummary, quantity: number) {
  track('AddToCart', {
    content_ids: [product.id],
    content_name: product.name_en,
    content_type: 'product',
    contents: [{ id: product.id, quantity, item_price: product.price }],
    value: product.price * quantity,
    currency: PIXEL_CURRENCY,
  });
}

export function trackAddToWishlist(product: ProductSummary) {
  track('AddToWishlist', {
    content_ids: [product.id],
    content_name: product.name_en,
    content_type: 'product',
    value: product.price,
    currency: PIXEL_CURRENCY,
  });
}

export function trackSearch(searchString: string) {
  track('Search', { search_string: searchString });
}

/** Delivery is priced by the API, so the preview value is the item subtotal. */
export function trackInitiateCheckout(items: CartItem[]) {
  track('InitiateCheckout', {
    content_ids: items.map((item) => item.product_id),
    content_type: 'product',
    contents: contentsOf(items),
    num_items: countOf(items),
    value: sumOf(items),
    currency: PIXEL_CURRENCY,
  });
}

/** Uses the API-computed order, not the local cart, so value matches the receipt. */
export function trackPurchase(order: Order) {
  track('Purchase', {
    content_ids: order.items.map((item) => item.product_id),
    content_type: 'product',
    contents: order.items.map((item) => ({
      id: item.product_id,
      quantity: item.quantity,
      item_price: item.price,
    })),
    num_items: order.items.reduce((sum, item) => sum + item.quantity, 0),
    value: order.total_amount,
    currency: PIXEL_CURRENCY,
    order_id: order.id,
  });
}
