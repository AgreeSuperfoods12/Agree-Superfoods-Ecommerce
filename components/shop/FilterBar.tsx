// components/shop/FilterBar.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function FilterBar({
  total,
  initialQ,
  initialSort,
}: {
  total: number;
  initialQ?: string;
  initialSort?: string;
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(initialQ ?? "");
  const [sort, setSort] = useState(initialSort ?? "");

  useEffect(() => {
    setQ(initialQ ?? "");
    setSort(initialSort ?? "");
  }, [initialQ, initialSort]);

  const apply = (next: { q?: string; sort?: string }) => {
    const nextSp = new URLSearchParams(sp.toString());
    if (next.q !== undefined) {
      if (next.q) nextSp.set("q", next.q);
      else nextSp.delete("q");
    }
    if (next.sort !== undefined) {
      if (next.sort) nextSp.set("sort", next.sort);
      else nextSp.delete("sort");
    }
    router.push(`/products?${nextSp.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            placeholder="Search products"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") apply({ q });
            }}
            className="w-72 max-w-full rounded-lg border px-3 py-2 pr-10"
          />
          <button
            aria-label="Search"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md px-2 py-1.5 text-sm hover:bg-gray-50"
            onClick={() => apply({ q })}
          >
            Go
          </button>
        </div>
        <span className="hidden text-sm text-gray-500 sm:inline" aria-live="polite">
          {total} item{total === 1 ? "" : "s"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm">Sort</label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            apply({ sort: e.target.value });
          }}
          className="rounded-lg border px-2 py-2 text-sm"
        >
          <option value="">Featured</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
        </select>
      </div>
    </div>
  );
}
