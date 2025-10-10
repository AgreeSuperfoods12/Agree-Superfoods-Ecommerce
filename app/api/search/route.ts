import { NextResponse } from "next/server";
import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/db";

type DBProduct = {
  id: string | number;
  slug: string;
  title: string;
  priceCents: number | null;
  images: unknown;
};

function normalizeImages(images: unknown): string[] {
  if (!images) return [];
  if (Array.isArray(images)) {
    return images
      .map((x) => (typeof x === "string" ? x : (x as any)?.url))
      .filter(Boolean) as string[];
  }
  if (typeof images === "object" && images !== null && "url" in (images as any)) {
    return [((images as any).url as string) || ""].filter(Boolean);
  }
  return [];
}

export async function GET(req: Request) {
  noStore();

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  const limit = Math.min(24, Math.max(1, parseInt(searchParams.get("limit") || "6", 10)));

  if (!q) return NextResponse.json({ items: [] });

  const words = q.split(/\s+/).filter(Boolean);

  // NOTE: don't use `mode: "insensitive"` here — not supported on SQLite.
  const found: DBProduct[] = await prisma.product.findMany({
    where: {
      // If you want to hide drafts, re-enable after ensuring your seed sets it properly:
      // published: true,
      OR: [
        { title: { contains: q } },
        { slug: { contains: q } },
        { description: { contains: q } },
        ...words.map((w) => ({ title: { contains: w } })),
      ],
    },
    select: { id: true, slug: true, title: true, priceCents: true, images: true },
    take: limit,
    orderBy: { title: "asc" },
  });

  const items = found.map((p) => ({
    id: String(p.id),
    slug: p.slug,
    title: p.title,
    priceCents: p.priceCents ?? 0,
    images: normalizeImages(p.images),
  }));

  return NextResponse.json({ items });
}
