export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto max-w-7xl px-4 py-8 text-sm opacity-70">
        © {new Date().getFullYear()} Acme Store. All rights reserved.
      </div>
    </footer>
  );
}