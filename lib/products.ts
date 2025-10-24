// lib/products.ts
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

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

  const where: Prisma.ProductWhereInput = {
    published: true,
    ...(category ? { category } : {}),
    ...(type ? { type } : {}),
  };

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput = (() => {
    switch (sort) {
      case "price-asc":
        return { priceCents: "asc" };
      case "price-desc":
        return { priceCents: "desc" };
      case "new":
      case "newest":
      default:
        return { createdAt: "desc" };
    }
  })();

  let items = await prisma.product.findMany({ where, orderBy });

  // Helpers to safely handle JSON string arrays stored in Postgres JSON columns
  const toStringArray = (val: unknown): string[] =>
    Array.isArray(val) ? (val.filter((v) => typeof v === "string") as string[]) : [];

  if (ing)  items = items.filter((p) => toStringArray(p.ing).includes(ing));
  if (need) items = items.filter((p) => toStringArray(p.need).includes(need));
  if (tag)  items = items.filter((p) => toStringArray(p.tag).includes(tag));

  return items;
}
