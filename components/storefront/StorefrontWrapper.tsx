'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { SWRConfig } from 'swr';
import { AppProvider } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/storefront/Navbar';
import CartDrawer from '@/components/storefront/CartDrawer';
import MobileBottomNav from '@/components/storefront/MobileBottomNav';
import WhatsAppButton from '@/components/storefront/WhatsAppButton';
import Footer from '@/components/storefront/Footer';

export default function StorefrontWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

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
