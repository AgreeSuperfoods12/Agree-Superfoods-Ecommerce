// prisma/seed.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // wipe existing (safe in dev)
  await prisma.blogPost.deleteMany();
  await prisma.product.deleteMany();

  // PRODUCTS
  await prisma.product.createMany({
    data: [
      {
        slug: "green-tea",
        title: "Green Tea",
        description: "Refreshing green tea rich in antioxidants.",
        priceCents: 599,
        currency: "USD",
        images: ["/products/green-tea.svg"],   // file in /public/products
        category: "tea",
        type: "beverage",
        ing: ["green tea leaves"],
        need: ["immunity", "detox"],
        tag: ["antioxidants"],
        published: true,
      },
      {
        slug: "turmeric",
        title: "Turmeric Powder",
        description: "Curcumin-rich turmeric powder.",
        priceCents: 899,
        currency: "USD",
        images: ["/products/turmeric.svg"],
        category: "spices",
        type: "supplement",
        ing: ["turmeric"],
        need: ["inflammation"],
        tag: ["curcumin"],
        published: true,
      },
      {
        slug: "super-greens",
        title: "Super Greens Mix",
        description: "Daily greens blend for overall wellness.",
        priceCents: 1999,
        currency: "USD",
        images: ["/products/super-greens.svg"],
        category: "mix",
        type: "supplement",
        ing: ["spirulina", "moringa", "chlorella"],
        need: ["energy", "detox"],
        tag: ["greens"],
        published: true,
      },
    ],
  });

  // BLOG
  await prisma.blogPost.create({
    data: {
      slug: "white-tea-benefits",
      title: "White Tea Benefits",
      excerpt:
        "White tea is the least processed tea and packs gentle antioxidants.",
      content:
        "White tea is harvested early and dried gently, preserving catechins. It has a light flavor and may support heart and skin health.\n\n**How to brew:** 75–80°C for 3–4 minutes.",
      coverImage: "/blog/white-tea.webp",     // put the file in /public/blog
      tags: ["tea", "wellness"],
      metaTitle: "White Tea Benefits",
      metaDescription:
        "Learn the benefits of white tea, how to brew it, and why its antioxidants matter.",
      ogImage: "/blog/white-tea.webp",
      canonical: "/blog/white-tea-benefits",
      published: true,
    },
  });
}

main()
  .then(async () => {
    console.log("Seeded.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
