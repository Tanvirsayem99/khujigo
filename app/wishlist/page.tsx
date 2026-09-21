'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/storefront/ProductCard';

export default function WishlistPage() {
  const { language, wishlist } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight flex items-center gap-2">
            <Heart className="w-7 h-7 text-rose-500 fill-rose-500" />
            <span>{language === 'bn' ? 'আমার উইশলিস্ট' : 'My Wishlist'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {language === 'bn'
              ? `আপনার পছন্দের ${wishlist.length}টি পণ্য সংরক্ষিত রয়েছে`
              : `${wishlist.length} items saved for later`}
          </p>
        </div>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.map((item) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto py-16 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-brand-navy">
            {language === 'bn' ? 'উইশলিস্টে কোনো পণ্য নেই' : 'Your Wishlist is Empty'}
          </h3>
          <p className="text-xs text-gray-500">
            {language === 'bn'
              ? 'আপনার পছন্দের গ্যাজেট বা লাইফস্টাইল পণ্যগুলোতে হার্ট আইকন ক্লিক করে উইশলিস্টে যোগ করুন।'
              : 'Save products you love by clicking the heart icon on any product.'}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-[#e55f00] shadow-md transition"
          >
            <span>{language === 'bn' ? 'পণ্য ব্রাউজ করুন' : 'Explore Products'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
