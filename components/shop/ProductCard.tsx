// components/shop/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "./AddToCartButton";

type P = { id: string; slug: string; title: string; priceCents: number; images?: any };

export function ProductCard({ p }: { p: P }) {
  const imgs = Array.isArray((p as any).images) ? ((p as any).images as string[]) : [];
  const img = imgs[0] ?? "/logo.svg";

  return (
    <li className="group rounded-2xl border bg-white p-3 shadow-sm transition hover:shadow-md focus-within:shadow-md">
      <Link href={`/products/${p.slug}`} className="block focus:outline-none">
        <div className="mb-3 overflow-hidden rounded-xl">
          <Image
            src={img}
            alt={p.title}
            width={600}
            height={450}
            className="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        </div>
        <p className="line-clamp-2 font-medium tracking-tight">{p.title}</p>
        <p className="mt-0.5 text-sm text-gray-600">${(p.priceCents / 100).toFixed(2)}</p>
      </Link>
      <div className="mt-3">
        <AddToCartButton productId={p.id} className="w-full" />
      </div>
    </li>
  );
}
