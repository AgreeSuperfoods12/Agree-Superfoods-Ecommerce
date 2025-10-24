// app/admin/(protected)/products/[id]/edit/page.tsx
import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

type ProductForForm = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  currency: string;
  images?: string[] | null;
  category?: string | null;
  type?: string | null;
  ing?: string[] | null;
  need?: string[] | null;
  tag?: string[] | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const toStrArr = (v: unknown): string[] | null =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : null;

export default async function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) return <main className="p-6">Not found</main>;

  // Normalize Prisma JsonValue -> string[] | null for the form
  const product: ProductForForm = {
    ...p,
    images: toStrArr(p.images),
    ing: toStrArr(p.ing),
    need: toStrArr(p.need),
    tag: toStrArr(p.tag),
  };

  return <ProductForm product={product} />;
}