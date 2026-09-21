export interface District {
  id: string;
  name_en: string;
  name_bn: string;
}

export interface Division {
  id: string;
  name_en: string;
  name_bn: string;
  districts: District[];
}

export const BANGLADESH_DIVISIONS: Division[] = [
  {
    id: 'dhaka',
    name_en: 'Dhaka',
    name_bn: 'ঢাকা',
    districts: [
      { id: 'dhaka-city', name_en: 'Dhaka (Inside City)', name_bn: 'ঢাকা (সিটি কর্পোরেশন)' },
      { id: 'dhaka-sub', name_en: 'Dhaka (Savar/Keraniganj/Dhamrai)', name_bn: 'ঢাকা (সাভার/কেরানীগঞ্জ/ধামরাই)' },
      { id: 'gazipur', name_en: 'Gazipur', name_bn: 'গাজীপুর' },
      { id: 'narayanganj', name_en: 'Narayanganj', name_bn: 'নারায়ণগঞ্জ' },
      { id: 'tangail', name_en: 'Tangail', name_bn: 'টাঙ্গাইল' },
      { id: 'narsingdi', name_en: 'Narsingdi', name_bn: 'নরসিংদী' },
      { id: 'faridpur', name_en: 'Faridpur', name_bn: 'ফরিদপুর' },
      { id: 'kishoreganj', name_en: 'Kishoreganj', name_bn: 'কিশোরগঞ্জ' },
      { id: 'manikganj', name_en: 'Manikganj', name_bn: 'মানিকগঞ্জ' },
      { id: 'munshiganj', name_en: 'Munshiganj', name_bn: 'মুন্সীগঞ্জ' },
      { id: 'rajbari', name_en: 'Rajbari', name_bn: 'রাজবাড়ী' },
      { id: 'madaripur', name_en: 'Madaripur', name_bn: 'মাদারীপুর' },
      { id: 'gopalganj', name_en: 'Gopalganj', name_bn: 'গোপালগঞ্জ' },
      { id: 'shariatpur', name_en: 'Shariatpur', name_bn: 'শরীয়তপুর' },
    ],
  },
  {
    id: 'chattogram',
    name_en: 'Chattogram',
    name_bn: 'চট্টগ্রাম',
    districts: [
      { id: 'chattogram', name_en: 'Chattogram', name_bn: 'চট্টগ্রাম' },
      { id: 'coxsbazar', name_en: 'Cox’s Bazar', name_bn: 'কক্সবাজার' },
      { id: 'cumilla', name_en: 'Cumilla', name_bn: 'কুমিল্লা' },
      { id: 'feni', name_en: 'Feni', name_bn: 'ফেনী' },
      { id: 'brahmanbaria', name_en: 'Brahmanbaria', name_bn: 'ব্রাহ্মণবাড়িয়া' },
      { id: 'noakhali', name_en: 'Noakhali', name_bn: 'নোয়াখালী' },
      { id: 'chandpur', name_en: 'Chandpur', name_bn: 'চাঁদপুর' },
      { id: 'lakshmipur', name_en: 'Lakshmipur', name_bn: 'লক্ষ্মীপুর' },
      { id: 'rangamati', name_en: 'Rangamati', name_bn: 'রাঙ্গামাটি' },
      { id: 'bandarban', name_en: 'Bandarban', name_bn: 'বান্দরবান' },
      { id: 'khagrachhari', name_en: 'Khagrachhari', name_bn: 'খাগড়াছড়ি' },
    ],
  },
  {
    id: 'rajshahi',
    name_en: 'Rajshahi',
    name_bn: 'রাজশাহী',
    districts: [
      { id: 'rajshahi', name_en: 'Rajshahi', name_bn: 'রাজশাহী' },
      { id: 'bogra', name_en: 'Bogura', name_bn: 'বগুড়া' },
      { id: 'pabna', name_en: 'Pabna', name_bn: 'পাবনা' },
      { id: 'sirajganj', name_en: 'Sirajganj', name_bn: 'সিরাজগঞ্জ' },
      { id: 'naogaon', name_en: 'Naogaon', name_bn: 'নওগাঁ' },
      { id: 'natore', name_en: 'Natore', name_bn: 'নাটোর' },
      { id: 'chapainawabganj', name_en: 'Chapainawabganj', name_bn: 'চাঁপাইনবাবগঞ্জ' },
      { id: 'joypurhat', name_en: 'Joypurhat', name_bn: 'জয়পুরহাট' },
    ],
  },
  {
    id: 'khulna',
    name_en: 'Khulna',
    name_bn: 'খুলনা',
    districts: [
      { id: 'khulna', name_en: 'Khulna', name_bn: 'খুলনা' },
      { id: 'jashore', name_en: 'Jashore', name_bn: 'যশোর' },
      { id: 'kushtia', name_en: 'Kushtia', name_bn: 'কুষ্টিয়া' },
      { id: 'satkhira', name_en: 'Satkhira', name_bn: 'সাতক্ষীরা' },
      { id: 'bagerhat', name_en: 'Bagerhat', name_bn: 'বাগেরহাট' },
      { id: 'jhenaidah', name_en: 'Jhenaidah', name_bn: 'ঝিনাইদহ' },
      { id: 'chuadanga', name_en: 'Chuadanga', name_bn: 'চুয়াডাঙ্গা' },
      { id: 'magura', name_en: 'Magura', name_bn: 'মাগুরা' },
      { id: 'meherpur', name_en: 'Meherpur', name_bn: 'মেহেরপুর' },
      { id: 'narail', name_en: 'Narail', name_bn: 'নড়াইল' },
    ],
  },
  {
    id: 'barishal',
    name_en: 'Barishal',
    name_bn: 'বরিশাল',
    districts: [
      { id: 'barishal', name_en: 'Barishal', name_bn: 'বরিশাল' },
      { id: 'bhola', name_en: 'Bhola', name_bn: 'ভোলা' },
      { id: 'patuakhali', name_en: 'Patuakhali', name_bn: 'পটুয়াখালী' },
      { id: 'pirojpur', name_en: 'Pirojpur', name_bn: 'পিরোজপুর' },
      { id: 'barguna', name_en: 'Barguna', name_bn: 'বরগুনা' },
      { id: 'jhalokati', name_en: 'Jhalokati', name_bn: 'ঝালকাঠি' },
    ],
  },
  {
    id: 'sylhet',
    name_en: 'Sylhet',
    name_bn: 'সিলেট',
    districts: [
      { id: 'sylhet', name_en: 'Sylhet', name_bn: 'সিলেট' },
      { id: 'moulvibazar', name_en: 'Moulvibazar', name_bn: 'মৌলভীবাজার' },
      { id: 'habiganj', name_en: 'Habiganj', name_bn: 'হবিগঞ্জ' },
      { id: 'sunamganj', name_en: 'Sunamganj', name_bn: 'সুনামগঞ্জ' },
    ],
  },
  {
    id: 'rangpur',
    name_en: 'Rangpur',
    name_bn: 'রংপুর',
    districts: [
      { id: 'rangpur', name_en: 'Rangpur', name_bn: 'রংপুর' },
      { id: 'dinajpur', name_en: 'Dinajpur', name_bn: 'দিনাজপুর' },
      { id: 'gaibandha', name_en: 'Gaibandha', name_bn: 'গাইবান্ধা' },
      { id: 'kurigram', name_en: 'Kurigram', name_bn: 'কুড়িগ্রাম' },
      { id: 'lalmonirhat', name_en: 'Lalmonirhat', name_bn: 'লালমনিরহাট' },
      { id: 'nilphamari', name_en: 'Nilphamari', name_bn: 'নীলফামারী' },
      { id: 'panchagarh', name_en: 'Panchagarh', name_bn: 'পঞ্চগড়' },
      { id: 'thakurgaon', name_en: 'Thakurgaon', name_bn: 'ঠাকুরগাঁও' },
    ],
  },
  {
    id: 'mymensingh',
    name_en: 'Mymensingh',
    name_bn: 'ময়মনসিংহ',
    districts: [
      { id: 'mymensingh', name_en: 'Mymensingh', name_bn: 'ময়মনসিংহ' },
      { id: 'jamalpur', name_en: 'Jamalpur', name_bn: 'জামালপুর' },
      { id: 'netrokona', name_en: 'Netrokona', name_bn: 'নেত্রকোণা' },
      { id: 'sherpur', name_en: 'Sherpur', name_bn: 'শেরপুর' },
    ],
  },
];

export function isInsideDhaka(districtId: string): boolean {
  return districtId === 'dhaka-city';
}

export function formatPriceBD(amount: number): string {
  return amount.toLocaleString('en-IN');
}

export function toBanglaNumber(num: number | string): string {
  const bnDigits: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
  };
  return String(num).replace(/[0-9]/g, (w) => bnDigits[w] || w);
}
