'use client';

import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const PRODUCT_GRID_COLUMNS = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

/**
 * Placeholder cards matching ProductCard's footprint block for block (square
 * thumbnail, two-line title, price row, two buttons) so swapping in the real
 * cards cannot shift the layout.
 */
export function ProductGridSkeleton({
  count = 4,
  columns = PRODUCT_GRID_COLUMNS,
}: {
  count?: number;
  columns?: string;
}) {
  return (
    <div className={`grid ${columns} gap-3 sm:gap-5`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-gray-100" />
          <div className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="h-3 w-16 bg-gray-100 rounded-full" />
              <div className="h-3 w-12 bg-gray-100 rounded-full" />
            </div>
            <div className="space-y-1.5 min-h-[2.5rem]">
              <div className="h-3.5 bg-gray-100 rounded-full w-full" />
              <div className="h-3.5 bg-gray-100 rounded-full w-4/5" />
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="h-5 w-24 bg-gray-100 rounded-full mb-3" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-10 bg-gray-100 rounded-xl" />
                <div className="h-10 bg-gray-100 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Placeholder matching the HeroBanner's footprint so the hero never collapses. */
export function BannerSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="hidden md:block relative w-full overflow-hidden rounded-3xl shadow-xl bg-gray-100 animate-pulse"
    >
      <div className="min-h-[460px] lg:min-h-[480px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <div className="h-7 w-32 rounded-full bg-gray-200" />
            <div className="space-y-3">
              <div className="h-9 sm:h-12 w-4/5 rounded-2xl bg-gray-200" />
              <div className="h-9 sm:h-12 w-3/5 rounded-2xl bg-gray-200" />
            </div>
            <div className="h-4 w-2/3 rounded-full bg-gray-200" />
            <div className="flex flex-wrap gap-3 pt-1">
              <div className="h-7 w-40 rounded-lg bg-gray-200" />
              <div className="h-7 w-36 rounded-lg bg-gray-200" />
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="h-12 w-40 rounded-xl bg-gray-200" />
              <div className="h-12 w-28 rounded-xl bg-gray-200" />
            </div>
          </div>
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-3xl bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Generic stacked-row placeholder for lists and tables. */
export function RowsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-12 bg-gray-100 rounded-xl" />
      ))}
    </div>
  );
}

export function InlineSpinner({ label }: { label?: string }) {
  const { language } = useApp();
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-xs font-medium text-gray-500">
      <Loader2 className="w-4 h-4 animate-spin text-brand-orange" />
      <span>{label ?? (language === 'bn' ? 'লোড হচ্ছে...' : 'Loading...')}</span>
    </div>
  );
}

export function SectionError({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  const { language } = useApp();
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-3">
      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>
      <p className="text-xs sm:text-sm font-semibold text-rose-900">
        {message ??
          (language === 'bn'
            ? 'ডেটা লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।'
            : 'Could not load data. Please try again.')}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition"
        >
          {language === 'bn' ? 'আবার চেষ্টা করুন' : 'Retry'}
        </button>
      )}
    </div>
  );
}
