// components/shop/QuantitySelector.tsx
"use client";

import { useEffect, useState } from "react";

export function QuantitySelector({
  value = 1,
  min = 1,
  max = 10,
  onChange,
}: {
  value?: number;
  min?: number;
  max?: number;
  onChange?: (v: number) => void;
}) {
  const [qty, setQty] = useState(value);
  useEffect(() => setQty(value), [value]);

  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  const commit = (n: number) => {
    const v = clamp(Number.isFinite(n) ? n : min);
    setQty(v);
    onChange?.(v);
  };

  return (
    <div className="inline-flex items-stretch overflow-hidden rounded-lg border">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => commit(qty - 1)}
        className="px-3 py-2 hover:bg-gray-50 focus:outline-none focus-visible:ring"
      >
        −
      </button>
      <input
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label="Quantity"
        className="w-12 text-center outline-none"
        value={qty}
        onChange={(e) => commit(parseInt(e.target.value || "0", 10))}
      />
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => commit(qty + 1)}
        className="px-3 py-2 hover:bg-gray-50 focus:outline-none focus-visible:ring"
      >
        +
      </button>
    </div>
  );
}
