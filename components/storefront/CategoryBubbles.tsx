'use client';

import React from 'react';
import Link from 'next/link';
import { Watch, Cpu, Home, Shirt, Sparkles, Headphones, Layers } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useCategories } from '@/lib/hooks/api';

const ICON_MAP: { [key: string]: React.ElementType } = {
  Watch: Watch,
  Cpu: Cpu,
  Home: Home,
  Shirt: Shirt,
  Sparkles: Sparkles,
  Headphones: Headphones,
};

export default function CategoryBubbles() {
  const { language } = useApp();
  const { categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="h-6 w-48 bg-gray-100 rounded-full animate-pulse mb-4" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-28 rounded-2xl bg-white border border-gray-100 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-brand-navy tracking-tight">
            {language === 'bn' ? 'ক্যাটাগরি সমূহ' : 'Browse Categories'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            {language === 'bn' ? 'আপনার প্রয়োজনীয় ট্রেন্ডিং পণ্য বেছে নিন' : 'Choose from our trending product collections'}
          </p>
        </div>
        <Link
          href="/categories"
          className="text-xs sm:text-sm font-bold text-brand-orange hover:text-[#e55f00] transition flex items-center gap-1"
        >
          <span>{language === 'bn' ? 'সব দেখুন' : 'View All'}</span>
          <span>→</span>
        </Link>
      </div>

      {/* Horizontal Scroll on mobile, Grid on desktop */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const IconComp = (cat.icon && ICON_MAP[cat.icon]) || Layers;
          return (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-white border border-gray-100 hover:border-orange-300 hover:shadow-lg hover:-translate-y-0.5 transition-all text-center"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-orange-50 group-hover:bg-brand-orange text-brand-orange group-hover:text-white transition-colors duration-300 flex items-center justify-center mb-2 sm:mb-3 shadow-xs">
                <IconComp className="w-6 h-6 transition-transform group-hover:scale-110" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-800 group-hover:text-brand-orange line-clamp-1 transition-colors">
                {language === 'bn' ? cat.name_bn : cat.name_en}
              </span>
              <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                {language === 'bn'
                  ? `${cat.product_count ?? 0}+ আইটেম`
                  : `${cat.product_count ?? 0}+ items`}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
