'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Sparkles, ShieldCheck, Truck, Zap, ShoppingBag } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useBanners } from '@/lib/hooks/api';
import { BannerSkeleton } from '@/components/common/LoadingStates';

// Decorative only — cycled per slide so the hero keeps its colour variety now
// that the content comes from the admin panel.
const GRADIENTS = [
  'from-amber-950 via-[#07111F] to-[#0A192F]',
  'from-[#07111F] via-[#112240] to-orange-950',
  'from-orange-950 via-[#0B132B] to-[#1C2541]',
];

const FALLBACK_IMAGE = 'https://picsum.photos/seed/khujigobanner/1200/500';

export default function HeroBanner() {
  const { language } = useApp();
  const { banners, isLoading } = useBanners();
  const [currentSlide, setCurrentSlide] = useState(0);

  const total = banners.length;

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % total);
    }, 6000);
    return () => clearInterval(timer);
  }, [total]);

  // Reserve the hero's space with a skeleton while banners are in flight.
  if (isLoading) return <BannerSkeleton />;

  // Nothing to show once loaded and the admin has added no banners.
  if (total === 0) return null;

  const index = currentSlide % total;
  const active = banners[index];
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const badge = language === 'bn' ? active.badge_bn : active.badge_en;
  const title = language === 'bn' ? active.title_bn : active.title_en;
  const subtitle = language === 'bn' ? active.subtitle_bn : active.subtitle_en;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % total);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + total) % total);

  return (
    <div className="hidden md:block relative w-full overflow-hidden rounded-3xl shadow-xl">
      {/* Slide Container */}
      <div className={`relative bg-gradient-to-r ${gradient} min-h-[460px] lg:min-h-[480px] flex items-center transition-all duration-700`}>
        {/* Subtle Background Radial Highlights */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Text Content */}
          <div className="lg:col-span-7 text-white space-y-4 sm:space-y-5">
            {/* Badge */}
            {badge && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{badge}</span>
              </div>
            )}

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-tight text-white drop-shadow-sm">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-xl font-normal">
              {subtitle}
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-gray-300">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                <Truck className="w-4 h-4 text-brand-orange" />
                <span>{language === 'bn' ? '৬৪ জেলায় হোম ডেলিভারি' : '64 Districts Delivery'}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{language === 'bn' ? 'ক্যাশ অন ডেলিভারি (COD)' : 'Cash on Delivery'}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={active.button_url}
                className="px-6 sm:px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-orange to-orange-500 hover:from-[#e55f00] hover:to-orange-600 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-orange-500/30 transition-all hover:scale-102 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{language === 'bn' ? active.button_text_bn : active.button_text_en}</span>
              </Link>
              <Link
                href="/shop"
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-xs border border-white/20 transition"
              >
                {language === 'bn' ? 'সব পণ্য দেখুন' : 'View All'}
              </Link>
            </div>
          </div>

          {/* Image Showcase */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden p-2 bg-gradient-to-tr from-white/15 to-white/5 backdrop-blur-md border border-white/20 shadow-2xl">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
                <Image
                  src={active.image_url || FALLBACK_IMAGE}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 320px, 384px"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                  priority
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Float Floating Price Badge */}
              <div className="absolute -bottom-2 -left-2 bg-white text-brand-navy p-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-brand-orange flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400">{language === 'bn' ? 'বিশেষ মূল্য' : 'Special Offer'}</p>
                  <p className="text-sm font-black text-brand-orange">৳৪৯৯ থেকে শুরু</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {total > 1 && (
        <>
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md hidden sm:flex items-center justify-center transition border border-white/10 z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md hidden sm:flex items-center justify-center transition border border-white/10 z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Slide Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full">
            {banners.map((banner, idx) => (
              <button
                key={banner.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === idx ? 'w-6 bg-brand-orange' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
