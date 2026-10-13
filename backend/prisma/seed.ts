import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { products as catalog } from "../../src/data/siteData";

const prisma = new PrismaClient();

const STOCK_QUANTITY: Record<string, number> = {
  "In stock": 10,
  "Low stock": 2,
  "Out of stock": 0,
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const ALL_CATEGORIES = [
  "Whey Protein",
  "Creatine",
  "Pre Workout",
  "Amino Acids",
  "Fat Loss",
  "Anabolic",
  "Health & Wellness",
  "Protein Foods",
  "Accessories",
];

async function main() {
  for (const catName of ALL_CATEGORIES) {
    await prisma.category.upsert({
      where: { name: catName },
      update: {},
      create: { name: catName, slug: slugify(catName) },
    });
  }

  for (const product of catalog) {
    const brand = await prisma.brand.upsert({
      where: { name: product.brand },
      update: {},
      create: { name: product.brand, slug: slugify(product.brand) },
    });
    const category = await prisma.category.upsert({
      where: { name: product.category },
      update: {},
      create: { name: product.category, slug: slugify(product.category) },
    });
    const stockQuantity = STOCK_QUANTITY[product.stock] ?? 10;

    const record = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        image: product.image,
        tags: product.tags,
        benefits: product.benefits,
        specifications: product.specifications,
        rating: product.rating,
        reviewCount: product.reviewCount,
        pricePaise: Math.round(product.price * 100),
        compareAtPricePaise: product.compareAtPrice === undefined ? null : Math.round(product.compareAtPrice * 100),
        featured: product.featured === true,
        bestseller: product.bestseller === true,
        brandId: brand.id,
        categoryId: category.id,
      },
      create: {
        slug: product.slug,
        name: product.name,
        shortDescription: product.shortDescription,
        description: product.description,
        image: product.image,
        tags: product.tags,
        benefits: product.benefits,
        specifications: product.specifications,
        rating: product.rating,
        reviewCount: product.reviewCount,
        pricePaise: Math.round(product.price * 100),
        compareAtPricePaise: product.compareAtPrice === undefined ? null : Math.round(product.compareAtPrice * 100),
        status: "ACTIVE",
        featured: product.featured === true,
        bestseller: product.bestseller === true,
        brandId: brand.id,
        categoryId: category.id,
      },
    });

    for (const variant of product.variants) {
      const sku = `${product.slug}-${slugify(variant.name)}-${slugify(variant.value)}`.slice(0, 120);
      await prisma.productVariant.upsert({
        where: { productId_name_value: { productId: record.id, name: variant.name, value: variant.value } },
        update: { stockQuantity, isActive: true },
        create: {
          productId: record.id,
          name: variant.name,
          value: variant.value,
          sku,
          stockQuantity,
          isActive: true,
        },
      });
    }
  }

  const total = await prisma.product.count();
  console.log(`Seed complete: catalog is synced (${total} products).`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
