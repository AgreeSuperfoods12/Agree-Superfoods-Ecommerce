"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { megaColumns } from "./nav-data";
import Popover from "./header/Popover";

export default function MegaMenu() {
  return (
    <Popover
      button={
        <span className="flex items-center gap-1 text-sm font-medium">
          Shop <ChevronDown className="h-4 w-4 opacity-60" />
        </span>
      }
      buttonClassName="rounded px-2 py-1 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10"
      panelClassName="absolute left-0 top-full mt-2 w-[min(92vw,980px)] rounded-2xl border bg-white p-6 shadow-xl z-40"
      ariaLabel="Open shop menu"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {megaColumns.map((col) => (
          <div key={col.heading}>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider opacity-70">
              {col.heading}
            </p>
            <ul className="space-y-1">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block rounded px-2 py-1 text-sm hover:bg-gray-100"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-lg border p-3">
        <div>
          <p className="text-sm font-medium">Explore everything</p>
          <p className="text-xs opacity-70">Shop all products and bundles</p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          Shop All
        </Link>
      </div>
    </Popover>
  );
}
