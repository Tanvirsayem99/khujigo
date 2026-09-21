export const BRAND_COLORS = {
  orange: '#FF6A00',
  orangeBright: '#FF8A00',
  yellow: '#FFC400',
  navy: '#07111F',
  navyLight: '#132238',
  white: '#FFFFFF',
  cream: '#FFF9F2',
  creamDark: '#FDE8D4',
};

export const CONTACT_INFO = {
  hotline: '01860447346',
  whatsapp: '8801860447346',
  whatsappUrl: 'https://wa.me/8801860447346',
  email: 'khujigo@gmail.com',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61594389542669',
  address_bn: 'বাড়ি #১২, রোড #৪, ধানমন্ডি, ঢাকা - ১২০৫, বাংলাদেশ',
  address_en: 'House #12, Road #4, Dhanmondi, Dhaka - 1205, Bangladesh',
  workingHours_bn: 'সকাল ৯:০০ - রাত ১০:০০ (প্রতিদিন)',
  workingHours_en: '9:00 AM - 10:00 PM (Everyday)',
};

export const DEFAULT_DELIVERY_RATES = {
  insideDhaka: 60,
  outsideDhaka: 120,
  freeDeliveryThreshold: 2500,
  estimatedDaysInsideDhaka: '1-2 Days',
  estimatedDaysOutsideDhaka: '2-4 Days',
};

export const NAV_LINKS = [
  { href: '/', label_en: 'Home', label_bn: 'হোম' },
  { href: '/shop', label_en: 'Shop', label_bn: 'শপ' },
  { href: '/categories', label_en: 'Categories', label_bn: 'ক্যাটাগরি' },
  { href: '/shop?filter=trending', label_en: 'Trending', label_bn: 'ট্রেন্ডিং', badge: 'HOT' },
  { href: '/shop?filter=new-arrivals', label_en: 'New Arrivals', label_bn: 'নতুন কালেকশন' },
  { href: '/shop?filter=best-sellers', label_en: 'Best Sellers', label_bn: 'বেস্ট সেলার' },
  { href: '/shop?filter=deals', label_en: 'Deals', label_bn: 'ধামাকা অফার', isDeal: true },
];

export function toBanglaNumber(n: number | string): string {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(n).replace(/[0-9]/g, (w) => bnDigits[+w]);
}

export function formatBDT(amount: number, inBangla = false): string {
  const formatted = new Intl.NumberFormat('en-IN').format(Math.round(amount));
  if (inBangla) {
    return `৳${toBanglaNumber(formatted)}`;
  }
  return `৳${formatted}`;
}

