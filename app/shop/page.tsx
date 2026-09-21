'use client';

import React, { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  SlidersHorizontal,
  X,
  RotateCcw,
  Search,
  ChevronDown,
  Flame,
  Award,
  Sparkles,
  Tag,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/storefront/ProductCard';
import {
  ProductGridSkeleton,
  SectionError,
} from '@/components/common/LoadingStates';
import { useCategories, useProducts } from '@/lib/hooks/api';
import type { ProductQuery } from '@/lib/api/endpoints';
import type { ProductSort } from '@/lib/api/types';
import { formatPriceBD, toBanglaNumber } from '@/lib/bangladesh-data';

const PRICE_MAX = 10000;
const PAGE_SIZE = 12;

/** The nav/footer use `?filter=`; map each to a real API filter. */
type QuickFilter = 'all' | 'trending' | 'new-arrivals' | 'best-sellers' | 'deals';

const QUICK_FILTERS: { value: QuickFilter; label_en: string; label_bn: string; icon: React.ElementType }[] = [
  { value: 'all', label_en: 'All', label_bn: 'সব', icon: Tag },
  { value: 'trending', label_en: 'Trending', label_bn: 'ট্রেন্ডিং', icon: Flame },
  { value: 'new-arrivals', label_en: 'New Arrivals', label_bn: 'নতুন কালেকশন', icon: Sparkles },
  { value: 'best-sellers', label_en: 'Best Sellers', label_bn: 'বেস্ট সেলার', icon: Award },
  { value: 'deals', label_en: 'Deals', label_bn: 'ধামাকা অফার', icon: Tag },
];

function isQuickFilter(value: string | null): value is QuickFilter {
  return (
    value === 'all' ||
    value === 'trending' ||
    value === 'new-arrivals' ||
    value === 'best-sellers' ||
    value === 'deals'
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const paramsKey = searchParams.toString();

  // Remounting on any URL change makes the URL the source of truth for the
  // entry filters, so there is no effect copying params into state.
  return <ShopFilters key={paramsKey} paramsKey={paramsKey} />;
}

function ShopFilters({ paramsKey }: { paramsKey: string }) {
  const router = useRouter();
  const { language } = useApp();

  const initial = useMemo(() => {
    const params = new URLSearchParams(paramsKey);
    const filter = params.get('filter');
    return {
      category: params.get('category') || 'all',
      search: params.get('search') || '',
      quick: (isQuickFilter(filter) ? filter : 'all') as QuickFilter,
    };
  }, [paramsKey]);

  const [selectedCategory, setSelectedCategory] = useState<string>(initial.category);
  const [quickFilter, setQuickFilter] = useState<QuickFilter>(initial.quick);
  const [searchQuery, setSearchQuery] = useState<string>(initial.search);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_MAX);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [onSaleOnly, setOnSaleOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<ProductSort>('trending');
  const [page, setPage] = useState<number>(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const { categories } = useCategories();

  // Any filter change starts a new result set. Deliberately one effect rather
  // than a setPage(1) sprinkled through a dozen handlers, where it is easy to
  // forget one.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- single place to reset paging when filters change
    setPage(1);
  }, [selectedCategory, searchQuery, minPrice, maxPrice, inStockOnly, onSaleOnly, quickFilter, sortBy]);

  const query: ProductQuery = {
    categorySlug: selectedCategory !== 'all' ? selectedCategory : undefined,
    search: searchQuery.trim() || undefined,
    minPrice: minPrice > 0 ? minPrice : undefined,
    maxPrice: maxPrice < PRICE_MAX ? maxPrice : undefined,
    inStock: inStockOnly || undefined,
    onSale: onSaleOnly || quickFilter === 'deals' || undefined,
    trending: quickFilter === 'trending' || undefined,
    newArrival: quickFilter === 'new-arrivals' || undefined,
    bestSeller: quickFilter === 'best-sellers' || undefined,
    sort: sortBy,
    page,
    limit: PAGE_SIZE,
  };

  const { products, total, totalPages, isLoading, error, refresh } = useProducts(query);

  const catalogSize = categories.reduce(
    (sum, category) => sum + (category.product_count ?? 0),
    0,
  );

  const resetFilters = () => {
    setSelectedCategory('all');
    setQuickFilter('all');
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(PRICE_MAX);
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSortBy('trending');
    setPage(1);
    router.push('/shop');
  };

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (quickFilter !== 'all' ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0) +
    (minPrice > 0 || maxPrice < PRICE_MAX ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (onSaleOnly ? 1 : 0);

  const goToPage = (next: number) => {
    setPage(Math.min(Math.max(next, 1), Math.max(totalPages, 1)));
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Page Title & Breadcrumb */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
          {language === 'bn' ? 'সকল ট্রেন্ডিং পণ্য' : 'All Trending Products'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {language === 'bn'
            ? 'খুঁজে নিন আপনার প্রয়োজনীয় লাইফস্টাইল ও টেক পণ্য সবচেয়ে আকর্ষণীয় মূল্যে'
            : 'Explore innovative daily gadgets, lifestyle tech, and smart home items'}
        </p>
      </div>

      {/* Quick filter pills — these back the nav/footer `?filter=` links */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {QUICK_FILTERS.map((option) => {
          const Icon = option.icon;
          const isActive = quickFilter === option.value;
          return (
            <button
              key={option.value}
              onClick={() => setQuickFilter(option.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                isActive
                  ? 'bg-brand-orange text-white border-brand-orange shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-brand-navy'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? option.label_bn : option.label_en}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-72 shrink-0 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs sticky top-24 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 font-black text-brand-navy text-sm">
              <SlidersHorizontal className="w-4 h-4 text-brand-orange" />
              <span>{language === 'bn' ? 'ফিল্টার' : 'Filters'}</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-brand-orange hover:underline font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
              </button>
            )}
          </div>

          {/* Search in Catalog */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              {language === 'bn' ? 'পণ্য খুঁজুন' : 'Search Product'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'bn' ? 'নাম বা ব্র্যান্ড...' : 'Name or brand...'}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:border-brand-orange outline-hidden"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              {language === 'bn' ? 'ক্যাটাগরি' : 'Category'}
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition ${
                  selectedCategory === 'all'
                    ? 'bg-orange-50 text-brand-orange font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}</span>
                <span className="text-[10px] text-gray-400">({catalogSize})</span>
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition ${
                    selectedCategory === cat.slug
                      ? 'bg-orange-50 text-brand-orange font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="truncate">{language === 'bn' ? cat.name_bn : cat.name_en}</span>
                  <span className="text-[10px] text-gray-400">
                    ({cat.product_count ?? 0})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              {language === 'bn' ? 'মূল্য সীমা (৳)' : 'Price Range (৳)'}
            </label>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max={PRICE_MAX}
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-orange cursor-pointer"
              />
              <div className="flex items-center justify-between text-xs text-gray-600 font-semibold">
                <span>৳{language === 'bn' ? toBanglaNumber(formatPriceBD(minPrice)) : formatPriceBD(minPrice)}</span>
                <span>৳{language === 'bn' ? toBanglaNumber(formatPriceBD(maxPrice)) : formatPriceBD(maxPrice)}</span>
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-2.5 pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange cursor-pointer"
              />
              <span>{language === 'bn' ? 'শুধুমাত্র ইন-স্টক পণ্য' : 'In-Stock Only'}</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onSaleOnly}
                onChange={(e) => setOnSaleOnly(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-brand-orange focus:ring-brand-orange cursor-pointer"
              />
              <span>{language === 'bn' ? 'ডিসকাউন্ট / ছাড়কৃত পণ্য' : 'On Sale Deals Only'}</span>
            </label>
          </div>
        </aside>

        {/* Main Products Grid & Top Controls */}
        <main className="flex-1 w-full space-y-5">
          {/* Top Filter & Sort Bar */}
          <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
            {/* Left: Mobile Filter Toggle + Product Count */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-3 py-2 rounded-xl bg-orange-50 text-brand-orange text-xs font-bold flex items-center gap-1.5 border border-orange-200"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ফিল্টার' : 'Filters'}</span>
                {activeFiltersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-brand-orange text-white text-[9px] flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <span className="text-xs text-gray-500 font-medium">
                {isLoading
                  ? language === 'bn'
                    ? 'খোঁজা হচ্ছে...'
                    : 'Searching...'
                  : language === 'bn'
                  ? `মোট ${toBanglaNumber(total)}টি পণ্য পাওয়া গেছে`
                  : `Found ${total} items`}
              </span>
            </div>

            {/* Right: Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 font-medium hidden sm:inline">
                {language === 'bn' ? 'সাজান:' : 'Sort By:'}
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as ProductSort)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-800 pr-8 appearance-none focus:outline-hidden focus:border-brand-orange cursor-pointer"
                >
                  <option value="trending">{language === 'bn' ? '🔥 ট্রেন্ডিং ও জনপ্রিয়' : '🔥 Trending & Popular'}</option>
                  <option value="price_asc">{language === 'bn' ? 'মূল্য: কম থেকে বেশি' : 'Price: Low to High'}</option>
                  <option value="price_desc">{language === 'bn' ? 'মূল্য: বেশি থেকে কম' : 'Price: High to Low'}</option>
                  <option value="rating">{language === 'bn' ? 'সর্বোচ্চ রেটিং' : 'Highest Rated'}</option>
                  <option value="newest">{language === 'bn' ? 'নতুন পণ্য' : 'Newest'}</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active Filter Pills Strip */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-gray-400">
                {language === 'bn' ? 'সক্রিয় ফিল্টার:' : 'Active:'}
              </span>
              {quickFilter !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-100 text-brand-orange text-xs font-bold">
                  <span>
                    {QUICK_FILTERS.find((f) => f.value === quickFilter)?.[
                      language === 'bn' ? 'label_bn' : 'label_en'
                    ]}
                  </span>
                  <button onClick={() => setQuickFilter('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-100 text-brand-orange text-xs font-bold">
                  <span>
                    {categories.find((c) => c.slug === selectedCategory)?.[language === 'bn' ? 'name_bn' : 'name_en']}
                  </span>
                  <button onClick={() => setSelectedCategory('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery.trim() && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-semibold">
                  <span>&ldquo;{searchQuery}&rdquo;</span>
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {maxPrice < PRICE_MAX && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gray-100 text-gray-800 text-xs font-semibold">
                  <span>≤ ৳{language === 'bn' ? toBanglaNumber(formatPriceBD(maxPrice)) : formatPriceBD(maxPrice)}</span>
                  <button onClick={() => setMaxPrice(PRICE_MAX)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-semibold">
                  <span>{language === 'bn' ? 'ইন-স্টক' : 'In Stock'}</span>
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:underline font-bold px-2 py-1"
              >
                {language === 'bn' ? 'সব মুছুন' : 'Clear All'}
              </button>
            </div>
          )}

          {/* Product Grid */}
          {error ? (
            <SectionError onRetry={() => refresh()} />
          ) : isLoading && products.length === 0 ? (
            <ProductGridSkeleton count={6} />
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <button
                    onClick={() => goToPage(page - 1)}
                    disabled={page <= 1}
                    className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand-orange hover:text-brand-orange transition"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => goToPage(pageNumber)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                          pageNumber === page
                            ? 'bg-brand-orange text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-brand-orange hover:text-brand-orange'
                        }`}
                      >
                        {language === 'bn' ? toBanglaNumber(pageNumber) : pageNumber}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => goToPage(page + 1)}
                    disabled={page >= totalPages}
                    className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand-orange hover:text-brand-orange transition"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-brand-orange flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-brand-navy">
                {language === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি' : 'No Products Found'}
              </h3>
              <p className="text-xs text-gray-500">
                {language === 'bn'
                  ? 'আপনার নির্বাচিত ফিল্টারের সাথে কোনো পণ্য মেলেনি। অনুগ্রহ করে ফিল্টার পরিবর্তন করুন।'
                  : 'No items match your chosen filters. Please adjust or reset your search.'}
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold hover:bg-[#e55f00] transition"
              >
                {language === 'bn' ? 'ফিল্টার রিসেট করুন' : 'Reset All Filters'}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawer Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative ml-auto w-80 max-w-full bg-white h-full p-6 overflow-y-auto z-10 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 font-black text-brand-navy text-base">
                  <SlidersHorizontal className="w-5 h-5 text-brand-orange" />
                  <span>{language === 'bn' ? 'ফিল্টারসমূহ' : 'Filters'}</span>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  {language === 'bn' ? 'ক্যাটাগরি' : 'Category'}
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                      selectedCategory === 'all'
                        ? 'bg-orange-50 text-brand-orange font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}</span>
                    <span className="text-[10px] text-gray-400">({catalogSize})</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between ${
                        selectedCategory === cat.slug
                          ? 'bg-orange-50 text-brand-orange font-bold'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="truncate">{language === 'bn' ? cat.name_bn : cat.name_en}</span>
                      <span className="text-[10px] text-gray-400">
                        ({cat.product_count ?? 0})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  {language === 'bn' ? 'সর্বোচ্চ মূল্য (৳)' : 'Max Price (৳)'}
                </label>
                <input
                  type="range"
                  min="0"
                  max={PRICE_MAX}
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand-orange cursor-pointer"
                />
                <p className="text-right text-xs font-bold text-brand-navy mt-1">
                  ৳{language === 'bn' ? toBanglaNumber(formatPriceBD(maxPrice)) : formatPriceBD(maxPrice)}
                </p>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-orange focus:ring-brand-orange"
                  />
                  <span>{language === 'bn' ? 'ইন-স্টক পণ্য' : 'In-Stock Only'}</span>
                </label>
                <label className="flex items-center gap-2.5 text-xs font-medium text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onSaleOnly}
                    onChange={(e) => setOnSaleOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-orange focus:ring-brand-orange"
                  />
                  <span>{language === 'bn' ? 'ডিসকাউন্ট অফার' : 'On Sale Only'}</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700"
              >
                {language === 'bn' ? 'রিসেট' : 'Reset'}
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-brand-orange text-white text-xs font-bold"
              >
                {language === 'bn' ? 'প্রয়োগ করুন' : 'Apply'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm font-medium text-gray-500">
          লোডিং হচ্ছে...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
