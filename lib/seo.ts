// lib/seo.ts
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function toAbsoluteUrl(path: string) {
  try { return new URL(path, SITE_URL).toString(); } catch { return path; }
}

// Compact clean meta description (155 chars)
export function toMetaDescription(
  source?: string | null,
  fallback?: string | null,
  max = 155
) {
  const raw = (source ?? fallback ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return raw.length <= max ? raw : raw.slice(0, max - 1).trimEnd() + "…";
}
