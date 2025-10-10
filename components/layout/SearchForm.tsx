import { Search } from "lucide-react";

export default function SearchForm() {
  return (
    <form
      action="/products"
      role="search"
      aria-label="Search products"
      className="relative hidden md:block w-full max-w-sm"
    >
      <input
        type="search"
        name="q"
        placeholder="Search superfoods…"
        className="w-full rounded-lg border px-3 py-2 pr-9 text-sm outline-none focus:ring-2 focus:ring-[color:var(--color-brand)]"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        <Search className="h-4 w-4 opacity-70" />
      </button>
    </form>
  );
}
