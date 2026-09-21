'use client';

import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

/** Placeholder cards matching ProductCard's footprint. */
export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-gray-100" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-gray-100 rounded-full w-4/5" />
            <div className="h-3 bg-gray-100 rounded-full w-3/5" />
            <div className="h-4 bg-gray-100 rounded-full w-2/5 mt-3" />
          </div>
        </div>
      ))}
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
