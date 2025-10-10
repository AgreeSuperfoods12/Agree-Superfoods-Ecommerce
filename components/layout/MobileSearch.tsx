"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import SearchInstant from "./SearchInstant";

export default function MobileSearch() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Search"
        className="rounded p-2 hover:bg-gray-100"
        onClick={() => setOpen(true)}
      >
        {/* use a simple SVG to avoid double-importing Search in server bundles */}
        <svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="m21 20.3l-4.35-4.35q-.75.65-1.725 1.012T13 17.3q-2.675 0-4.487-1.813T6.7 11q0-2.675 1.813-4.487T13 4.7q2.675 0 4.487 1.813T19.3 11q0 1.2-.362 2.175T17.925 14.9L22.3 19.25zM13 15.8q2 0 3.4-1.4T17.8 11q0-2-1.4-3.4T13 6.2q-2 0-3.4 1.4T8.2 11q0 2 1.4 3.4T13 15.8"/></svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[80]"
          onClick={(e) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div
            ref={panelRef}
            className="absolute inset-x-0 top-0 bg-white shadow-xl border-b rounded-b-2xl"
          >
            <div className="flex items-center justify-between px-3 py-3">
              <span className="text-base font-semibold">Search</span>
              <button
                aria-label="Close search"
                className="rounded p-2 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-3 pb-4">
              <SearchInstant
                mobile
                panelMode="inline"
                autoFocus
                placeholder="Search products…"
                onPick={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
