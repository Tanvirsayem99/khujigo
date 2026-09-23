import type { Metadata } from 'next';
import {
  SITE_NAME,
  absoluteUrl,
  breadcrumbJsonLd,
  getProductForSeo,
  jsonLd,
  productJsonLd,
  truncate,
} from '@/lib/seo';

interface ProductRouteProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

/**
 * The product page itself is a client component, so its metadata, canonical URL
 * and structured data are contributed by this server layout instead.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductForSeo(slug);

  if (!product) {
    return {
      title: 'Product not found',
      robots: { index: false, follow: true },
    };
  }

  const title = product.seoTitle?.trim() || product.nameEn;
  const description = truncate(
    product.seoDescription?.trim() ||
      product.shortDescEn ||
      product.descriptionEn ||
      SITE_NAME,
  );
  const images = [product.thumbnailUrl, ...(product.galleryUrls ?? [])].filter(Boolean);

  return {
    title,
    description,
    keywords: [
      product.nameEn,
      product.nameBn,
      product.brand,
      ...(product.tags ?? []),
    ].filter(Boolean) as string[],
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      url: absoluteUrl(`/products/${product.slug}`),
      title,
      description,
      images: images.map((src) => ({ url: src, alt: product.nameEn })),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
  };
}

export default async function ProductLayout({ children, params }: ProductRouteProps) {
  const { slug } = await params;
  const product = await getProductForSeo(slug);

  return (
    <>
      {product && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: jsonLd(productJsonLd(product)) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: jsonLd(
                breadcrumbJsonLd([
                  { name: 'Home', path: '/' },
                  { name: 'Shop', path: '/shop' },
                  ...(product.category
                    ? [
                        {
                          name: product.category.nameEn,
                          path: `/shop?category=${product.category.slug}`,
                        },
                      ]
                    : []),
                  { name: product.nameEn, path: `/products/${product.slug}` },
                ]),
              ),
            }}
          />
        </>
      )}
      {children}
    </>
  );
}
