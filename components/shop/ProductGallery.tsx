// components/shop/ProductGallery.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const normalized = Array.isArray(images) && images.length ? images : ["/logo.svg"];
  const normalizeSrc = (u: string) => (u.startsWith("http") || u.startsWith("/") ? u : `/${u.replace(/^\.?\//, "")}`);
  const [active, setActive] = useState(0);

  return (
    <section aria-label="Product media" className="space-y-3">
      <div className="group relative overflow-hidden rounded-2xl border bg-white">
        <Image
          src={normalizeSrc(normalized[active])}
          alt={alt}
          width={1600}
          height={1200}
          priority
          className="aspect-[4/3] h-auto w-full object-cover transition-transform group-hover:scale-[1.02]"
        />
        <span className="pointer-events-none absolute bottom-3 right-3 rounded bg-black/50 px-2 py-1 text-xs text-white">
          Hover to zoom
        </span>
      </div>

      {normalized.length > 1 && (
        <ul className="flex gap-2 overflow-x-auto">
          {normalized.map((u, i) => (
            <li key={i}>
              <button
                type="button"
                aria-label={`Show image ${i + 1}`}
                onClick={() => setActive(i)}
                className={`relative overflow-hidden rounded-lg border ${i === active ? "ring-2 ring-[color:var(--color-brand)]" : ""}`}
              >
                <Image
                  src={normalizeSrc(u)}
                  alt=""
                  width={240}
                  height={180}
                  className="aspect-[4/3] h-20 w-28 object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
