// app/admin/(protected)/layout.tsx
export const runtime = "nodejs";          // run on Node, not Edge
export const dynamic = "force-dynamic";   // no prerender/caching
export const revalidate = 0;

import { isAuthed } from "../session";
import { redirect } from "next/navigation";
import { logout } from "../actions";

export default async function AdminProtectedLayout({
  children,
}: { children: React.ReactNode }) {
  if (!(await isAuthed())) redirect("/admin/login");

  return (
    <div className="min-h-dvh">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Admin</h1>
          <nav className="flex gap-4 text-sm">
            <a href="/admin/products">Products</a>
            <a href="/admin/blog">Blog</a>
            <a href="/">Storefront</a>
            <form action={logout}>
              <button className="rounded-lg border px-3 py-1.5">Logout</button>
            </form>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
    </div>
  );
}
