import Link from "next/link";
import { Search, User } from "lucide-react";
import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";
import SearchInstant from "./SearchInstant";
import CartLink from "@/components/shop/CartLink";
import Popover from "./header/Popover";
import MobileSearch from "./MobileSearch";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 rounded bg-black px-2 py-1 text-white">
        Skip to content
      </a>

      <div className="mx-auto max-w-7xl px-4">
        {/* Desktop */}
        <div className="hidden sm:grid grid-cols-[1fr_auto_1fr] items-center gap-3 h-16">
          <div className="min-w-0"><HeaderDesktop /></div>
          <div className="justify-self-center">
            <Link href="/" aria-label="Phenomena home" className="block text-xl md:text-2xl font-extrabold tracking-tight">
              Phenomena
            </Link>
          </div>
          <div className="ml-auto flex items-center justify-end gap-1">
            <Popover
              button={<Search className="h-5 w-5" />}
              buttonClassName="flex cursor-pointer items-center rounded p-2 hover:bg-gray-100"
              panelClassName="absolute right-0 top-full mt-2 w-[30rem] max-w-[92vw] rounded-xl border bg-white p-3 shadow-xl z-50"
              ariaLabel="Open search"
            >
              <SearchInstant placeholder="Search products…" />
            </Popover>
            <Link href="/account" className="inline-flex items-center gap-2 rounded p-2 hover:bg-gray-100">
              <User className="h-5 w-5" />
              <span className="hidden md:inline text-sm">Account</span>
            </Link>
            <CartLink />
          </div>
        </div>

        {/* Mobile */}
        <div className="sm:hidden flex items-center justify-between gap-2 h-14">
          <HeaderMobile />
          <Link href="/" aria-label="Phenomena home" className="text-lg font-extrabold tracking-tight">Phenomena</Link>
          <div className="flex items-center gap-1">
            <MobileSearch />
            <CartLink />
          </div>
        </div>
      </div>
    </header>
  );
}
