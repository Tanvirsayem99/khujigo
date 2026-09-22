'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Share2,
  MessageCircle,
  ChevronRight,
  Minus,
  Plus,
  AlertCircle,
  Package,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/storefront/ProductCard';
import { submitReview } from '@/lib/api/endpoints';
import {
  useCategories,
  useDeliverySettings,
  useProduct,
  useProductReviews,
  useRelatedProducts,
} from '@/lib/hooks/api';
import { formatPriceBD, toBanglaNumber } from '@/lib/bangladesh-data';
import { CONTACT_INFO } from '@/lib/constants';
import { trackViewContent } from '@/lib/analytics/facebook-pixel';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { language, addToCart, isInWishlist, toggleWishlist, showToast } = useApp();

  // `:idOrSlug` on the API accepts either, so the old fallback is unnecessary.
  const { product, isLoading } = useProduct(slug);
  const { reviews, refresh: refreshReviews } = useProductReviews(product?.id);
  const { products: relatedProducts } = useRelatedProducts(product?.id, 4);
  const { categories } = useCategories();
  const { settings: deliverySettings } = useDeliverySettings();

  const category = categories.find((c) => c.id === product?.category_id);

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');

  // Review Form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Navigating between detail pages reuses this component, so the id guard is
  // what keeps revalidations from re-reporting the same product.
  const trackedProductId = useRef<string | null>(null);

  useEffect(() => {
    if (!product || trackedProductId.current === product.id) return;
    trackedProductId.current = product.id;
    trackViewContent(product);
  }, [product]);

  if (isLoading && !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="h-4 w-64 bg-gray-100 rounded-full animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-6 h-96 rounded-3xl bg-gray-100 animate-pulse" />
          <div className="lg:col-span-6 space-y-4">
            <div className="h-8 bg-gray-100 rounded-full animate-pulse" />
            <div className="h-4 bg-gray-100 rounded-full w-2/3 animate-pulse" />
            <div className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
            <div className="h-12 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Package className="w-16 h-16 text-gray-400 mx-auto" />
        <h2 className="text-2xl font-black text-brand-navy">
          {language === 'bn' ? 'পণ্যটি খুঁজে পাওয়া যায়নি' : 'Product Not Found'}
        </h2>
        <p className="text-sm text-gray-500">
          {language === 'bn'
            ? 'আপনি যে পণ্যটি খুঁজছেন তা সরিয়ে ফেলা হয়েছে অথবা লিংকটি সঠিক নয়।'
            : 'The product you are looking for might have been removed or link is incorrect.'}
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold shadow-md hover:bg-[#e55f00]"
        >
          {language === 'bn' ? 'সকল পণ্য দেখুন' : 'Browse All Products'}
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const discountPercent = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0;
  const savings = product.compare_price ? product.compare_price - product.price : 0;

  const gallery = [product.thumbnail_url, ...(product.gallery_urls || [])].filter(Boolean);
  const mainImage =
    selectedImage || product.thumbnail_url || 'https://picsum.photos/seed/placeholder/600/600';

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push('/checkout');
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(
        language === 'bn' ? 'পণ্যের লিংক কপি করা হয়েছে!' : 'Product link copied!',
        'success'
      );
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      showToast(
        language === 'bn' ? 'অনুগ্রহ করে আপনার নাম ও মতামত লিখুন' : 'Please fill in your name and review',
        'error'
      );
      return;
    }

    setIsSubmittingReview(true);
    try {
      await submitReview({
        productId: product.id,
        customerName: reviewName.trim(),
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      setReviewName('');
      setReviewComment('');
      await refreshReviews();

      showToast(
        language === 'bn'
          ? 'ধন্যবাদ! আপনার রিভিউ পর্যালোচনার জন্য জমা হয়েছে।'
          : 'Thank you! Your review has been sent for moderation.',
        'success'
      );
    } catch {
      showToast(
        language === 'bn'
          ? 'রিভিউ জমা দেওয়া যায়নি। আবার চেষ্টা করুন।'
          : 'Could not submit your review. Please try again.',
        'error'
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const formattedPrice = language === 'bn' ? toBanglaNumber(formatPriceBD(product.price)) : formatPriceBD(product.price);
  const formattedComparePrice = product.compare_price
    ? language === 'bn' ? toBanglaNumber(formatPriceBD(product.compare_price)) : formatPriceBD(product.compare_price)
    : null;
  const formattedSavings = language === 'bn' ? toBanglaNumber(formatPriceBD(savings)) : formatPriceBD(savings);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10 sm:space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/" className="hover:text-brand-orange">
          {language === 'bn' ? 'হোম' : 'Home'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <Link href="/shop" className="hover:text-brand-orange">
          {language === 'bn' ? 'শপ' : 'Shop'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <Link
          href={category ? `/shop?category=${category.slug}` : '/shop'}
          className="hover:text-brand-orange"
        >
          {category
            ? language === 'bn'
              ? category.name_bn
              : category.name_en
            : language === 'bn'
            ? 'শপ'
            : 'Shop'}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="text-gray-800 font-bold truncate max-w-[200px] sm:max-w-xs">
          {language === 'bn' ? product.name_bn : product.name_en}
        </span>
      </nav>

      {/* Main Product Two-Column Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Display Image */}
          <div className="relative aspect-square w-full rounded-3xl bg-white border border-gray-100 shadow-md overflow-hidden p-2 group">
            <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gray-50">
              <Image
                src={mainImage}
                alt={language === 'bn' ? product.name_bn : product.name_en}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
                referrerPolicy="no-referrer"
              />

              {/* Discount Badge */}
              {discountPercent > 0 && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white font-black text-xs shadow-md">
                  {language === 'bn' ? `${toBanglaNumber(discountPercent)}% ছাড়` : `${discountPercent}% OFF`}
                </div>
              )}
            </div>
          </div>

          {/* Thumbnail Gallery Strip */}
          {gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {gallery.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all p-1 bg-white ${
                    mainImage === imgUrl
                      ? 'border-brand-orange shadow-md scale-102'
                      : 'border-gray-200 hover:border-gray-300 opacity-80'
                  }`}
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <Image
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Overview, Pricing, Delivery, and Buy Buttons */}
        <div className="lg:col-span-6 space-y-6">
          {/* Title and Rating */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-black text-brand-orange uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-lg border border-orange-200">
                {product.brand || 'KhujiGo Verified'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2 rounded-xl transition ${
                    isWishlisted ? 'bg-rose-50 text-rose-500' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-brand-navy leading-snug">
              {language === 'bn' ? product.name_bn : product.name_en}
            </h1>

            {/* Rating Stars & SKU */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2.5 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-gray-400">({product.reviews_count} {language === 'bn' ? 'রিভিউ' : 'reviews'})</span>
              </div>
              <span className="text-gray-400">SKU: <span className="font-mono text-gray-700">{product.sku}</span></span>
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ভেরিফায়েড স্টক' : 'Verified Stock'}</span>
              </span>
            </div>
          </div>

          {/* Pricing Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50/50 border border-orange-200/80 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-brand-navy">
                ৳{formattedPrice}
              </span>
              {formattedComparePrice && (
                <span className="text-base sm:text-lg text-gray-400 line-through">
                  ৳{formattedComparePrice}
                </span>
              )}
            </div>

            {savings > 0 && (
              <p className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {language === 'bn'
                    ? `আপনি এই অর্ডারে মোট ৳${formattedSavings} সাশ্রয় করছেন!`
                    : `You save ৳${formattedSavings} on this deal!`}
                </span>
              </p>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
            {language === 'bn' ? product.short_desc_bn : product.short_desc_en}
          </p>

          {/* Stock Alert */}
          <div>
            {product.stock_quantity > 0 ? (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  {product.stock_quantity <= product.low_stock_threshold
                    ? language === 'bn'
                      ? `আর মাত্র ${toBanglaNumber(product.stock_quantity)}টি বাকি আছে! দ্রুত অর্ডার করুন`
                      : `Hurry! Only ${product.stock_quantity} left in stock`
                    : language === 'bn'
                    ? 'ইন স্টক — দ্রুত ডেলিভারি প্রস্তুত'
                    : 'In Stock — Ready to dispatch'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold text-rose-600">
                <AlertCircle className="w-4 h-4" />
                <span>{language === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}</span>
              </div>
            )}
          </div>

          {/* Quantity Selector & Dual Buy Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-700">
                {language === 'bn' ? 'পরিমাণ:' : 'Quantity:'}
              </span>
              <div className="flex items-center border border-gray-200 rounded-xl bg-white shadow-xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center text-gray-600 hover:text-brand-navy hover:bg-gray-50 rounded-l-xl transition"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-xs font-black text-brand-navy">
                  {language === 'bn' ? toBanglaNumber(quantity) : quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock_quantity || 10, q + 1))}
                  className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center text-gray-600 hover:text-brand-navy hover:bg-gray-50 rounded-r-xl transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons (Full Width on mobile, distinct priority) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                id="product-buy-now-btn"
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-orange to-orange-500 hover:from-[#e55f00] hover:to-orange-600 text-white font-black text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{language === 'bn' ? 'সরাসরি অর্ডার করুন' : 'Buy Now'}</span>
              </button>

              <button
                id="product-add-cart-btn"
                onClick={handleAddToCart}
                className="w-full py-3.5 px-6 rounded-2xl bg-orange-50 hover:bg-orange-100 text-brand-orange font-black text-sm border-2 border-brand-orange/30 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
              </button>
            </div>
          </div>

          {/* Bangladesh Delivery Calculator & Reassurance Widget */}
          <div className="rounded-2xl bg-white p-4 border border-gray-100 shadow-xs space-y-3">
            <h4 className="text-xs font-black text-brand-navy flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-orange" />
              <span>{language === 'bn' ? 'ডেলিভারি তথ্য ও চার্জ' : 'Delivery & Rates'}</span>
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-[11px] font-bold text-gray-700 block">
                  {language === 'bn' ? 'ঢাকা সিটির ভেতরে' : 'Inside Dhaka City'}
                </span>
                <span className="text-sm font-black text-brand-navy">
                  ৳
                  {language === 'bn'
                    ? toBanglaNumber(deliverySettings?.insideDhaka ?? 60)
                    : formatPriceBD(deliverySettings?.insideDhaka ?? 60)}
                </span>
                <span className="text-[10px] text-gray-500 block mt-0.5">
                  {deliverySettings?.estimatedDaysInsideDhaka ??
                    (language === 'bn' ? '১-২ কার্যদিবস' : '1-2 Working Days')}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-[11px] font-bold text-gray-700 block">
                  {language === 'bn' ? 'ঢাকার বাইরে (৬৪ জেলা)' : 'Outside Dhaka'}
                </span>
                <span className="text-sm font-black text-brand-navy">
                  ৳
                  {language === 'bn'
                    ? toBanglaNumber(deliverySettings?.outsideDhaka ?? 120)
                    : formatPriceBD(deliverySettings?.outsideDhaka ?? 120)}
                </span>
                <span className="text-[10px] text-gray-500 block mt-0.5">
                  {deliverySettings?.estimatedDaysOutsideDhaka ??
                    (language === 'bn' ? '২-৪ কার্যদিবস' : '2-4 Working Days')}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-gray-600">
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'bn' ? 'ক্যাশ অন ডেলিভারি প্রযোজ্য' : 'Cash on Delivery'}</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'bn' ? '৭ দিনের রিপ্লেসমেন্ট গ্যারান্টি' : '7 Days Return'}</span>
              </div>
            </div>

            {/* Direct WhatsApp Callout for this product */}
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(
                `Hello KhujiGo, I want to order/inquire about: ${product.name_en} (SKU: ${product.sku})`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition border border-emerald-200/60"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে সরাসরি প্রশ্ন বা অর্ডার করুন' : 'Order via WhatsApp'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Tabs Section: Description, Specifications, Reviews */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs space-y-6">
        {/* Tab Headers */}
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('desc')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'desc'
                ? 'bg-brand-orange text-white shadow-xs'
                : 'text-gray-600 hover:text-brand-navy hover:bg-gray-50'
            }`}
          >
            {language === 'bn' ? 'পণ্যের বিবরণ' : 'Description'}
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'specs'
                ? 'bg-brand-orange text-white shadow-xs'
                : 'text-gray-600 hover:text-brand-navy hover:bg-gray-50'
            }`}
          >
            {language === 'bn' ? 'স্পেসিফিকেশন' : 'Specifications'}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'bg-brand-orange text-white shadow-xs'
                : 'text-gray-600 hover:text-brand-navy hover:bg-gray-50'
            }`}
          >
            {language === 'bn' ? `রিভিউ (${reviews.length})` : `Reviews (${reviews.length})`}
          </button>
        </div>

        {/* Tab 1: Description */}
        {activeTab === 'desc' && (
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4">
            <p className="text-sm sm:text-base font-medium">
              {language === 'bn' ? product.description_bn : product.description_en}
            </p>
            {product.tags && product.tags.length > 0 && (
              <div className="pt-4 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-gray-400">Tags:</span>
                {product.tags.map((tag, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Specifications */}
        {activeTab === 'specs' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 px-4 font-bold text-gray-500 bg-gray-50 w-1/3">
                    {language === 'bn' ? 'ব্র্যান্ড' : 'Brand'}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-brand-navy">
                    {product.brand}
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 px-4 font-bold text-gray-500 bg-gray-50">
                    {language === 'bn' ? 'মডেল / SKU' : 'Model / SKU'}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-brand-navy font-mono">
                    {product.sku}
                  </td>
                </tr>
                {product.specifications?.map((spec, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2.5 px-4 font-bold text-gray-500 bg-gray-50">
                      {language === 'bn' ? spec.key_bn : spec.key_en}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-brand-navy">
                      {language === 'bn' ? spec.value_bn : spec.value_en}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Reviews and Add Review */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            {/* Reviews List */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-brand-navy">
                {language === 'bn' ? 'গ্রাহকদের মতামত' : 'Customer Feedback'}
              </h3>
              {reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reviews.map((r) => (
                    <div key={r.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-brand-navy">{r.customer_name}</span>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, idx) => (
                            <Star
                              key={idx}
                              className={`w-3.5 h-3.5 ${
                                idx < r.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 italic">&ldquo;{r.comment}&rdquo;</p>
                      <span className="text-[10px] text-gray-400 block">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  {language === 'bn' ? 'এই পণ্যে এখনও কোনো রিভিউ নেই। প্রথম রিভিউ দিন!' : 'No reviews yet for this product. Be the first to review!'}
                </p>
              )}
            </div>

            {/* Write a Review Box */}
            <div className="pt-6 border-t border-gray-100 max-w-xl">
              <h4 className="text-sm font-black text-brand-navy mb-4">
                {language === 'bn' ? 'আপনার মতামত ও রেটিং দিন' : 'Write a Review'}
              </h4>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {language === 'bn' ? 'রেটিং নির্বাচন করুন:' : 'Rating:'}
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-amber-400 hover:scale-110 transition"
                      >
                        <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {language === 'bn' ? 'আপনার পূর্ণ নাম' : 'Your Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder={language === 'bn' ? 'উদাঃ তানভীর হাসান' : 'e.g. Tanvir Hasan'}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:border-brand-orange outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {language === 'bn' ? 'পণ্যের গুণমান ও অভিজ্ঞতা' : 'Your Review'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={language === 'bn' ? 'পণ্যটি আপনার কেমন লেগেছে লিখুন...' : 'Write your honest experience with this product...'}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:border-brand-orange outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-black text-white text-xs font-bold transition disabled:opacity-50"
                >
                  {isSubmittingReview
                    ? (language === 'bn' ? 'জমা হচ্ছে...' : 'Submitting...')
                    : (language === 'bn' ? 'রিভিউ জমা দিন' : 'Submit Review')}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-black text-brand-navy">
              {language === 'bn' ? 'সম্পর্কিত অন্যান্য ট্রেন্ডিং পণ্য' : 'Related Products'}
            </h3>
            <Link href="/shop" className="text-xs font-bold text-brand-orange hover:underline">
              {language === 'bn' ? 'আরও দেখুন' : 'View More'}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
