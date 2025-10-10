import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteProduct } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const items = await prisma.product.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <main>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Products</h2>
        <Link href="/admin/products/new" className="rounded-lg border px-3 py-2">+ New</Link>
      </div>

      <ul className="mt-6 divide-y rounded-xl border bg-white">
        {items.map(p => (
          <li key={p.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="text-sm text-gray-600">{p.slug} · ${(p.priceCents/100).toFixed(2)}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/products/${p.slug}`} className="rounded-lg border px-3 py-2 text-sm">View</Link>
              <Link href={`/admin/products/${p.id}/edit`} className="rounded-lg border px-3 py-2 text-sm">Edit</Link>
              <form action={deleteProduct.bind(null, p.id)}>
                <button className="rounded-lg border px-3 py-2 text-sm text-red-600">Delete</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}