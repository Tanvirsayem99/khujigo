'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  ShieldCheck,
  Truck,
  Check,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { validateCoupon } from '@/lib/api/endpoints';
import { couponErrorMessage } from '@/lib/coupon-messages';
import { useDeliverySettings } from '@/lib/hooks/api';
import { formatPriceBD, toBanglaNumber } from '@/lib/bangladesh-data';

export default function CartPage() {
  const router = useRouter();
  const { language, t, cart, updateCartQuantity, removeFromCart, clearCart, cartTotal, showToast } = useApp();
  const { settings: deliverySettings } = useDeliverySettings();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<'dhaka' | 'outside'>('dhaka');

  const deliveryCharge =
    cartTotal >= (deliverySettings?.freeDeliveryThreshold ?? 2500)
      ? 0
      : selectedDestination === 'dhaka'
      ? deliverySettings?.insideDhaka ?? 60
      : deliverySettings?.outsideDhaka ?? 120;
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, cartTotal - discountAmount + deliveryCharge);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsApplyingCoupon(true);
    try {
      const result = await validateCoupon(couponInput.trim(), cartTotal);

      if (result.valid && result.coupon) {
        setAppliedCoupon({
          code: result.coupon.code,
          discount: result.discount ?? 0,
        });
        showToast(
          language === 'bn' ? 'কুপন সফলভাবে প্রয়োগ হয়েছে!' : 'Coupon applied successfully!',
          'success'
        );
      } else {
        showToast(
          couponErrorMessage({
            reason: result.reason,
            minOrderAmount: result.minOrderAmount,
            language,
          }),
          'error'
        );
      }
    } catch {
      showToast(
        language === 'bn'
          ? 'কুপন যাচাই করা যায়নি। আবার চেষ্টা করুন।'
          : 'Could not verify the coupon. Please try again.',
        'error'
      );
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    showToast(
      language === 'bn' ? 'কুপন অপসারিত হয়েছে' : 'Coupon removed',
      'info'
    );
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-orange-50 text-brand-orange flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-navy">
          {language === 'bn' ? 'আপনার শপিং কার্ট খালি!' : 'Your Shopping Cart is Empty!'}
        </h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          {language === 'bn'
            ? 'আপনার পছন্দের ট্রেন্ডিং প্রোডাক্টগুলো কার্টে যোগ করুন এবং ক্যাশ অন ডেলিভারিতে অর্ডার করুন।'
            : 'Explore our latest trending and useful gadgets, and enjoy fast cash on delivery across Bangladesh.'}
        </p>
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-brand-orange hover:bg-[#e55f00] text-white font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <span>{language === 'bn' ? 'শপিং শুরু করুন' : 'Start Shopping'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            {language === 'bn' ? 'শপিং কার্ট' : 'Shopping Cart'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            {language === 'bn'
              ? `মোট ${toBanglaNumber(cart.length)}টি পণ্য আপনার কার্টে রয়েছে`
              : `${cart.length} items in your bag`}
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:underline font-bold flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'কার্ট খালি করুন' : 'Clear Bag'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-100 shadow-xs divide-y divide-gray-100">
            {cart.map((item) => {
              const itemTotal = item.price * item.quantity;
              const formattedItemPrice =
                language === 'bn' ? toBanglaNumber(formatPriceBD(item.price)) : formatPriceBD(item.price);
              const formattedItemTotal =
                language === 'bn' ? toBanglaNumber(formatPriceBD(itemTotal)) : formatPriceBD(itemTotal);

              return (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {/* Product Info & Thumbnail */}
                  <div className="flex items-center gap-4 flex-1">
                    <Link
                      href={`/products/${item.slug}`}
                      className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100"
                    >
                      <Image
                        src={item.thumbnail_url}
                        alt={language === 'bn' ? item.name_bn : item.name_en}
                        fill
                        sizes="80px"
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </Link>

                    <div className="space-y-1">
                      <Link href={`/products/${item.slug}`} className="hover:text-brand-orange">
                        <h3 className="text-sm font-bold text-brand-navy line-clamp-1">
                          {language === 'bn' ? item.name_bn : item.name_en}
                        </h3>
                      </Link>
                      <p className="text-xs font-semibold text-gray-500">
                        ৳{formattedItemPrice} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                      <button
                        onClick={() => updateCartQuantity(item.product_id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-brand-navy"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-brand-navy">
                        {language === 'bn' ? toBanglaNumber(item.quantity) : item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product_id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-brand-navy"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Total Price for this item */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-sm font-black text-brand-navy">
                        ৳{formattedItemTotal}
                      </span>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="p-1.5 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title={language === 'bn' ? 'মুছে ফেলুন' : 'Remove item'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              href="/shop"
              className="text-xs sm:text-sm font-bold text-brand-orange hover:underline flex items-center gap-1.5"
            >
              <span>← {language === 'bn' ? 'আরও পণ্য কিনুন' : 'Continue Shopping'}</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Coupon & Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Code Box */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-brand-orange" />
              <span>{language === 'bn' ? 'ডিসকাউন্ট কুপন কোড' : 'Apply Promo Code'}</span>
            </h3>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-mono font-bold text-xs text-emerald-800 uppercase">
                      {appliedCoupon.code}
                    </span>
                    <p className="text-[10px] text-emerald-600">
                      {language === 'bn'
                        ? `৳${toBanglaNumber(formatPriceBD(appliedCoupon.discount))} ছাড় প্রয়োগ করা হয়েছে`
                        : `৳${formatPriceBD(appliedCoupon.discount)} saved`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  {language === 'bn' ? 'মুছুন' : 'Remove'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="KHUJIGO100"
                  className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono uppercase focus:bg-white focus:border-brand-orange outline-hidden"
                />
                <button
                  type="submit"
                  disabled={isApplyingCoupon || !couponInput.trim()}
                  className="px-4 py-2 rounded-xl bg-brand-navy hover:bg-black text-white text-xs font-bold transition disabled:opacity-50"
                >
                  {language === 'bn' ? 'প্রয়োগ' : 'Apply'}
                </button>
              </form>
            )}
            <p className="text-[10px] text-gray-400">
              {language === 'bn'
                ? 'টিপ: ১ম অর্ডারে ৳১০০ ছাড়ের জন্য ব্যবহার করুন KHUJIGO100'
                : 'Tip: Try code KHUJIGO100 for ৳100 off on orders over ৳1,000'}
            </p>
          </div>

          {/* Order Summary Box */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-xs space-y-5">
            <h3 className="text-base font-black text-brand-navy">
              {language === 'bn' ? 'অর্ডার সারাংশ' : 'Order Summary'}
            </h3>

            {/* Delivery Destination Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">
                {language === 'bn' ? 'ডেলিভারি এলাকা নির্বাচন করুন:' : 'Estimated Delivery Location:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDestination('dhaka')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                    selectedDestination === 'dhaka'
                      ? 'border-brand-orange bg-orange-50/70 text-brand-orange font-bold'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <p>{language === 'bn' ? 'ঢাকা সিটি' : 'Dhaka City'}</p>
                  <p className="text-[11px] font-black">৳৬০</p>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDestination('outside')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition ${
                    selectedDestination === 'outside'
                      ? 'border-brand-orange bg-orange-50/70 text-brand-orange font-bold'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <p>{language === 'bn' ? 'ঢাকার বাইরে' : 'Outside Dhaka'}</p>
                  <p className="text-[11px] font-black">৳১২০</p>
                </button>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2.5 pt-3 border-t border-gray-100 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-gray-600">
                <span>{language === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                <span className="font-bold text-brand-navy">
                  ৳{language === 'bn' ? toBanglaNumber(formatPriceBD(cartTotal)) : formatPriceBD(cartTotal)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-semibold">
                  <span>{language === 'bn' ? 'কুপন ডিসকাউন্ট' : 'Discount'}</span>
                  <span>
                    -৳{language === 'bn' ? toBanglaNumber(formatPriceBD(discountAmount)) : formatPriceBD(discountAmount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-gray-600">
                <span>{language === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Charge'}</span>
                <span className="font-bold text-brand-navy">
                  ৳{language === 'bn' ? toBanglaNumber(formatPriceBD(deliveryCharge)) : formatPriceBD(deliveryCharge)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-base font-black text-brand-navy">
                <span>{language === 'bn' ? 'সর্বমোট' : 'Total'}</span>
                <span className="text-xl font-black text-brand-orange">
                  ৳{language === 'bn' ? toBanglaNumber(formatPriceBD(grandTotal)) : formatPriceBD(grandTotal)}
                </span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              id="proceed-to-checkout-btn"
              onClick={() => router.push('/checkout')}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-orange to-orange-500 hover:from-[#e55f00] hover:to-orange-600 text-white font-black text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition active:scale-98"
            >
              <span>{language === 'bn' ? 'চেকআউট করুন' : 'Proceed to Checkout'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Reassurance */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-gray-500 font-medium pt-1">
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-brand-orange" />
                <span>{language === 'bn' ? 'সারা বাংলাদেশে ডেলিভারি' : 'All 64 Districts'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
