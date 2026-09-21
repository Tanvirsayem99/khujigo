'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, WishlistItem, Language } from '@/types';
import { translations } from '@/lib/i18n';

type TranslationDict = typeof translations['bn'];
export type TranslationHelper = ((options: { en: string; bn: string }) => string) & TranslationDict;

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationHelper;
  tr: (options: { en: string; bn: string }) => string;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  wishlist: WishlistItem[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info';
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('bn');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  // Load from localStorage on mount safely
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('khujigo_lang') as Language;
      const savedCart = localStorage.getItem('khujigo_cart');
      const savedWishlist = localStorage.getItem('khujigo_wishlist');

      queueMicrotask(() => {
        if (savedLang === 'bn' || savedLang === 'en') {
          setLanguageState(savedLang);
        }
        if (savedCart) {
          try {
            setCart(JSON.parse(savedCart));
          } catch {
            // Ignore parse error
          }
        }
        if (savedWishlist) {
          try {
            setWishlist(JSON.parse(savedWishlist));
          } catch {
            // Ignore parse error
          }
        }
      });
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('khujigo_lang', lang);
    } catch {
      // Safe fallback
    }
  };

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product_id === product.id);
      let newCart: CartItem[];
      if (existing) {
        newCart = prevCart.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [
          ...prevCart,
          {
            id: `cart-${product.id}`,
            product_id: product.id,
            name_en: product.name_en,
            name_bn: product.name_bn,
            slug: product.slug,
            thumbnail_url: product.thumbnail_url,
            price: product.price,
            compare_price: product.compare_price,
            quantity,
            stock_quantity: product.stock_quantity,
          },
        ];
      }
      try {
        localStorage.setItem('khujigo_cart', JSON.stringify(newCart));
      } catch {
        // Safe fallback
      }
      return newCart;
    });

    showToast(language === 'bn' ? 'পণ্য কার্টে যোগ করা হয়েছে!' : 'Product added to cart!');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.product_id !== productId);
      try {
        localStorage.setItem('khujigo_cart', JSON.stringify(updated));
      } catch {
        // Safe fallback
      }
      return updated;
    });
    showToast(language === 'bn' ? 'পণ্য কার্ট থেকে মুছে ফেলা হয়েছে' : 'Removed from cart');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      );
      try {
        localStorage.setItem('khujigo_cart', JSON.stringify(updated));
      } catch {
        // Safe fallback
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem('khujigo_cart');
    } catch {
      // Safe fallback
    }
  };

  // Wishlist operations
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.product.id === product.id);
      let updated: WishlistItem[];
      if (exists) {
        updated = prev.filter((item) => item.product.id !== product.id);
        showToast(language === 'bn' ? 'পছন্দের তালিকা থেকে সরানো হয়েছে' : 'Removed from wishlist');
      } else {
        updated = [
          ...prev,
          {
            id: `wish-${product.id}`,
            product,
            added_at: new Date().toISOString(),
          },
        ];
        showToast(language === 'bn' ? 'পছন্দের তালিকায় যোগ করা হয়েছে!' : 'Added to wishlist!');
      }
      try {
        localStorage.setItem('khujigo_wishlist', JSON.stringify(updated));
      } catch {
        // Safe fallback
      }
      return updated;
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.product.id === productId);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const tr = (options: { en: string; bn: string }) => {
    return language === 'bn' ? options.bn : options.en;
  };

  const tHelper = Object.assign(
    (options: { en: string; bn: string }) => {
      return language === 'bn' ? options.bn : options.en;
    },
    translations[language]
  ) as TranslationHelper;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t: tHelper,
        tr,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        toastMessage,
        toastType,
        showToast,
      }}
    >
      {children}
      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-20 sm:bottom-6 right-4 z-50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-fade-in text-xs sm:text-sm font-medium border ${
            toastType === 'success'
              ? 'bg-emerald-950 border-emerald-600 text-emerald-100'
              : toastType === 'error'
              ? 'bg-rose-950 border-rose-600 text-rose-100'
              : 'bg-[#07111F] border-orange-500/40 text-white'
          }`}
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              toastType === 'success'
                ? 'bg-emerald-400'
                : toastType === 'error'
                ? 'bg-rose-400'
                : 'bg-[#FF6A00]'
            } animate-pulse`}
          />
          <span>{toastMessage}</span>
        </div>
      )}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
