'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { SWRConfig } from 'swr';
import { ArrowRight, Flame, Sparkles, Award, Check, Copy } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useProducts, usePromoSection } from '@/lib/hooks/api';
import {
  HOME_TRENDING_QUERY,
  buildHomeFallback,
  type HomeData,
} from '@/lib/home-queries';
import { BannerSkeleton, ProductGridSkeleton, SectionError } from '@/components/common/LoadingStates';
import CategoryBubbles from '@/components/storefront/CategoryBubbles';
import FlashDealsSection from '@/components/storefront/FlashDealsSection';
import ProductCard from '@/components/storefront/ProductCard';
import TrustBadges from '@/components/storefront/TrustBadges';
import CustomerReviewsSection from '@/components/storefront/CustomerReviewsSection';

// Lazy-loaded so the hero's code (and its banner render) stays out of the
// initial bundle. It is desktop-only (`hidden md:block`), so on phones nothing
// is lost — and no banner image is fetched there either.
const HeroBanner = dynamic(() => import('@/components/storefront/HeroBanner'), {
  loading: () => <BannerSkeleton />,
});

/**
 * This grid is edge-to-edge inside `main` (px-4 on phones, plus the card's own
 * 1px border), so 100vw overstates it. See ProductCard's default for the
 * rationale.
 */
const TRENDING_CARD_IMAGE_SIZES =
  '(max-width: 640px) calc(100vw - 34px), (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw';

/**
 * Receives the homepage catalogue from the server and publishes it as SWR
 * fallback data, so the first client render is the final content instead of
 * skeletons.
 *
 * `revalidateIfStale: false` is what makes that work: without it SWR reports
 * `isLoading` for the whole first (server) render even when fallback data is
 * present, and the sections would paint their skeletons anyway. It only
 * suppresses refetching for keys that were pre-filled — a key the server could
 * not load still fetches normally.
 */
export default function HomePageContent({ data }: { data: HomeData }) {
  const config = useMemo(
    () => ({ fallback: buildHomeFallback(data), revalidateIfStale: false }),
    [data],
  );

  return (
    <SWRConfig value={config}>
      <HomeSections />
    </SWRConfig>
  );
}

function HomeSections() {
  const { language, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'trending' | 'best_seller' | 'new_arrival'>('trending');
  const [couponCopied, setCouponCopied] = useState(false);

  // Admin-controlled "Exclusive Promo Code" section.
  const { promo: promoSection } = usePromoSection();
  const promoCoupon = promoSection?.coupon;

  // Only the visible tab is fetched up front; the other two load on first visit.
  // `trending` stays enabled because it doubles as the empty-state fallback.
  const trending = useProducts(HOME_TRENDING_QUERY);
  const bestSellers = useProducts(
    { bestSeller: true, limit: 8 },
    { enabled: activeTab === 'best_seller' },
  );
  const newArrivals = useProducts(
    { newArrival: true, limit: 8 },
    { enabled: activeTab === 'new_arrival' },
  );

  const activeCollection =
    activeTab === 'trending'
      ? trending
      : activeTab === 'best_seller'
      ? bestSellers
      : newArrivals;

  // Fall back to the trending set so a tab is never mysteriously empty.
  const displayedProducts =
    activeCollection.products.length > 0
      ? activeCollection.products
      : trending.products;

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCouponCopied(true);
    showToast(
      language === 'bn' ? `কুপন কোড ${code} কপি হয়েছে!` : `Coupon ${code} copied!`,
      'success'
    );
    setTimeout(() => setCouponCopied(false), 3000);
  };

  // Copy falls back to the featured coupon when the admin left it blank.
  const promoTitle = promoCoupon
    ? language === 'bn'
      ? promoSection?.title_bn ||
        (promoCoupon.discount_type === 'FIXED'
          ? `অর্ডারে ফ্ল্যাট ৳${promoCoupon.discount_value} ছাড়!`
          : `অর্ডারে ${promoCoupon.discount_value}% ছাড়!`)
      : promoSection?.title_en ||
        (promoCoupon.discount_type === 'FIXED'
          ? `Get Flat ৳${promoCoupon.discount_value} Off on Your Order!`
          : `Get ${promoCoupon.discount_value}% Off on Your Order!`)
    : '';

  const promoDescription = promoCoupon
    ? language === 'bn'
      ? promoSection?.description_bn ||
        (promoCoupon.min_order_amount > 0
          ? `যেকোনো ৳${promoCoupon.min_order_amount} বা তার বেশি অর্ডারে কুপনটি ব্যবহার করুন। চেকআউট পেজে কোডটি লিখুন।`
          : 'চেকআউটে কুপনটি ব্যবহার করে সাথে সাথে সাশ্রয় করুন।')
      : promoSection?.description_en ||
        (promoCoupon.min_order_amount > 0
          ? `Use this coupon on any order over ৳${promoCoupon.min_order_amount}. Enter code at checkout for instant savings.`
          : `Use this coupon at checkout for instant savings.`)
    : '';

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex flex-col gap-8 sm:gap-14">
      {/* Hero Banner Slider (desktop only) */}
      <HeroBanner />

      {/* Trust Badges */}
      <TrustBadges />

      {/* Category Bubbles */}
      <CategoryBubbles />

      {/* Flash Deals with Live Countdown */}
      <FlashDealsSection />

      {/* Trending & Curated Products Section with Tabs */}
      <section className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight flex items-center gap-2">
              <span>{language === 'bn' ? 'আমাদের সেরা কালেকশন' : 'Featured Collections'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              {language === 'bn'
                ? 'সোশ্যাল মিডিয়ায় ভাইরাল ও কাস্টমারদের সবচেয়ে পছন্দের পণ্য'
                : 'Viral and top-demanded gadgets & lifestyle items in Bangladesh'}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-white rounded-2xl border border-gray-200 self-start sm:self-auto shadow-xs">
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'trending'
                  ? 'bg-brand-orange-deep text-white shadow-sm'
                  : 'text-gray-600 hover:text-brand-navy'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ট্রেন্ডিং' : 'Trending'}</span>
            </button>
            <button
              onClick={() => setActiveTab('best_seller')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'best_seller'
                  ? 'bg-brand-orange-deep text-white shadow-sm'
                  : 'text-gray-600 hover:text-brand-navy'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'টপ সেলার' : 'Best Sellers'}</span>
            </button>
            <button
              onClick={() => setActiveTab('new_arrival')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'new_arrival'
                  ? 'bg-brand-orange-deep text-white shadow-sm'
                  : 'text-gray-600 hover:text-brand-navy'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'নতুন আগমন' : 'New Arrivals'}</span>
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {activeCollection.error ? (
          <SectionError onRetry={() => activeCollection.refresh()} />
        ) : activeCollection.isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                sizes={TRENDING_CARD_IMAGE_SIZES}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-navy hover:bg-[#0d1e36] text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <span>{language === 'bn' ? 'সব পণ্য একসাথে দেখুন' : 'Explore All Products'}</span>
            <ArrowRight className="w-4 h-4 text-brand-orange" />
          </Link>
        </div>
      </section>

      {/* Promotional Banner Callout — shown only when the admin enables it and
          picks a coupon; the copy comes from that coupon unless overridden. */}
      {promoSection?.is_active && promoCoupon && (
        <section className="w-full bg-gradient-to-r from-amber-700 via-orange-700 to-brand-orange-deep rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left z-10">
            <span className="px-3 py-1 rounded-full bg-black/20 text-white text-[11px] font-black uppercase tracking-wider inline-block">
              {language === 'bn' ? 'বিশেষ ডিসকাউন্ট অফার' : 'Exclusive Promo Code'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">{promoTitle}</h3>
            <p className="text-xs sm:text-sm text-white max-w-xl font-medium">
              {promoDescription}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 z-10 bg-white/10 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl border border-white/30">
            <div className="px-4 py-2 bg-white text-brand-navy rounded-xl font-mono font-black text-sm sm:text-base tracking-widest shadow-xs">
              {promoCoupon.code}
            </div>
            <button
              onClick={() => copyCoupon(promoCoupon.code)}
              className="px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-black text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              {couponCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{couponCopied ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied') : (language === 'bn' ? 'কপি করুন' : 'Copy')}</span>
            </button>
          </div>
        </section>
      )}

      {/* Customer Reviews Section */}
      <CustomerReviewsSection />
    </main>
  );
}
