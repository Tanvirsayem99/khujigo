'use client';

import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useStoreReviews } from '@/lib/hooks/api';

export default function CustomerReviewsSection() {
  const { language } = useApp();
  const { reviews, isLoading } = useStoreReviews(4);

  if (isLoading) {
    return (
      <section className="w-full">
        <div className="h-8 w-64 bg-gray-100 rounded-full animate-pulse mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-52 rounded-2xl bg-white border border-gray-100 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  // No approved reviews yet — skip the section rather than show an empty grid.
  if (reviews.length === 0) return null;

  return (
    <section className="w-full">
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold tracking-wider uppercase inline-block mb-2">
          {language === 'bn' ? 'সন্তুষ্ট গ্রাহকদের মতামত' : 'Customer Testimonials'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
          {language === 'bn' ? 'আমাদের কাস্টমাররা কী বলছেন?' : 'What Our Happy Customers Say'}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {language === 'bn'
            ? 'সারা দেশের হাজারো সন্তুষ্ট ক্রেতার অভিজ্ঞতা ও মতামত'
            : 'Genuine experiences from verified buyers across Bangladesh'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Comment */}
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic mb-4">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-brand-navy">{rev.customer_name}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100" />
                </div>
                <p className="text-[10px] text-brand-orange font-medium truncate max-w-[170px]">
                  {rev.product_name}
                </p>
              </div>
              <span className="text-[10px] text-gray-400 font-medium">ভেরিফায়েড</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
