// app/(shop)/products/[slug]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import ProductGallery from "@/components/shop/ProductGallery";
import BuyBox from "@/components/shop/BuyBox";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { ShareButton } from "@/components/shop/ShareButton";

type Props = { params: Promise<{ slug: string }> };

// ----- SEO -----
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Product not found" };

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const title = `${p.title} — Buy Online`;
  const description = (p.description ?? "").slice(0, 160);
  const imgs = Array.isArray(p.images) ? (p.images as string[]) : [];
  const absoluteImgs = imgs.map((u) => (u.startsWith("http") ? u : `${base}${u}`));

  return {
    title,
    description,
    alternates: { canonical: `${base}/products/${p.slug}` },
    openGraph: {
      // type: "product", ❌ remove this
      type: "website",   // ✅ or omit this line
      title,
      description,
      url: `${base}/products/${p.slug}`,
      images: absoluteImgs,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: absoluteImgs,
    },
  };
}


// ----- Page -----
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return notFound();

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const imgs = Array.isArray(p.images) ? (p.images as string[]) : [];
  const currency = String(p.currency ?? "USD").toUpperCase();
  const priceNumber = (p.priceCents ?? 0) / 100;
  const price = new Intl.NumberFormat("en-US", { style: "currency", currency }).format(priceNumber);

  // --- JSON-LD: Product
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    image: imgs.map((u: string) => (u?.startsWith("http") ? u : `${base}${u}`)),
    description: p.description,
    sku: p.id,
    brand: { "@type": "Brand", name: "Acme" }, // change to your brand
    offers: {
      "@type": "Offer",
      url: `${base}/products/${p.slug}`,
      priceCurrency: currency,
      price: priceNumber.toFixed(2),
      availability: "https://schema.org/InStock",
    },
  };

  // --- JSON-LD: Breadcrumbs
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Products", item: `${base}/products` },
      { "@type": "ListItem", position: 2, name: p.title, item: `${base}/products/${p.slug}` },
    ],
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Structured data */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav className="mb-4 text-sm text-gray-600">
        <Link href="/products" className="underline underline-offset-2 hover:text-gray-900">
          Products
        </Link>
        {" / "}
        <span aria-current="page">{p.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Media */}
        <ProductGallery images={imgs} alt={p.title} />

        {/* Summary / Buy box */}
        <section aria-labelledby="product-title">
          <h1 id="product-title" className="text-3xl font-bold tracking-tight">
            {p.title}
          </h1>

          <div className="mt-2 flex items-center gap-3">
            <p className="text-2xl font-semibold">{price}</p>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              In stock
            </span>
          </div>

          <p className="mt-3 text-gray-700">{p.description}</p>

          <div className="mt-6">
            <BuyBox productId={p.id} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border p-3 text-sm">
              <p className="font-medium">Free shipping</p>
              <p className="mt-1 text-gray-600">On orders over $50</p>
            </div>
            <div className="rounded-xl border p-3 text-sm">
              <p className="font-medium">30-day returns</p>
              <p className="mt-1 text-gray-600">Hassle-free refunds</p>
            </div>
            <div className="flex items-center justify-between rounded-xl border p-3 text-sm">
              <p className="font-medium">Share</p>
              <ShareButton url={`${base}/products/${p.slug}`} title={p.title} />
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <details className="rounded-xl border p-4" open>
              <summary className="cursor-pointer select-none font-medium">Details</summary>
              <div className="mt-2 whitespace-pre-line text-sm text-gray-700">{p.description}</div>
            </details>
            <details className="rounded-xl border p-4">
              <summary className="cursor-pointer select-none font-medium">Shipping &amp; returns</summary>
              <p className="mt-2 text-sm text-gray-700">
                We ship worldwide. Most orders arrive in 3–5 business days. Returns accepted within 30 days.
              </p>
            </details>
            <details className="rounded-xl border p-4">
              <summary className="cursor-pointer select-none font-medium">Care &amp; ingredients</summary>
              <p className="mt-2 text-sm text-gray-700">
                {/* Add product-specific info here if available. */}
                Contact us if you have questions about materials or ingredients.
              </p>
            </details>
          </div>
        </section>
      </div>

      {/* Sticky buy bar (mobile) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/90 p-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <span className="font-semibold">{price}</span>
          <AddToCartButton productId={p.id} className="flex-1" />
        </div>
      </div>
    </main>
  );
}
