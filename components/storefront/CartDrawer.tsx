'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, cart, updateCartQuantity, removeFromCart, cartTotal, language, t } = useApp();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-[calc(100vw-2.5rem)] max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#FFF9F2]">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#FF6A00]/10 text-[#FF6A00] flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#07111F]">{t.cart}</h2>
                <p className="text-xs text-gray-500">
                  {cart.length} {language === 'bn' ? 'টি পণ্য কার্টে আছে' : 'item(s) in cart'}
                </p>
              </div>
            </div>
            <button
              id="cart-drawer-close-btn"
              onClick={() => setIsCartOpen(false)}
              className="p-2.5 rounded-xl text-gray-400 hover:text-[#07111F] hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-[#FF6A00] mb-4">
                  <ShoppingBag className="w-10 h-10 opacity-70" />
                </div>
                <h3 className="text-base font-bold text-[#07111F] mb-1">{t.emptyCartTitle}</h3>
                <p className="text-xs text-gray-500 max-w-xs mb-6 leading-relaxed">
                  {t.emptyCartSubtitle}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-[#FF6A00] text-white text-sm font-semibold hover:bg-[#FF8A00] transition shadow-md shadow-orange-500/20"
                >
                  {t.continueShopping}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-3.5">
                  <div className="relative w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                    <Image
                      src={item.thumbnail_url}
                      alt={item.name_en}
                      fill
                      className="object-cover"
                      sizes="80px"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-sm font-semibold text-[#07111F] line-clamp-2 hover:text-[#FF6A00] transition"
                        >
                          {language === 'bn' ? item.name_bn : item.name_en}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="text-gray-400 hover:text-red-500 transition p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-sm font-bold text-[#FF6A00]">
                          ৳{item.price.toLocaleString()}
                        </span>
                        {item.compare_price && (
                          <span className="text-xs text-gray-500 line-through">
                            ৳{item.compare_price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <button
                          onClick={() => updateCartQuantity(item.product_id, item.quantity - 1)}
                          className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-[#07111F]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product_id, item.quantity + 1)}
                          className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-xs font-bold text-gray-700">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] border-t border-gray-100 bg-[#FFF9F2]/50 space-y-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600 text-xs">
                  <span>{t.subtotal}</span>
                  <span className="font-semibold text-[#07111F]">৳{cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-xs">
                  <span>{t.deliveryCharge}</span>
                  <span className="text-xs text-amber-700 font-medium">চেকআউটে নির্ধারিত হবে</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-[#07111F] pt-2 border-t border-dashed border-gray-200">
                  <span>{t.total}</span>
                  <span className="text-[#FF6A00]">৳{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 rounded-xl border-2 border-[#07111F] text-[#07111F] text-xs font-bold text-center hover:bg-gray-100 transition"
                >
                  {language === 'bn' ? 'কার্ট ভিউ করুন' : 'View Cart'}
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#FF6A00] text-white text-xs font-bold text-center hover:bg-[#FF8A00] transition flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20"
                >
                  <span>{t.proceedCheckout}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
