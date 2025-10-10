import Link from "next/link";
import Image from "next/image";
import { AddToCartButton } from "@/components/shop/AddToCartButton";

type Product = {
  id: string;
  slug: string;
  title: string;
  priceCents: number;
  images: any; // JSON field; we expect string[] but can be any
};

export default function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => {
        const img = Array.isArray(p.images) && p.images.length ? p.images[0] : "/logo.svg";
        return (
          <li key={p.id} className="group rounded-2xl border p-4 shadow-sm transition hover:shadow-md">
            <Link href={`/products/${p.slug}`} className="block">
              <div className="mb-3 overflow-hidden rounded-lg">
                <Image
                  src={img}
                  alt={p.title}
                  width={600}
                  height={450}
                  className="aspect-[4/3] w-full object-cover transition group-hover:scale-[1.02]"
                />
              </div>
              <p className="font-medium tracking-tight">{p.title}</p>
              <p className="text-sm opacity-70">${(p.priceCents / 100).toFixed(2)}</p>
            </Link>
            <div className="mt-3">
              <AddToCartButton productId={p.id} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}