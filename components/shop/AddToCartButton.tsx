// components/shop/AddToCartButton.tsx
"use client";
import { useTransition } from "react";
import { addToCart } from "@/app/(checkout)/cart/actions";

export function AddToCartButton({
  productId,
  quantity = 1,
  className = "",
  onAdded,
}: {
  productId: string;
  quantity?: number;
  className?: string;
  onAdded?: () => void;
}) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      aria-busy={pending}
      className={`inline-flex items-center justify-center rounded-lg bg-[color:var(--color-brand)] px-4 py-2.5 text-white font-medium shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color:var(--color-brand)] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      onClick={() =>
        start(async () => {
          await addToCart(productId, quantity);
          onAdded?.();
        })
      }
    >
      {pending ? (
        <>
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Adding…
        </>
      ) : (
        "Add to cart"
      )}
    </button>
  );
}
