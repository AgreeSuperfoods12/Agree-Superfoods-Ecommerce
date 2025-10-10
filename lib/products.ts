// lib/products.ts
import { prisma } from "@/lib/db";

/** Product detail page */
export async function getProductBySlug(slug: string) {
  if (!slug) return null;
  return prisma.product.findUnique({ where: { slug } });
}

/** Cart page */
export async function getProductsByIds(ids: string[]) {
  if (!ids?.length) return [];
  return prisma.product.findMany({ where: { id: { in: ids } } });
}

/** Grid/search page */
export async function listProducts(args: {
  q?: string | null;
  category?: string | null;
  type?: string | null;
  ing?: string | null;
  need?: string | null;
  tag?: string | null;
  sort?: string | null;
} = {}) {
  const { q, category, type, ing, need, tag, sort } = args ?? {};

  const where: any = { published: true };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  if (category) where.category = category;
  if (type) where.type = type;

  const orderBy =
    sort === "price-asc"  ? { priceCents: "asc" }  :
    sort === "price-desc" ? { priceCents: "desc" } :
    sort === "new" || sort === "newest" ? { createdAt: "desc" } :
    { createdAt: "desc" };

  let items = await prisma.product.findMany({ where, orderBy });

  // JSON array filters (SQLite) are done in JS
  const has = (arr: unknown, val: string) => Array.isArray(arr) && (arr as string[]).includes(val);
  if (ing)  items = items.filter((p: any) => has(p.ing,  ing));
  if (need) items = items.filter((p: any) => has(p.need, need));
  if (tag)  items = items.filter((p: any) => has(p.tag,  tag));

  return items;
}
