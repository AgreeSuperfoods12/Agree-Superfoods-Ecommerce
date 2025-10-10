"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { z } from "zod";

const Schema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  slug: z.string().min(2).optional(),
  description: z.string().default(""),
  priceCents: z.coerce.number().int().min(0),
  currency: z.string().default("USD"),
  images: z.array(z.string()).default([]),
  category: z.string().optional(),
  type: z.string().optional(),
  ing: z.array(z.string()).default([]),
  need: z.array(z.string()).default([]),
  tag: z.array(z.string()).default([]),
  published: z.coerce.boolean().default(true),
});

const csv = (v: any) =>
  typeof v === "string" ? v.split(",").map(s => s.trim()).filter(Boolean) : [];

export async function upsertProduct(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const data = Schema.parse({
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    description: raw.description,
    priceCents: raw.priceCents,
    currency: raw.currency || "USD",
    images: csv(raw.images),
    category: raw.category,
    type: raw.type,
    ing: csv(raw.ing),
    need: csv(raw.need),
    tag: csv(raw.tag),
    published: raw.published === "on" || raw.published === "true",
  });

  const slug = (data.slug || slugify(data.title, { lower: true, strict: true })).slice(0,60);

  if (data.id) {
    await prisma.product.update({
      where: { id: data.id },
      data: { ...data, slug, images: data.images, ing: data.ing, need: data.need, tag: data.tag },
    });
  } else {
    await prisma.product.create({
      data: { ...data, slug, images: data.images, ing: data.ing, need: data.need, tag: data.tag },
    });
  }

  revalidatePath("/products");
  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/products");
  revalidatePath("/admin/products");
}