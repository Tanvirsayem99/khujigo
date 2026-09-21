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
