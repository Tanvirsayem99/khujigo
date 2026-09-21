import type { Language } from '@/types';
import type { CouponRejectionReason } from '@/lib/api/types';

/**
 * Localises the API's `reason` codes. The API returns English `message`
 * strings; the storefront is Bangla-first, so we never show those verbatim.
 */
export function couponErrorMessage(options: {
  reason?: CouponRejectionReason;
  minOrderAmount?: number;
  language: Language;
}): string {
  const { reason, minOrderAmount, language } = options;
  const bn = language === 'bn';

  switch (reason) {
    case 'INVALID':
      return bn
        ? 'কুপনটি সঠিক নয় অথবা নিষ্ক্রিয় করা হয়েছে'
        : 'That coupon code is not valid';
    case 'NOT_STARTED':
      return bn ? 'কুপনটি এখনো চালু হয়নি' : 'This coupon is not active yet';
    case 'EXPIRED':
      return bn ? 'কুপনটির মেয়াদ শেষ হয়ে গেছে' : 'This coupon has expired';
    case 'USAGE_LIMIT':
      return bn
        ? 'কুপনটির ব্যবহারের সীমা শেষ হয়ে গেছে'
        : 'This coupon has reached its usage limit';
    case 'MIN_ORDER':
      return bn
        ? `ন্যূনতম ৳${minOrderAmount ?? 0} অর্ডারে এই কুপনটি প্রযোজ্য`
        : `This coupon needs a minimum order of ৳${minOrderAmount ?? 0}`;
    default:
      return bn ? 'কুপন প্রয়োগ করা যায়নি' : 'Could not apply the coupon';
  }
}
