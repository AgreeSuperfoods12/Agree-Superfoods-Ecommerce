// app/(shop)/products/page.tsx
import { listProducts } from "@/lib/products";
import { ProductCard } from "@/components/shop/ProductCard";
import FilterBar from "@/components/shop/FilterBar";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const title = q ? `Search “${q}” — Products` : "Products";
  return {
    title,
    alternates: { canonical: q ? `/products?q=${encodeURIComponent(q)}` : "/products" },
    openGraph: { title, url: `${base}/products` },
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const pick = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);

  const products = await listProducts({
    q: pick("q"),
    category: pick("cat") ?? null,
    type: pick("type") ?? null,
    ing: pick("ing") ?? null,
    need: pick("need") ?? null,
    tag: pick("tag") ?? null,
    sort: pick("sort") ?? null,
  });

  const title = pick("q") ? `Results for “${pick("q")}`.concat("”") : "Products";

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="mb-4 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>

      <FilterBar total={products.length} initialQ={pick("q")} initialSort={pick("sort")} />

      {products.length === 0 ? (
        <div className="mt-10 rounded-2xl border p-10 text-center">
          <p className="text-lg font-medium">No products found</p>
          <p className="mt-2 text-sm text-gray-600">
            Try a different search term or{" "}
            <a href="/products" className="underline">reset all filters</a>.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p: any) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </ul>
      )}
    </main>
  );
}
