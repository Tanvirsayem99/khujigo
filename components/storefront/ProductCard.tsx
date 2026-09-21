'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, Zap, Star, Flame, CheckCircle2 } from 'lucide-react';
import { Product } from '@/types';
import { useApp } from '@/context/AppContext';
import { formatPriceBD, toBanglaNumber } from '@/lib/bangladesh-data';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const router = useRouter();
  const { language, t, addToCart, isInWishlist, toggleWishlist, showToast } = useApp();

  const isWishlisted = isInWishlist(product.id);
  const discountPercent = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    router.push('/checkout');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const formattedPrice = language === 'bn' ? toBanglaNumber(formatPriceBD(product.price)) : formatPriceBD(product.price);
  const formattedComparePrice = product.compare_price
    ? language === 'bn' ? toBanglaNumber(formatPriceBD(product.compare_price)) : formatPriceBD(product.compare_price)
    : null;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-white rounded-2xl border border-gray-100/90 shadow-xs hover:shadow-xl hover:border-orange-200 transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Thumbnail Area */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={product.thumbnail_url}
          alt={language === 'bn' ? product.name_bn : product.name_en}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          priority={priority}
          referrerPolicy="no-referrer"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-red-600 to-rose-500 text-white text-[11px] font-black tracking-tight shadow-sm">
              {language === 'bn' ? `${toBanglaNumber(discountPercent)}% ছাড়` : `${discountPercent}% OFF`}
            </span>
          )}
          {product.is_trending && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-bold shadow-sm">
              <Flame className="w-3 h-3 fill-current text-amber-200" />
              <span>{language === 'bn' ? 'ট্রেন্ডিং' : 'Hot'}</span>
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-md z-10 ${
            isWishlisted
              ? 'bg-rose-500 text-white scale-110 shadow-rose-500/30'
              : 'bg-white/90 text-gray-500 hover:text-rose-500 hover:bg-white'
          }`}
          title={language === 'bn' ? 'উইশলিস্টে যুক্ত করুন' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Low Stock Pill */}
        {product.stock_quantity > 0 && product.stock_quantity <= product.low_stock_threshold && (
          <div className="absolute bottom-2 left-2 right-2 bg-amber-900/80 backdrop-blur-xs text-amber-200 text-[10px] font-semibold px-2 py-1 rounded-md text-center">
            {language === 'bn' ? `দ্রুত শেষ হচ্ছে! আর মাত্র ${toBanglaNumber(product.stock_quantity)}টি বাকি` : `Hurry! Only ${product.stock_quantity} left`}
          </div>
        )}
      </Link>

      {/* Content Area */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 text-xs text-gray-500 mb-1.5">
            <span className="font-medium text-brand-orange uppercase tracking-wider text-[10px]">
              {product.brand || 'KhujiGo'}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-gray-400 text-[10px]">({product.reviews_count})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`} className="block group/title">
            <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 min-h-[2.5rem] group-hover/title:text-brand-orange transition-colors">
              {language === 'bn' ? product.name_bn : product.name_en}
            </h3>
          </Link>
        </div>

        {/* Pricing and Action Buttons */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-black text-brand-navy">
              ৳{formattedPrice}
            </span>
            {formattedComparePrice && (
              <span className="text-xs text-gray-400 line-through">
                ৳{formattedComparePrice}
              </span>
            )}
          </div>

          {/* Dual Action Buttons (Add to Cart + Buy Now) */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              id={`add-cart-btn-${product.id}`}
              onClick={handleAddToCart}
              className="w-full py-2 px-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-brand-orange text-xs font-bold transition flex items-center justify-center gap-1 border border-orange-200/60 active:scale-95"
              title={language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{language === 'bn' ? 'কার্ট' : 'Add'}</span>
            </button>
            <button
              id={`buy-now-btn-${product.id}`}
              onClick={handleBuyNow}
              className="w-full py-2 px-2 rounded-xl bg-gradient-to-r from-brand-orange to-orange-500 hover:from-[#e55f00] hover:to-orange-600 text-white text-xs font-bold transition shadow-sm shadow-orange-500/25 flex items-center justify-center gap-1 active:scale-95"
              title={language === 'bn' ? 'সরাসরি অর্ডার করুন' : 'Order Now'}
            >
              <Zap className="w-3.5 h-3.5 fill-current shrink-0" />
              <span className="truncate">{language === 'bn' ? 'অর্ডার' : 'Buy Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
