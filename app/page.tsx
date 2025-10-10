import Link from "next/link";
import FeaturedProducts from "@/components/shop/FeaturedProducts";
import { listProducts } from "@/lib/products";

export const revalidate = 3600;

export async function generateMetadata() {
  const title = "Acme Store — Modern ecommerce with Next.js";
  const description = "Fast, accessible, SEO-first ecommerce built with Next.js, TypeScript, Prisma, Stripe, and Tailwind CSS.";
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    title,
    description,
    alternates: { canonical: "/" },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Home() {
  const all = await listProducts();
  const featured = all.slice(0, 8);
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // JSON-LD: WebSite + Featured ItemList
  const siteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Acme Store",
    url: base,
    potentialAction: {
      "@type": "SearchAction",
      target: `${base}/products?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: featured.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${base}/products/${p.slug}`
    }))
  };

  return (
    <main id="content" className="mx-auto max-w-7xl px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />

      {/* HERO */}
      <section className="py-10 sm:py-14">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Acme Store</h1>
          <p className="mt-2 text-base opacity-80">
            Modern ecommerce with Next.js — fast, accessible, and SEO-first.
          </p>
          <div className="mt-5 flex gap-3">
            <Link className="rounded bg-[color:var(--color-brand)] px-4 py-2 text-white" href="/products">Browse Products</Link>
            <Link className="rounded border px-4 py-2" href="/blog">Read the Blog</Link>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="pb-16">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Featured products</h2>
          <Link href="/products" className="text-sm underline opacity-80">View all</Link>
        </div>
        <FeaturedProducts products={featured} />
      </section>
    </main>
  );
}