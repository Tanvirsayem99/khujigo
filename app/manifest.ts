import type { MetadataRoute } from 'next';
import { SITE_DEFAULT_DESCRIPTION, SITE_NAME } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} - খুঁজে নিন ট্রেন্ডিং সবকিছু`,
    short_name: SITE_NAME,
    description: SITE_DEFAULT_DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF9F2',
    theme_color: '#FF6A00',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
