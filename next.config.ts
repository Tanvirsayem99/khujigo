import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Product images are pasted in from whatever host a supplier uses (ImgBB,
  // Cloudinary, arbitrary CDNs), so allow any HTTPS host. A narrower allowlist
  // means adding a host is required before a product image will render at all.
  //
  // Trade-off: this lets anyone use `/_next/image?url=...` as a fetch/cache
  // proxy for arbitrary HTTPS images. If that matters, replace `**` with an
  // explicit hostname list and pass `unoptimized` for off-list images.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
    ],
    // Serve the smaller modern formats (Next only ships `image/webp` by default).
    // AVIF is a little slower to encode the first time and is then cached.
    formats: ['image/avif', 'image/webp'],
    // Next's default is 60 seconds, which made every optimised product photo
    // look "uncacheable" to Lighthouse. Supplier/CDN URLs are versioned
    // (e.g. Cloudinary's /v<timestamp>/), so the bytes behind a given
    // /_next/image URL do not change and a year is safe.
    minimumCacheTTL: 31536000,
  },
  output: 'standalone',
  experimental: {
    devtoolSegmentExplorer: false,
  },
  webpack: (config, { dev }) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modify - file watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
