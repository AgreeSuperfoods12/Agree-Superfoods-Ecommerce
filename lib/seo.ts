// lib/seo.ts

// Robust SITE_URL that never throws at build time.
// - Uses NEXT_PUBLIC_SITE_URL if set
// - Falls back to VERCEL_URL in prod
// - Finally falls back to localhost
export const SITE_URL = (() => {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  try {
    // Normalize to origin (removes any path/trailing slash)
    return new URL(raw).origin;
  } catch {
    console.warn("[seo] Invalid NEXT_PUBLIC_SITE_URL:", raw, "— falling back to http://localhost:3000");
    return "http://localhost:3000";
  }
})();

// Build an absolute URL safely
export function toAbsoluteUrl(path: string) {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

// Compact, clean meta description (default 155 chars)
export function toMetaDescription(
  source?: string | null,
  fallback?: string | null,
  max = 155
) {
  const raw = (source ?? fallback ?? "")
    .replace(/<[^>]+>/g, " ") // strip HTML tags
    .replace(/\s+/g, " ")     // collapse whitespace
    .trim();

  return raw.length <= max ? raw : raw.slice(0, max - 1).trimEnd() + "…";
}
