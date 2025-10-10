import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { toAbsoluteUrl, toMetaDescription } from "@/lib/seo";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length || 0;
  return Math.max(1, Math.round(words / 200));
}
function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(d);
}

// Safely coerce Prisma JSON -> string[]
function normalizeTags(json: unknown): string[] {
  if (!json) return [];
  if (Array.isArray(json)) return json.map(String);
  if (typeof json === "object") return Object.values(json as Record<string, unknown>).map(String);
  if (typeof json === "string") return [json];
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: {
      title: true,
      excerpt: true,
      content: true,
      coverImage: true,
      tags: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      metaTitle: true,
      metaDescription: true,
      ogImage: true,
      canonical: true,
    },
  });

  if (!post || !post.published) {
    return { title: "Not found", robots: { index: false, follow: false } };
  }

  const title = post.metaTitle ?? post.title;
  const description = toMetaDescription(post.metaDescription, post.excerpt ?? post.content);
  const urlPath = `/blog/${slug}`;
  const url = toAbsoluteUrl(urlPath);
  const ogImage = post.ogImage ?? toAbsoluteUrl(`/blog/${slug}/opengraph-image`);
  const tags = normalizeTags(post.tags);
  const ogTags: string[] | undefined = tags.length ? tags : undefined;

  return {
    title,
    description,
    alternates: { canonical: post.canonical ?? urlPath },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      images: [{ url: ogImage }],
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      tags: ogTags, // string[] | undefined — OK
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    robots: { index: true, follow: true },
  };
}

type MorePost = {
  id: string;
  slug: string;
  title: string;
  updatedAt: Date;
  coverImage: string | null;
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      excerpt: true,
      content: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      coverImage: true,
      tags: true,
    },
  });

  if (!post || !post.published) return notFound();

  const tags = normalizeTags(post.tags);
  const minutes = readingTime(post.content);

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    image: post.coverImage ? [toAbsoluteUrl(post.coverImage)] : undefined,
    mainEntityOfPage: toAbsoluteUrl(`/blog/${slug}`),
    articleSection: tags,
    author: { "@type": "Organization", name: "Phenomena" },
    publisher: {
      "@type": "Organization",
      name: "Phenomena",
      logo: { "@type": "ImageObject", url: toAbsoluteUrl("/android-chrome-192x192.png") },
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Blog", item: toAbsoluteUrl("/blog") },
      { "@type": "ListItem", position: 2, name: post.title, item: toAbsoluteUrl(`/blog/${slug}`) },
    ],
  };

  // 3 more posts
  const more = (await prisma.blogPost.findMany({
    where: { published: true, NOT: { slug } },
    orderBy: { updatedAt: "desc" },
    take: 3,
    select: { id: true, slug: true, title: true, updatedAt: true, coverImage: true },
  })) as MorePost[];

  return (
    <main className="mx-auto max-w-3xl p-6">
      {/* Header / hero */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <time dateTime={post.updatedAt.toISOString()}>{formatDate(post.updatedAt)}</time>
          <span aria-hidden="true">•</span>
          <span>{minutes} min read</span>
          {tags.length > 0 && (
            <>
              <span aria-hidden="true">•</span>
              <ul className="flex flex-wrap gap-1">
                {tags.map((t) => (
                  <li key={t} className="rounded-full border px-2 py-0.5">
                    {t}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {post.excerpt && <p className="mt-3 text-lg text-gray-700">{post.excerpt}</p>}

        {post.coverImage && (
          <img
            src={post.coverImage.startsWith("/") ? toAbsoluteUrl(post.coverImage) : post.coverImage}
            alt=""
            className="mt-4 aspect-[16/9] w-full rounded-2xl object-cover"
          />
        )}
      </header>

      {/* Article content */}
      <article className="prose max-w-none prose-headings:scroll-mt-24">
        <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>
      </article>

      {/* Share + Back */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(
            toAbsoluteUrl(`/blog/${slug}`)
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border px-3 py-1.5 text-sm"
        >
          Share on X/Twitter
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            toAbsoluteUrl(`/blog/${slug}`)
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border px-3 py-1.5 text-sm"
        >
          Share on Facebook
        </a>
        <Link href="/blog" className="ml-auto rounded-lg border px-3 py-1.5 text-sm">
          ← Back to blog
        </Link>
      </div>

      {/* More posts */}
      {more.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-semibold">More from the blog</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {more.map((m: MorePost) => (
              <li key={m.id} className="overflow-hidden rounded-xl border bg-white">
                {m.coverImage && (
                  <Link href={`/blog/${m.slug}`}>
                    <img
                      src={m.coverImage.startsWith("/") ? toAbsoluteUrl(m.coverImage) : m.coverImage}
                      alt=""
                      className="h-36 w-full object-cover"
                    />
                  </Link>
                )}
                <div className="p-3">
                  <h3 className="font-medium leading-tight">
                    <Link href={`/blog/${m.slug}`} className="underline-offset-2 hover:underline">
                      {m.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-xs text-gray-600">{formatDate(m.updatedAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </main>
  );
}
