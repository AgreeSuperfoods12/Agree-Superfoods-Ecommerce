"use client";

import { upsertProduct } from "@/app/admin/(protected)/products/actions";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Product = {
  id?: string;
  slug?: string;
  title?: string;
  description?: string;
  priceCents?: number;
  currency?: string;
  images?: string[] | string | null;
  category?: string | null;
  type?: string | null;
  ing?: string[] | string | null;
  need?: string[] | string | null;
  tag?: string[] | string | null;
  published?: boolean;
  // Optional SEO fields (safe even if not in DB yet; server action can ignore)
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
  canonical?: string | null;
};

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();

  // --- helpers
  const toCSV = (v: any) =>
    Array.isArray(v) ? v.join(", ") : typeof v === "string" ? v : "";

  const fromCSV = (v: string) =>
    v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  // --- local state for UX niceties
  const [title, setTitle] = useState(product?.title ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product?.slug));
  const [metaTitle, setMetaTitle] = useState(product?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    product?.metaDescription ?? ""
  );
  const [priceCents, setPriceCents] = useState<number>(
    product?.priceCents ?? 0
  );
  const [currency, setCurrency] = useState<string>(
    (product?.currency ?? "USD").toUpperCase()
  );

  // auto-fill slug from title until user edits slug manually
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ??
    "http://localhost:3000";
  const previewUrl = useMemo(
    () => `${site}/products/${slug || "your-slug"}`,
    [site, slug]
  );

  const pricePreview = useMemo(() => {
    try {
      const f = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: (currency || "USD").toUpperCase(),
      });
      return f.format((priceCents || 0) / 100);
    } catch {
      return `$${((priceCents || 0) / 100).toFixed(2)}`;
    }
  }, [priceCents, currency]);

  return (
    <main className="max-w-3xl">
      <h1 className="text-2xl font-semibold">
        {product ? "Edit product" : "New product"}
      </h1>

      <form
        action={async (fd) => {
          // Normalize CSV fields to a simple comma list (server action can parse)
          const csv = (name: string) =>
            fd.get(name) ? fromCSV(String(fd.get(name))).join(", ") : "";
          fd.set("images", csv("images"));
          fd.set("ing", csv("ing"));
          fd.set("need", csv("need"));
          fd.set("tag", csv("tag"));

          // Ensure currency stored uppercase
          if (fd.get("currency"))
            fd.set("currency", String(fd.get("currency")).toUpperCase());

          // Backfill slug if empty
          if (!fd.get("slug")) fd.set("slug", slugify(String(fd.get("title") || "")));

          await upsertProduct(fd);
          router.push("/admin/products");
        }}
        className="mt-6 grid gap-5"
      >
        {product?.id && (
          <input type="hidden" name="id" defaultValue={product.id} />
        )}

        {/* Basics */}
        <section className="grid gap-4 rounded-xl border p-4">
          <h2 className="text-lg font-medium">Basics</h2>

          <label className="grid gap-1">
            <span className="text-sm">Title</span>
            <input
              name="title"
              required
              defaultValue={product?.title}
              onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
              className="rounded-lg border px-3 py-2"
              placeholder="e.g., Organic Green Tea"
            />
            <p className="text-xs text-gray-500">
              Clear product name (aim for &lt; 60 characters for best SEO).
            </p>
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Slug</span>
            <input
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              onBlur={() => setSlugTouched(true)}
              className="rounded-lg border px-3 py-2"
              placeholder="organic-green-tea"
            />
            <p className="text-xs text-gray-500">
              URL will be: <span className="font-mono">{previewUrl}</span>
            </p>
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="grid gap-1">
              <span className="text-sm">Price (cents)</span>
              <input
                name="priceCents"
                type="number"
                min={0}
                step={1}
                defaultValue={product?.priceCents ?? 0}
                onInput={(e) => setPriceCents(Number((e.target as HTMLInputElement).value || 0))}
                className="rounded-lg border px-3 py-2"
              />
              <p className="text-xs text-gray-500">Preview: {pricePreview}</p>
            </label>

            <label className="grid gap-1">
              <span className="text-sm">Currency</span>
              <input
                name="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                className="rounded-lg border px-3 py-2"
                placeholder="USD"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-sm">Category</span>
              <input
                name="category"
                defaultValue={product?.category ?? ""}
                className="rounded-lg border px-3 py-2"
                placeholder="Tea"
              />
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-sm">Type</span>
            <input
              name="type"
              defaultValue={product?.type ?? ""}
              className="rounded-lg border px-3 py-2"
              placeholder="Beverage"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Images (comma-separated URLs)</span>
            <input
              name="images"
              defaultValue={toCSV(product?.images)}
              className="rounded-lg border px-3 py-2"
              placeholder="https://…/1.jpg, https://…/2.jpg"
            />
            <p className="text-xs text-gray-500">
              First image is used in listings & social previews.
            </p>
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Description</span>
            <textarea
              name="description"
              rows={6}
              defaultValue={product?.description}
              className="rounded-lg border px-3 py-2"
              placeholder="Describe benefits, materials, sizing, etc."
            />
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <label className="grid gap-1">
              <span className="text-sm">Ingredients (comma list)</span>
              <input
                name="ing"
                defaultValue={toCSV(product?.ing)}
                className="rounded-lg border px-3 py-2"
                placeholder="green tea, jasmine"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Needs (comma list)</span>
              <input
                name="need"
                defaultValue={toCSV(product?.need)}
                className="rounded-lg border px-3 py-2"
                placeholder="energy, focus"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Tags (comma list)</span>
              <input
                name="tag"
                defaultValue={toCSV(product?.tag)}
                className="rounded-lg border px-3 py-2"
                placeholder="sale, bestseller"
              />
            </label>
          </div>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="published"
              defaultChecked={product?.published ?? true}
            />
            <span className="text-sm">Published</span>
          </label>
        </section>

        {/* SEO */}
        <section className="grid gap-4 rounded-xl border p-4">
          <h2 className="text-lg font-medium">SEO</h2>

          <label className="grid gap-1">
            <span className="text-sm">Meta title (optional)</span>
            <input
              name="metaTitle"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="rounded-lg border px-3 py-2"
              placeholder="Custom title for search results"
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Defaults to product title if empty.</span>
              <span>{metaTitle.length}/60</span>
            </div>
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Meta description (optional)</span>
            <textarea
              name="metaDescription"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              className="rounded-lg border px-3 py-2"
              placeholder="1–2 sentence summary for search and social previews."
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Good length is 120–160 characters.</span>
              <span>{metaDescription.length}/160</span>
            </div>
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Open Graph image (optional)</span>
            <input
              name="ogImage"
              defaultValue={(product as any)?.ogImage ?? ""}
              className="rounded-lg border px-3 py-2"
              placeholder="https://…/social-card.png"
            />
            <p className="text-xs text-gray-500">
              Used for link previews (ideal 1200×630).
            </p>
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Canonical URL (optional)</span>
            <input
              name="canonical"
              defaultValue={(product as any)?.canonical ?? ""}
              className="rounded-lg border px-3 py-2"
              placeholder={previewUrl}
            />
            <p className="text-xs text-gray-500">
              Leave empty to default to this product’s URL.
            </p>
          </label>
        </section>

        <div className="mt-2 flex flex-wrap gap-3">
          <button className="rounded-lg bg-[color:var(--color-brand)] px-4 py-2 text-white">
            Save
          </button>
          <button
            type="button"
            onClick={() => history.back()}
            className="rounded-lg border px-4 py-2"
          >
            Cancel
          </button>
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border px-4 py-2 text-sm"
          >
            View live URL
          </a>
        </div>
      </form>
    </main>
  );
}
