'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, X, Phone, ShieldCheck, Flame, Tag, Sparkles, LogIn, LogOut, Package } from 'lucide-react';
import Logo from '@/components/common/Logo';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { NAV_LINKS, CONTACT_INFO } from '@/lib/constants';

export default function Navbar() {
  const router = useRouter();
  const { language, t, cartCount, cartTotal, wishlist, setIsCartOpen } = useApp();
  const { customer, isCustomerLoggedIn, logoutCustomer, isAdminLoggedIn, adminUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Touch devices never fire `mouseleave`, so dismiss the account menu on an
  // outside tap (the previous hover-only behaviour left it stuck open).
  useEffect(() => {
    if (!accountMenuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [accountMenuOpen]);

  // Stop the page behind the full-screen mobile drawer from scrolling.
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // The shop page owns search & filtering, so route there instead of a
      // dedicated (non-existent) /search page.
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-xs">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#07111F] text-white text-xs border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-0">
            <span className="inline-block w-2 h-2 rounded-full bg-[#FFC400] shrink-0 animate-pulse" />
            <span className="font-medium text-gray-200 text-[11px] sm:text-xs">
              {t.topNotice}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 shrink-0 text-[11px] text-gray-300">
            <a
              href={`tel:${CONTACT_INFO.hotline}`}
              className="flex items-center gap-1.5 hover:text-[#FFC400] transition"
            >
              <Phone className="w-3 h-3 text-[#FF6A00]" />
              <span>{CONTACT_INFO.hotline}</span>
            </a>
            <Link
              href="/admin"
              className="px-2.5 py-0.5 rounded bg-gray-800 hover:bg-[#FF6A00] text-gray-200 hover:text-white transition font-medium text-[10px] tracking-wide"
            >
              {t.adminDashboard}
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navbar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 md:gap-8">
          {/* Mobile Menu Button + Logo */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 -ml-1 rounded-xl text-[#07111F] hover:bg-orange-50 transition"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Logo variant="full" className="shrink-0 hidden sm:inline-flex" />
            <Logo variant="compact" className="shrink-0 sm:hidden" />
          </div>

          {/* Center: Large Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl relative hidden md:block"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                id="navbar-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-11 pr-24 py-2.5 bg-gray-50 border-2 border-orange-100 rounded-full text-sm text-[#07111F] placeholder-gray-400 focus:outline-hidden focus:border-[#FF6A00] focus:bg-white transition-all shadow-2xs"
              />
              <Search className="w-4 h-4 text-[#FF6A00] absolute left-4 pointer-events-none" />
              <button
                type="submit"
                id="navbar-search-submit-btn"
                className="absolute right-1.5 px-4 py-1.5 bg-[#FF6A00] text-white text-xs font-bold rounded-full hover:bg-[#FF8A00] transition-colors shadow-xs shadow-orange-500/20"
              >
                {t.searchBtn}
              </button>
            </div>
          </form>

          {/* Right Utilities (Language, Wishlist, Cart, Account) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher */}
            <div className="hidden lg:block">
              <LanguageSwitcher />
            </div>

            {/* Wishlist Icon — desktop only; on mobile it lives in the drawer */}
            <Link
              href="/wishlist"
              id="navbar-wishlist-btn"
              className="relative hidden md:flex p-2.5 rounded-xl text-gray-700 hover:text-[#FF6A00] hover:bg-orange-50 transition"
              title={t.wishlist}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#07111F] text-white text-[10px] font-bold flex items-center justify-center border border-white">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Trigger */}
            <button
              id="navbar-cart-trigger-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 sm:px-3.5 sm:py-2 rounded-full bg-[#FF6A00]/10 hover:bg-[#FF6A00]/20 text-[#FF6A00] transition flex items-center gap-2 group"
              title={t.cart}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF6A00] text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden xl:flex flex-col text-left leading-none">
                <span className="text-[10px] font-semibold text-gray-500">{t.cart}</span>
                <span className="text-xs font-bold text-[#07111F]">
                  ৳{cartTotal.toLocaleString()}
                </span>
              </div>
            </button>

            {/* Account Dropdown — desktop only; on mobile it lives in the drawer */}
            <div className="relative hidden md:block" ref={accountMenuRef}>
              <button
                id="navbar-account-dropdown-btn"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="p-2.5 sm:px-2.5 sm:py-1.5 rounded-xl text-gray-700 hover:text-[#07111F] hover:bg-orange-50 transition flex items-center gap-1.5"
                title={t.account}
                aria-expanded={accountMenuOpen}
              >
                {isCustomerLoggedIn && customer ? (
                  <div className="w-7 h-7 rounded-full bg-brand-orange text-white text-xs font-bold flex items-center justify-center">
                    {customer.name[0]?.toUpperCase() || 'U'}
                  </div>
                ) : (
                  <User className="w-5 h-5 text-neutral-700" />
                )}
                <span className="hidden lg:inline text-xs font-semibold text-neutral-700 max-w-[100px] truncate">
                  {isCustomerLoggedIn && customer ? customer.name.split(' ')[0] : t.account}
                </span>
              </button>

              {accountMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2.5 z-50 text-xs text-[#07111F]"
                  onMouseLeave={() => setAccountMenuOpen(false)}
                >
                  {isCustomerLoggedIn && customer ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100 mb-1">
                        <p className="font-bold text-brand-navy truncate">{customer.name}</p>
                        <p className="text-[11px] text-gray-500 truncate">{customer.phone || customer.email}</p>
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-orange-50 text-gray-700 hover:text-[#FF6A00] font-medium"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{t.myAccount}</span>
                      </Link>
                      <Link
                        href="/account"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-orange-50 text-gray-700 hover:text-[#FF6A00] font-medium"
                      >
                        <Package className="w-4 h-4 text-gray-400" />
                        <span>{t.myOrders}</span>
                      </Link>
                      <button
                        onClick={() => {
                          logoutCustomer();
                          setAccountMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-rose-600 font-medium text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t.logout}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-orange-50 text-brand-orange font-bold"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>{t.login}</span>
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setAccountMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-orange-50 text-gray-700 font-medium"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{t.register}</span>
                      </Link>
                    </>
                  )}

                  <div className="h-px bg-gray-100 my-1.5" />
                  <Link
                    href={isAdminLoggedIn ? '/admin' : '/admin-login'}
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-brand-orange hover:bg-orange-50 font-medium text-[11px]"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>
                      {isAdminLoggedIn
                        ? `${t.adminDashboard} (${adminUser?.role})`
                        : `${t.adminDashboard} (লগইন)`}
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Row (on small screens) */}
        <div className="px-4 pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              id="mobile-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-16 py-2 bg-gray-50 border border-orange-200 rounded-full text-xs text-[#07111F] placeholder-gray-400 focus:outline-hidden focus:border-[#FF6A00]"
            />
            <Search className="w-3.5 h-3.5 text-[#FF6A00] absolute left-3 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 px-3 py-1 bg-[#FF6A00] text-white text-[11px] font-bold rounded-full"
            >
              {t.searchBtn}
            </button>
          </form>
        </div>
      </div>

      {/* 3. Category & Navigation Bar (Sub-Nav) */}
      <nav className="bg-[#FFF9F2] border-b border-orange-200/60 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1 py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-full transition flex items-center gap-1.5 ${
                  link.isDeal
                    ? 'bg-[#FFC400]/20 text-[#07111F] font-bold hover:bg-[#FFC400]/40'
                    : link.badge === 'HOT'
                    ? 'text-[#FF6A00] hover:bg-orange-100 font-bold'
                    : 'text-[#07111F] hover:text-[#FF6A00] hover:bg-orange-100/50'
                }`}
              >
                {link.badge === 'HOT' && <Flame className="w-3.5 h-3.5 text-[#FF6A00]" />}
                {link.isDeal && <Tag className="w-3.5 h-3.5 text-[#FF6A00]" />}
                <span>{language === 'bn' ? link.label_bn : link.label_en}</span>
                {link.badge && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#FF6A00] text-white text-[9px] font-extrabold tracking-wider">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 py-2 text-xs text-gray-600">
            <span className="flex items-center gap-1 text-[#FF6A00] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.freeDeliveryText}</span>
            </span>
          </div>
        </div>
      </nav>

      {/* 4. Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col bg-white">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#FFF9F2]">
            <Logo variant="full" />
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100"
              aria-label="Close Navigation Menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-600">ভাষা / Language:</span>
            <LanguageSwitcher />
          </div>

          <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
            <div className="py-2 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-[#07111F] hover:bg-orange-50 hover:text-[#FF6A00]"
                >
                  <span className="flex items-center gap-2">
                    {link.badge === 'HOT' && <Flame className="w-4 h-4 text-[#FF6A00]" />}
                    {link.isDeal && <Tag className="w-4 h-4 text-[#FF6A00]" />}
                    {language === 'bn' ? link.label_bn : link.label_en}
                  </span>
                  {link.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-[#FF6A00] text-white text-[10px] font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            <div className="py-4 space-y-2">
              {isCustomerLoggedIn && customer ? (
                <>
                  <div className="px-3 py-2 bg-orange-50/70 rounded-xl mb-2">
                    <p className="font-bold text-xs text-brand-navy">{customer.name}</p>
                    <p className="text-[11px] text-gray-500">{customer.phone || customer.email}</p>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-[#FF6A00]"
                  >
                    <User className="w-4 h-4 text-[#FF6A00]" />
                    <span>{t.myAccount}</span>
                  </Link>
                  <button
                    onClick={() => {
                      logoutCustomer();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.logout}</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 px-3 rounded-xl text-xs font-bold text-white bg-brand-orange"
                  >
                    {t.login}
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 px-3 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100"
                  >
                    {t.register}
                  </Link>
                </div>
              )}

              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-[#FF6A00]"
              >
                <Heart className="w-4 h-4 text-[#FF6A00]" />
                <span>{t.wishlist}</span>
                {wishlist.length > 0 && (
                  <span className="ml-auto min-w-[20px] h-5 px-1 rounded-full bg-[#FF6A00] text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <Link
                href={isAdminLoggedIn ? '/admin' : '/admin-login'}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-bold text-[#FF6A00] bg-orange-50"
              >
                {t.adminDashboard} {isAdminLoggedIn ? `(${adminUser?.role})` : ''}
              </Link>
            </div>
          </div>

          {/* Hotline in mobile drawer */}
          <div className="p-4 bg-[#FFF9F2] border-t border-orange-100 text-center">
            <a
              href={`tel:${CONTACT_INFO.hotline}`}
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#07111F] text-white text-xs font-bold"
            >
              <Phone className="w-4 h-4 text-[#FFC400]" />
              <span>কল করুন: {CONTACT_INFO.hotline}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
