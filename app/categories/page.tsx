'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Layers, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SectionError } from '@/components/common/LoadingStates';
import { useCategories } from '@/lib/hooks/api';

export default function CategoriesPage() {
  const { language } = useApp();
  const { categories, isLoading, error, refresh } = useCategories();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
          {language === 'bn' ? 'ক্যাটাগরি সমূহ' : 'Browse Categories'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {language === 'bn'
            ? 'আপনার প্রয়োজনীয় ক্যাটাগরি বেছে নিয়ে ট্রেন্ডিং পণ্য দেখুন'
            : 'Pick a category to explore its trending products'}
        </p>
      </div>

      {error ? (
        <SectionError onRetry={() => refresh()} />
      ) : isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-56 rounded-3xl bg-white border border-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-md mx-auto space-y-3">
          <div className="w-16 h-16 rounded-full bg-orange-50 text-brand-orange flex items-center justify-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-brand-navy">
            {language === 'bn' ? 'কোনো ক্যাটাগরি নেই' : 'No categories yet'}
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:border-orange-300 hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col"
            >
              <div className="relative aspect-4/3 bg-orange-50 overflow-hidden">
                {category.image_url ? (
                  <Image
                    src={category.image_url}
                    alt={language === 'bn' ? category.name_bn : category.name_en}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-orange">
                    <Layers className="w-10 h-10" />
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-brand-navy group-hover:text-brand-orange transition-colors line-clamp-1">
                    {language === 'bn' ? category.name_bn : category.name_en}
                  </h2>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-1 line-clamp-2">
                    {language === 'bn'
                      ? category.description_bn
                      : category.description_en}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400">
                    {language === 'bn'
                      ? `${category.product_count ?? 0}টি পণ্য`
                      : `${category.product_count ?? 0} items`}
                  </span>
                  <span className="text-brand-orange flex items-center gap-1 text-[11px] font-bold">
                    <span>{language === 'bn' ? 'দেখুন' : 'Explore'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
