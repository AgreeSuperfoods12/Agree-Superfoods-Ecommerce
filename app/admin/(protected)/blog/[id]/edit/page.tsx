// app/admin/(protected)/blog/[id]/edit/page.tsx
import { prisma } from "@/lib/db";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export default async function EditPost({ params }: Props) {
  // params is a Promise in Next.js app router APIs – unwrap it first
  const { id } = await params;

  const p = await prisma.blogPost.findUnique({ where: { id } });
  if (!p) return notFound();

  // Be tolerant with optional/JSON fields
  const post = {
    ...p,
    tags: Array.isArray(p.tags) ? (p.tags as string[]) : [],
    // If you haven’t migrated SEO fields yet, these guards keep the form happy
    metaTitle: (p as any).metaTitle ?? null,
    metaDescription: (p as any).metaDescription ?? null,
    ogImage: (p as any).ogImage ?? p.coverImage ?? null,
    canonical: (p as any).canonical ?? null,
  };

  return <BlogPostForm post={post} />;
}
