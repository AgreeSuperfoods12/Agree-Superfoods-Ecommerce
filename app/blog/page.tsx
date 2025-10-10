import Link from "next/link";
import { prisma } from "@/lib/db";
import { toAbsoluteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";

type DbPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  updatedAt: Date;
  content: string; // for reading time
  tags: unknown | null;
};

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(d);
}

function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length || 0;
  // average 200wpm
  return Math.max(1, Math.round(words / 200));
}

export default async function BlogListPage() {
  const posts = (await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
      updatedAt: true,
      content: true,
      tags: true,
    },
  })) as DbPost[];

  return (
    <main className="mx-auto max-w-5xl p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
        <p className="mt-2 text-gray-600">
          Research, guides, and updates from Phenomena.
        </p>
      </header>

      {posts.length === 0 ? (
        <p>No published posts yet.</p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2">
          {posts.map((p: DbPost) => {
            const mins = readingTime(p.content);
            const tags = Array.isArray(p.tags)
              ? (p.tags as string[])
              : p.tags
              ? Object.values(p.tags as any)
              : [];

            return (
              <li
                key={p.id}
                className="group overflow-hidden rounded-2xl border bg-white transition hover:shadow-lg"
              >
                {/* Cover image */}
                {p.coverImage ? (
                  <Link href={`/blog/${p.slug}`}>
                    <img
                      src={
                        p.coverImage.startsWith("/")
                          ? toAbsoluteUrl(p.coverImage)
                          : p.coverImage
                      }
                      alt=""
                      className="h-44 w-full object-cover transition group-hover:opacity-95"
                    />
                  </Link>
                ) : null}

                <div className="p-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600">
                    <time dateTime={p.updatedAt.toISOString()}>
                      {formatDate(p.updatedAt)}
                    </time>
                    <span aria-hidden="true">•</span>
                    <span>{mins} min read</span>
                    {tags && (tags as string[]).length > 0 && (
                      <>
                        <span aria-hidden="true">•</span>
                        <ul className="flex flex-wrap gap-1">
                          {(tags as string[]).slice(0, 3).map((t) => (
                            <li
                              key={t}
                              className="rounded-full border px-2 py-0.5"
                            >
                              {t}
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>

                  <h2 className="mt-2 text-lg font-semibold leading-tight">
                    <Link
                      href={`/blog/${p.slug}`}
                      className="underline-offset-2 hover:underline"
                    >
                      {p.title}
                    </Link>
                  </h2>

                  {p.excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm text-gray-700">
                      {p.excerpt}
                    </p>
                  )}

                  <div className="mt-4">
                    <Link
                      href={`/blog/${p.slug}`}
                      className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm"
                    >
                      Read more
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
