'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, wishlist, setIsCartOpen, language } = useApp();

  const navItems = useMemo(
    () => [
      { href: '/', label_bn: 'হোম', label_en: 'Home', icon: Home },
      { href: '/shop', label_bn: 'শপ', label_en: 'Shop', icon: Compass },
      { href: '/wishlist', label_bn: 'পছন্দ', label_en: 'Wishlist', icon: Heart, count: wishlist.length },
      {
        action: 'cart',
        label_bn: 'কার্ট',
        label_en: 'Cart',
        icon: ShoppingBag,
        count: cartCount,
        highlight: true,
      },
      { href: '/account', label_bn: 'অ্যাকাউন্ট', label_en: 'Account', icon: User },
    ],
    [wishlist.length, cartCount],
  );

  // Hide bottom nav on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <div
      id="khujigo-mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-orange-100 shadow-[0_-4px_20px_rgba(7,17,31,0.08)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 h-[4.25rem]">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = item.href
            ? pathname === item.href || pathname.startsWith(`${item.href}/`)
            : false;

          if (item.action === 'cart') {
            return (
              <button
                key={idx}
                id="mobile-bottom-cart-btn"
                onClick={() => setIsCartOpen(true)}
                className="flex flex-col items-center justify-center relative transition-transform active:scale-95"
              >
                <div className="relative p-1.5 rounded-full bg-gradient-to-tr from-[#FF6A00] to-[#FFC400] text-white shadow-md shadow-orange-500/30">
                  <Icon className="w-5 h-5" />
                  {item.count && item.count > 0 ? (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-[#07111F] text-white text-[9px] font-extrabold flex items-center justify-center border border-white">
                      {item.count}
                    </span>
                  ) : null}
                </div>
                <span className="text-[10px] font-bold text-brand-orange-deep mt-0.5">
                  {language === 'bn' ? item.label_bn : item.label_en}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={idx}
              href={item.href!}
              className={`flex flex-col items-center justify-center relative transition-colors ${
                isActive ? 'text-brand-orange-deep' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.count && item.count > 0 ? (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-0.5 rounded-full bg-brand-orange-deep text-white text-[9px] font-bold flex items-center justify-center">
                    {item.count}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-bold text-brand-orange-deep' : 'text-gray-600'}`}>
                {language === 'bn' ? item.label_bn : item.label_en}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
