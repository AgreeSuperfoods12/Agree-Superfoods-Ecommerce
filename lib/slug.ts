// lib/slug.ts
export function slugify(input: string): string {
    return input
      .toLowerCase()
      .normalize("NFKD")                // remove accents
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  