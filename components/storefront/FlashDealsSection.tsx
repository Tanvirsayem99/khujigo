'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Timer, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/storefront/ProductCard';
import { ProductGridSkeleton } from '@/components/common/LoadingStates';
import { useProducts } from '@/lib/hooks/api';
import { HOME_FLASH_QUERY } from '@/lib/home-queries';
import { toBanglaNumber } from '@/lib/bangladesh-data';

// Matches the real flash-deal grid so the skeleton cannot shift the layout.
const FLASH_GRID_COLUMNS = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';

/**
 * Split out of the section on purpose: its one-second tick re-renders only these
 * digits, instead of the whole product grid (which would be a 1 Hz main-thread
 * task for as long as the page is open).
 */
function FlashCountdown() {
  const { language } = useApp();
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 45, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDigit = (n: number) => {
    const str = n.toString().padStart(2, '0');
    return language === 'bn' ? toBanglaNumber(str) : str;
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 bg-white px-3 py-1.5 rounded-xl border border-orange-200 shadow-xs">
        <Timer className="w-4 h-4 text-brand-orange" />
        <span>{language === 'bn' ? 'অফার শেষ হতে বাকি:' : 'Ends in:'}</span>
      </div>

      <div className="flex items-center gap-1 font-mono font-black text-sm">
        <span className="w-8 h-8 rounded-lg bg-brand-navy text-white flex items-center justify-center shadow-xs">
          {formatDigit(timeLeft.hours)}
        </span>
        <span className="text-brand-navy font-bold">:</span>
        <span className="w-8 h-8 rounded-lg bg-brand-navy text-white flex items-center justify-center shadow-xs">
          {formatDigit(timeLeft.minutes)}
        </span>
        <span className="text-brand-navy font-bold">:</span>
        <span className="w-8 h-8 rounded-lg bg-brand-orange-deep text-white flex items-center justify-center shadow-xs">
          {formatDigit(timeLeft.seconds)}
        </span>
      </div>
    </div>
  );
}

export default function FlashDealsSection() {
  const { language } = useApp();
  const { products: flashProducts, isLoading } = useProducts(HOME_FLASH_QUERY);

  // Nothing discounted right now — don't render an empty promotion.
  if (!isLoading && flashProducts.length === 0) return null;

  return (
    <section className="w-full bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 rounded-3xl p-5 sm:p-7 border border-orange-200/80">
      {/* Header with Title and Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-orange text-white flex items-center justify-center shadow-md shadow-orange-500/30">
            <Zap className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight flex items-center gap-2">
              <span>{language === 'bn' ? 'ফ্ল্যাশ ডিল' : 'Flash Sale Deals'}</span>
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-bold">
                {language === 'bn' ? 'সীমিত সময়' : 'Limited Time'}
              </span>
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              {language === 'bn' ? 'সেরা মূল্যে সর্বোচ্চ ছাড়ের স্পেশাল অফার' : 'Biggest savings on top-demand trending products'}
            </p>
          </div>
        </div>

        {/* Live Countdown Box */}
        <FlashCountdown />
      </div>

      {/* Product Cards Grid */}
      {isLoading ? (
        <ProductGridSkeleton count={4} columns={FLASH_GRID_COLUMNS} />
      ) : (
        <div className={`grid ${FLASH_GRID_COLUMNS} gap-3 sm:gap-5`}>
          {flashProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index === 0} />
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <Link
          href="/shop?filter=deals"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-orange-50 text-brand-navy font-bold text-xs sm:text-sm border border-orange-200 shadow-xs transition"
        >
          <span>{language === 'bn' ? 'সব ফ্ল্যাশ অফার দেখুন' : 'View All Flash Deals'}</span>
          <ArrowRight className="w-4 h-4 text-brand-orange" />
        </Link>
      </div>
    </section>
  );
}
