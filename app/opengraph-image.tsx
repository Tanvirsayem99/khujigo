import { ImageResponse } from 'next/og';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

/** Default social share card, inherited by every route that doesn't override it. */
export const alt = 'KhujiGo - trending, useful and unique products in Bangladesh';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #07111F 0%, #132238 55%, #FF6A00 100%)',
          color: '#FFFFFF',
          padding: '64px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: 4,
            color: '#FF8A00',
          }}
        >
          {SITE_URL.replace(/^https?:\/\//, '')}
        </div>
        <div style={{ display: 'flex', fontSize: 132, fontWeight: 800, marginTop: 16 }}>
          {SITE_NAME}
        </div>
        <div style={{ display: 'flex', fontSize: 40, marginTop: 20, color: '#FDE8D4' }}>
          Trending products, delivered across Bangladesh
        </div>
      </div>
    ),
    size,
  );
}
