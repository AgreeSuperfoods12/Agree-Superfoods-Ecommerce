"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight, ChevronLeft } from "lucide-react";
import { megaColumns, mainNav } from "./nav-data";

/**
 * Mobile drawer (final):
 * - Compact rows (no boxy cards)
 * - Full-height, scrollable content area
 * - Sticky header with Back / Close
 * - Closes immediately on any link tap AND on route change
 * - Body scroll is locked while drawer is open
 */
export default function HeaderMobile() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"root" | "shop">("root");
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on route change
  useEffect(() => {
    setOpen(false);
    setView("root");
  }, [pathname]);

  // ESC to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const groups = useMemo(() => megaColumns, []);
  const closeNow = () => setOpen(false);

  return (
    <div className="sm:hidden flex items-center">
      {/* Menu trigger */}
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded border px-2 py-1"
      >
        <Menu className="h-5 w-5" />
        <span className="text-sm">Menu</span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/60"
          onClick={(e) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
              closeNow();
            }
          }}
        />
      )}

      {/* Drawer */}
      <aside
        ref={panelRef}
        // flex column + min-h-0 makes the content area scroll correctly on mobile
        className={`fixed inset-y-0 left-0 z-[61] w-[min(90vw,360px)] transform bg-white shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
        aria-hidden={!open}
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b bg-white">
          {view === "root" ? (
            <span className="text-lg font-extrabold tracking-tight">Phenomena</span>
          ) : (
            <button
              className="inline-flex items-center gap-2 rounded p-1 -ml-1 hover:bg-gray-100"
              onClick={() => setView("root")}
              aria-label="Back"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm">Back</span>
            </button>
          )}
          <button
            aria-label="Close menu"
            className="rounded p-2 hover:bg-gray-100"
            onClick={closeNow}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content area (scrollable) */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[max(env(safe-area-inset-bottom),16px)]">
          {view === "root" ? (
            <nav className="py-1">
              <ul className="px-1">
                {/* Shop → deeper */}
                <li>
                  <button
                    className="w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-left hover:bg-gray-50"
                    onClick={() => setView("shop")}
                  >
                    <span className="text-[15px]">Shop</span>
                    <ChevronRight className="h-5 w-5 opacity-70" />
                  </button>
                </li>

                {/* Other top-level links */}
                {mainNav.slice(1).map((item) => (
                  <li key={`${item.href}-${item.label}`}>
                    <Link
                      href={item.href}
                      onClick={closeNow}
                      className={`block rounded-lg px-3 py-2.5 hover:bg-gray-50 ${
                        item.tone === "sale" ? "text-red-600" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[15px]">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`ml-1 rounded px-1.5 py-0.5 text-[11px] leading-none ${
                              item.tone === "sale"
                                ? "bg-red-500 text-white"
                                : "bg-gray-900 text-white"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Utilities */}
              <div className="mt-6 border-t px-3 py-4 space-y-2 text-sm">
                <Link href="/account" onClick={closeNow} className="block opacity-80 hover:opacity-100">
                  Log in
                </Link>
                <Link href="/account/register" onClick={closeNow} className="block opacity-80 hover:opacity-100">
                  Create account
                </Link>
              </div>
            </nav>
          ) : (
            // SHOP view — compact list, thin dividers, no boxes
            <div>
              {groups.map((g) => (
                <div key={g.heading} className="px-3 pt-3">
                  <h3 className="px-1 pb-1 text-[11px] font-semibold uppercase tracking-wider opacity-70">
                    {g.heading}
                  </h3>
                  <ul className="rounded-lg border border-gray-200/70 divide-y divide-gray-200/70 bg-white">
                    {g.links.map((l) => (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          onClick={closeNow}
                          className="flex h-11 items-center justify-between gap-3 px-3 text-[15px] hover:bg-gray-50"
                        >
                          <span className="truncate">{l.label}</span>
                          <ChevronRight className="h-4 w-4 opacity-70 shrink-0" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="h-4" />
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
