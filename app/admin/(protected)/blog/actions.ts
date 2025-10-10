// app/admin/(protected)/blog/actions.ts
"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// simple, predictable slug
const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/**
 * Accepts:
 *  - ""  -> null
 *  - "/path/inside/public.jpg" (site-relative)
 *  - "https://domain.com/image.jpg" (absolute)
 */
const UrlOrPath = z
  .string()
  .transform((v) => (typeof v === "string" ? v.trim() : ""))
  .refine(
    (v) => v === "" || v.startsWith("/") || /^https?:\/\//i.test(v),
    { message: "Enter a full https:// URL or a path that starts with /" }
  )
  .transform((v) => (v === "" ? null : v));

const Schema = z.object({
  id: z.string().cuid().optional(),

  title: z.string().min(2, "Title is required"),
  slug: z.string().optional().transform((v) => (v ?? "").trim()),

  excerpt: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() !== "" ? v : null)),

  content: z.string().min(1, "Content is required"),

  coverImage: UrlOrPath.optional().nullable(),

  tags: z
    .string()
    .optional()
    .transform((v) =>
      (v ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    ),

  published: z.coerce.boolean().default(true),

  // SEO
  metaTitle: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() !== "" ? v : null)),
  metaDescription: z
    .string()
    .optional()
    .transform((v) => (v && v.trim() !== "" ? v : null)),
  ogImage: UrlOrPath.optional().nullable(),
  canonical: UrlOrPath.optional().nullable(),
});

export async function upsertPost(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = Schema.parse(raw);

  const slug =
    parsed.slug && parsed.slug.trim()
      ? slugify(parsed.slug)
      : slugify(parsed.title);

  const data = {
    title: parsed.title,
    slug,
    excerpt: parsed.excerpt ?? null,
    content: parsed.content,
    coverImage: parsed.coverImage ?? null,
    tags: parsed.tags ?? [],
    published: parsed.published,

    // SEO
    metaTitle: parsed.metaTitle ?? null,
    metaDescription: parsed.metaDescription ?? null,
    ogImage: parsed.ogImage ?? null,
    canonical: parsed.canonical ?? null,
  };

  if (parsed.id) {
    await prisma.blogPost.update({ where: { id: parsed.id }, data });
  } else {
    await prisma.blogPost.create({ data });
  }

  // revalidate pages that show this data
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin/blog");
}
