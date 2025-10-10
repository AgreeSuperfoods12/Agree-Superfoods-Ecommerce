import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditProduct({ params }: Props) {
  const { id } = await params;
  const p = await prisma.product.findUnique({ where: { id } });
  if (!p) return <main className="p-6">Not found</main>;
  return <ProductForm product={p} />;
}
