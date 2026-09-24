'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { SWRConfig } from 'swr';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import { trackPageView } from '@/lib/analytics/facebook-pixel';
import Navbar from '@/components/storefront/Navbar';
import MobileBottomNav from '@/components/storefront/MobileBottomNav';
import Footer from '@/components/storefront/Footer';

// Interaction-only chrome: neither renders anything until it is opened or
// clicked, so there is no reason to ship their code with the first paint.
const CartDrawer = dynamic(() => import('@/components/storefront/CartDrawer'), {
  ssr: false,
});
const WhatsAppButton = dynamic(() => import('@/components/storefront/WhatsAppButton'), {
  ssr: false,
});

export default function StorefrontWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  // The inline snippet in app/layout.tsx already reports the landing page, so
  // only client-side navigations after the first render are tracked here.
  const trackedPathname = useRef(pathname);

  useEffect(() => {
    if (trackedPathname.current === pathname) return;
    trackedPathname.current = pathname;
    if (isAdminRoute) return;
    trackPageView();
  }, [pathname, isAdminRoute]);

  return (
    // No polling on window focus (a storefront shouldn't refetch mid-browse),
    // and no automatic retries — a failed request shows a retry button instead.
    <SWRConfig
      value={{ revalidateOnFocus: false, shouldRetryOnError: false, keepPreviousData: true }}
    >
      <AuthProvider>
        <AppProvider>
          {!isAdminRoute && <Navbar />}
          <CartDrawer />
          <div className={!isAdminRoute ? 'min-h-[calc(100dvh-280px)]' : 'min-h-screen'}>
            {children}
          </div>
          {!isAdminRoute && <Footer />}
          {!isAdminRoute && <MobileBottomNav />}
          {!isAdminRoute && <WhatsAppButton />}
        </AppProvider>
      </AuthProvider>
    </SWRConfig>
  );
}
