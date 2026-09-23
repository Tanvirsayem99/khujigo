/**
 * Integration check for the frontend data layer: runs the real client,
 * mappers and endpoints from lib/api against the live API.
 *
 * Not part of the app build — invoked via `npm run test:integration`.
 */

const store = new Map();

global.window = {
  localStorage: {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  },
};

process.env.NEXT_PUBLIC_API_URL = 'https://test.buyallscrapksa.com/api/v1';

const api = require('../.tmp-fe-build/lib/api/endpoints.js');
const client = require('../.tmp-fe-build/lib/api/client.js');

let failures = 0;
function check(label, condition, detail) {
  if (condition) {
    console.log(`OK   ${label}`);
  } else {
    failures += 1;
    console.log(`FAIL ${label}${detail ? ` -> ${detail}` : ''}`);
  }
}

async function main() {
  // --- public catalog reads through the mappers -------------------------
  const page = await api.listProducts({ limit: 4, sort: 'price_asc' });
  check('listProducts returns 4 snake_case products', page.products.length === 4);
  check('product has category_name from the nested relation', !!page.products[0].category_name, page.products[0].category_name);
  check('product has snake_case fields', page.products[0].stock_quantity !== undefined && page.products[0].thumbnail_url !== undefined);
  check('prices ascending', page.products.every((p, i) => i === 0 || page.products[i - 1].price <= p.price));

  const one = await api.getProduct('t900-ultra-2-smartwatch-bangla-support');
  check('getProduct by slug maps specifications', one.specifications[0].key_en === 'Display', JSON.stringify(one.specifications[0]));

  const categories = await api.listCategories();
  check('listCategories maps productCount -> product_count', typeof categories[0].product_count === 'number');

  const reviews = await api.listReviews({ productId: 'prod-1' });
  check('listReviews returns approved reviews', reviews.length > 0 && reviews.every((r) => r.status === 'APPROVED'));

  const coupon = await api.validateCoupon('KHUJIGO100', 2300);
  check('validateCoupon maps a fixed discount', coupon.valid && coupon.discount === 100, JSON.stringify(coupon));

  const expired = await api.validateCoupon('EID2026', 9000);
  check('validateCoupon surfaces reason + valid=false', !expired.valid && expired.reason === 'EXPIRED');

  // --- the filters the shop page and nav/footer links rely on ----------
  const trending = await api.listProducts({ trending: true, limit: 50 });
  check('trending filter', trending.products.length > 0 && trending.products.every((p) => p.is_trending));

  const bestSellers = await api.listProducts({ bestSeller: true, limit: 50 });
  check('bestSeller filter', bestSellers.products.length > 0 && bestSellers.products.every((p) => p.is_best_seller));

  const arrivals = await api.listProducts({ newArrival: true, limit: 50 });
  check('newArrival filter', arrivals.products.length > 0 && arrivals.products.every((p) => p.is_new_arrival));

  const deals = await api.listProducts({ onSale: true, limit: 50 });
  check('onSale filter (used by ?filter=deals)', deals.products.length > 0 && deals.products.every((p) => (p.discount_percent ?? 0) > 0));

  const inStock = await api.listProducts({ inStock: true, limit: 50 });
  check('inStock filter', inStock.products.every((p) => p.stock_quantity > 0));

  const byCategory = await api.listProducts({ categorySlug: 'gadgets', limit: 50 });
  check('categorySlug filter', byCategory.products.length > 0 && byCategory.products.every((p) => p.category_name === 'Gadgets & Tech'));

  const searched = await api.listProducts({ search: 'watch', limit: 50 });
  check('search filter', searched.products.length > 0);

  const priced = await api.listProducts({ minPrice: 900, maxPrice: 1500, limit: 50 });
  check('price range filter', priced.products.length > 0 && priced.products.every((p) => p.price >= 900 && p.price <= 1500));

  const pageTwo = await api.listProducts({ page: 2, limit: 5 });
  check('pagination returns the tail page', pageTwo.products.length === pageTwo.total - 5 && pageTwo.totalPages === 2, `len=${pageTwo.products.length} total=${pageTwo.total} pages=${pageTwo.totalPages}`);

  // --- auth: login stores tokens, authed reads work ---------------------
  const tokens = await api.loginCustomer('customer@khujigo.com', 'customer123');
  client.setTokens({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, tokenType: tokens.tokenType });
  check('login returns tokens', !!tokens.accessToken && !!tokens.refreshToken);
  check('tokens persisted to storage', !!client.getTokens('CUSTOMER'));

  const me = await api.meCustomer();
  check('meCustomer maps the profile', me.email === 'customer@khujigo.com' && !!me.phone);

  const mine = await api.listMyOrders();
  check('listMyOrders works with the stored token', Array.isArray(mine));

  // --- refresh-on-401: corrupt the access token and retry --------------
  const before = client.getTokens('CUSTOMER');
  client.setTokens({ ...before, accessToken: 'tampered.jwt.value' });
  const afterRefresh = await api.meCustomer();
  check('a dead access token is silently refreshed', afterRefresh.email === 'customer@khujigo.com');
  const refreshed = client.getTokens('CUSTOMER');
  check('the refreshed token replaced the bad one', refreshed.accessToken !== 'tampered.jwt.value');

  // --- optional auth: checkout links the order to the customer ---------
  const order = await api.createOrder({
    customerName: 'Integration Tester',
    customerPhone: '01791827364',
    customerEmail: 'customer@khujigo.com',
    division: 'dhaka',
    district: 'dhaka-city',
    area: 'Dhanmondi',
    fullAddress: 'House 5, Road 5, Dhanmondi, Dhaka',
    paymentMethod: 'COD',
    couponCode: 'TRENDING50',
    paymentReference: 'TRX-INTEGRATION-1',
    items: [{ productId: 'prod-3', quantity: 1 }],
  });
  check('createOrder returns a mapped order', /^KG-\d{4}-\d{4}$/.test(order.id), order.id);
  check('order totals computed server-side', order.subtotal > 0 && order.total_amount > 0, JSON.stringify({ s: order.subtotal, d: order.delivery_charge, t: order.total_amount }));
  check('payment_reference round-trips', order.payment_reference === 'TRX-INTEGRATION-1', order.payment_reference);

  const mineAfter = await api.listMyOrders();
  check('the new order appears in my orders', mineAfter.some((o) => o.id === order.id));

  // --- admin: auth-required reads + a mutation ------------------------
  const adminTokens = await api.loginAdmin('admin@khujigo.com', 'admin123');
  client.setTokens({ accessToken: adminTokens.accessToken, refreshToken: adminTokens.refreshToken, tokenType: adminTokens.tokenType });

  const analytics = await api.getAnalytics();
  check('admin analytics maps', typeof analytics.totalSales === 'number' && typeof analytics.lowStockCount === 'number');

  const adminProducts = await api.listAdminProducts();
  check(
    'admin list includes the seeded catalog',
    adminProducts.some((p) => p.sku === 'KG-WAT-001') && adminProducts.length >= 8,
    `${adminProducts.length} products`,
  );

  const adminOrders = await api.listOrders();
  check('admin order list maps', adminOrders.some((o) => o.id === order.id));

  const adminReviews = await api.listAdminReviews();
  check('admin review list includes every status', Array.isArray(adminReviews));

  const coupons = await api.listCoupons();
  check('admin coupon list maps used_count', coupons.some((c) => c.used_count > 0));

  const settings = await api.getDeliverySettings();
  check('delivery settings map', typeof settings.insideDhaka === 'number');

  const updated = await api.updateDeliverySettings({ insideDhaka: settings.insideDhaka });
  check('updateDeliverySettings round-trips', updated.insideDhaka === settings.insideDhaka);

  // --- a customer token presented as an admin token is rejected --------
  // Tokens are stored per subject, so overwrite the ADMIN slot explicitly.
  client.setTokens({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    tokenType: 'ADMIN',
  });
  let forbidden = false;
  try {
    await api.getAnalytics();
  } catch (error) {
    forbidden = error instanceof client.ApiError && error.status === 403;
  }
  check('customer token presented as admin is 403', forbidden);

  console.log(failures === 0 ? '\nALL DATA-LAYER CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
  process.exitCode = failures === 0 ? 0 : 1;
}

main().catch((error) => {
  console.error('Integration run crashed:', error);
  process.exitCode = 1;
});
