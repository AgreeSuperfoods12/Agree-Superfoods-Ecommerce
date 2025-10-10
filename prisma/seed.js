const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const P = (slug, title, price, desc, tags, type="powder") => ({
    slug, title, description: desc, priceCents: price, currency: "usd",
    images: [`/products/${slug}.svg`], category: "superfoods", type, tags
  });

  const items = [
    P("moringa-leaf", "Moringa Leaf Powder", 1599, "Organic moringa—daily greens boost.", ["moringa","energy","best"]),
    P("spirulina", "Spirulina Powder", 1799, "Blue-green algae rich in protein & iron.", ["spirulina","immunity"]),
    P("ashwagandha", "Ashwagandha Capsules", 2199, "Adaptogen for stress & sleep.", ["ashwagandha","stress"], "capsule"),
    P("turmeric", "Turmeric Curcumin", 1499, "High-curcumin turmeric for joint support.", ["turmeric","inflammation"], "capsule"),
    P("super-greens", "Super Greens Blend", 2499, "Daily blend of 12 greens & enzymes.", ["energy","gut","best"]),
    P("immunity-pack", "Immunity Pack (Bundle)", 3999, "Bundle: Spirulina + Vitamin C.", ["immunity","sale"], "bundle"),
  ];

  for (const p of items) {
    await prisma.product.upsert({ where: { slug: p.slug }, update: p, create: p });
  }
  console.log("Seeded superfoods.");
}
main().finally(()=>prisma.$disconnect());