"use client";

import { upsertPost } from "@/app/admin/(protected)/blog/actions";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Post = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string;
  coverImage?: string | null;
  tags?: string[] | null;
  published?: boolean;
  // SEO fields
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: string | null;
  canonical?: string | null;
};

export default function BlogPostForm({ post }: { post?: Post }) {
  const router = useRouter();

  // helpers
  const toCSV = (v: unknown) =>
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

  // local state (for live preview + counters)
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    post?.metaDescription ?? ""
  );

  // auto-generate slug from title until user edits slug directly
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ??
    "http://localhost:3000";

  const previewUrl = useMemo(
    () => `${site}/blog/${slug || "your-slug"}`,
    [site, slug]
  );

  return (
    <main className="max-w-3xl">
      <h1 className="text-2xl font-semibold">
        {post ? "Edit post" : "New post"}
      </h1>

      <form
        action={async (fd) => {
          // normalize tags (server validates too, but this keeps UX tidy)
          const tagsRaw = (fd.get("tags") as string) || "";
          fd.set("tags", fromCSV(tagsRaw).join(", "));

          // ensure slug present
          if (!fd.get("slug")) {
            fd.set("slug", slugify((fd.get("title") as string) || ""));
          }

          await upsertPost(fd);
          router.push("/admin/blog");
        }}
        className="mt-6 grid gap-5"
      >
        {post?.id && <input type="hidden" name="id" defaultValue={post.id} />}

        {/* Content */}
        <section className="grid gap-4 rounded-xl border p-4">
          <h2 className="text-lg font-medium">Content</h2>

          <label className="grid gap-1">
            <span className="text-sm">Title</span>
            <input
              name="title"
              required
              defaultValue={post?.title}
              onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
              className="rounded-lg border px-3 py-2"
              placeholder="e.g., White Tea Benefits"
            />
            <p className="text-xs text-gray-500">
              Keep around ~60 characters for best SEO.
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
              placeholder="white-tea-benefits"
            />
            <p className="text-xs text-gray-500">
              URL will be: <span className="font-mono">{previewUrl}</span>
            </p>
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Excerpt</span>
            <textarea
              name="excerpt"
              rows={2}
              defaultValue={post?.excerpt ?? ""}
              className="rounded-lg border px-3 py-2"
              placeholder="Short summary shown on the listing page."
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Cover image URL</span>
            <input
              name="coverImage"
              defaultValue={post?.coverImage ?? ""}
              className="rounded-lg border px-3 py-2"
              placeholder="https://…/cover.jpg"
            />
            <p className="text-xs text-gray-500">
              Used on the blog listing and at the top of the post.
            </p>
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Tags (comma list)</span>
            <input
              name="tags"
              defaultValue={toCSV(post?.tags ?? [])}
              className="rounded-lg border px-3 py-2"
              placeholder="tea, wellness, antioxidants"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Content</span>
            <textarea
              name="content"
              rows={14}
              defaultValue={post?.content ?? ""}
              className="rounded-lg border px-3 py-2 font-mono"
              placeholder="Write your post in Markdown or plain text…"
            />
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
              <span>Defaults to your post title if empty.</span>
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
              placeholder="1–2 sentence summary for search/social previews."
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
              defaultValue={post?.ogImage ?? ""}
              className="rounded-lg border px-3 py-2"
              placeholder="https://…/social-card.png"
            />
            <p className="text-xs text-gray-500">
              Used for link previews (1200×630 recommended).
            </p>
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Canonical URL (optional)</span>
            <input
              name="canonical"
              defaultValue={post?.canonical ?? ""}
              className="rounded-lg border px-3 py-2"
              placeholder={`${site}/blog/${slug || "white-tea-benefits"}`}
            />
            <p className="text-xs text-gray-500">
              Leave empty to default to this page’s URL.
            </p>
          </label>

          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="published"
              defaultChecked={post?.published ?? true}
            />
            <span className="text-sm">Published (indexable)</span>
          </label>
        </section>

        <div className="mt-2 flex gap-3">
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
