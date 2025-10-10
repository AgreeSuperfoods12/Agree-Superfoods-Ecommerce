// app/admin/blog/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type Row = {
  id: string;
  title: string;
  slug: string;
  updatedAt: Date;
};

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    select: { id: true, title: true, slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Blog</h2>
        <Link href="/admin/blog/new" className="rounded-lg border px-3 py-2">
          + New
        </Link>
      </div>

      <ul className="mt-6 divide-y rounded-xl border bg-white">
        {posts.map((p: Row) => (
          <li
            key={p.id}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-sm text-gray-600">{p.slug}</p>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/blog/${p.slug}`}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                View
              </Link>
              <Link
                href={`/admin/blog/${p.id}/edit`}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                Edit
              </Link>
              <form
                action={async () => {
                  "use server";
                  await prisma.blogPost.delete({ where: { id: p.id } });
                }}
              >
                <button className="rounded-lg border px-3 py-2 text-sm text-red-600">
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
