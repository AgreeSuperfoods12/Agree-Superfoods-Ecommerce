// components/shop/CartLink.tsx  (NO "use client")
import Link from "next/link";
import { readCart, cartCount } from "@/lib/cart";

export default async function CartLink() {
  const count = cartCount(await readCart());

  return (
    <Link href="/cart" className="relative">
      Cart
      {count > 0 && (
        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full border px-1 text-xs">
          {count}
        </span>
      )}
    </Link>
  );
}
