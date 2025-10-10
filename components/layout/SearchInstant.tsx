"use client";
import { useEffect, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Item = { id: string; slug: string; title: string; priceCents: number; images: any };

export default function SearchInstant({
  className = "",
  placeholder = "Search superfoods…",
  mobile = false,
  panelMode = "dropdown",        // "dropdown" | "inline"
  autoFocus = false,
  onPick,                        // called when a result or “See all results” is clicked
}: {
  className?: string;
  placeholder?: string;
  mobile?: boolean;
  panelMode?: "dropdown" | "inline";
  autoFocus?: boolean;
  onPick?: () => void;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState(0);
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const acRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // click-away
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // autofocus when shown
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // fetch
  useEffect(() => {
    if (!q) { setItems([]); setPending(false); return; }
    acRef.current?.abort();
    const ac = new AbortController(); acRef.current = ac;
    setPending(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=6`, { signal: ac.signal });
        if (res.ok) {
          const data = await res.json();
          setItems(Array.isArray(data?.items) ? data.items : []);
        } else {
          setItems([]);
        }
      } catch { setItems([]); }
      setPending(false);
      setOpen(true);
      setActive(0);
    }, 160);
    return () => { clearTimeout(t); ac.abort(); };
  }, [q]);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(a + 1, items.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
    if (e.key === "Escape")    { setOpen(false); }
    if (e.key === "Enter") {
      if (items[active]) {
        onPick?.();
        router.push(`/products/${items[active].slug}`);
      } else {
        onPick?.();
        router.push(`/products?q=${encodeURIComponent(q)}`);
      }
    }
  };

  // panel placement
  const panelBase =
    panelMode === "inline"
      ? "relative z-10 mt-2 w-full rounded-xl border bg-white p-2 shadow-xl"
      : `absolute z-[60] mt-2 w-[min(92vw,28rem)] rounded-xl border bg-white p-2 shadow-xl ${mobile ? "left-0" : "right-0"}`;

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          value={q}
          onChange={e=>setQ(e.target.value)}
          onFocus={()=> setOpen(true)}
          onKeyDown={onKey}
          placeholder={placeholder}
          className="w-full rounded-lg border px-3 py-2 pr-9 text-sm outline-none focus:ring-2 focus:ring-[color:var(--color-brand)]"
        />
        <button type="button" aria-label="Search" className="absolute right-2 top-1/2 -translate-y-1/2">
          {pending ? <Loader2 className="h-4 w-4 animate-spin opacity-70"/> : <Search className="h-4 w-4 opacity-70" /> }
        </button>
      </div>

      {open && (
        <div className={panelBase}>
          {pending && <div className="px-2 py-3 text-sm opacity-70">Searching…</div>}

          {!pending && items.length > 0 && (
            <ul role="listbox">
              {items.map((it, i) => {
                const img = Array.isArray(it.images) && it.images.length ? it.images[0] : "/logo.svg";
                return (
                  <li key={it.id} aria-selected={i===active}>
                    <Link
                      href={`/products/${it.slug}`}
                      onClick={() => onPick?.()}
                      className={`flex items-center gap-3 rounded px-2 py-2 hover:bg-gray-100 ${i===active ? "bg-gray-100" : ""}`}
                    >
                      <Image src={img} alt="" width={44} height={34} className="h-11 w-14 rounded object-cover" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{it.title}</p>
                        <p className="text-xs opacity-70">${(it.priceCents/100).toFixed(2)}</p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {!pending && q && items.length === 0 && (
            <div className="px-2 py-3 text-sm opacity-70">No results for “{q}”.</div>
          )}

          <div className="border-t pt-2 mt-2 text-right">
            <Link
              className="text-sm underline opacity-80"
              href={`/products?q=${encodeURIComponent(q)}`}
              onClick={() => onPick?.()}
            >
              See all results
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
