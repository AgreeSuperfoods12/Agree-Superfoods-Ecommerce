// components/shop/BuyBox.tsx
"use client";

import { useState } from "react";
import { QuantitySelector } from "./QuantitySelector";
import { AddToCartButton } from "./AddToCartButton";

export default function BuyBox({ productId }: { productId: string }) {
  const [qty, setQty] = useState(1);
  return (
    <div className="flex flex-wrap items-center gap-3">
      <QuantitySelector value={1} onChange={setQty} />
      <AddToCartButton productId={productId} quantity={qty} className="min-w-[12rem] flex-1" />
    </div>
  );
}
