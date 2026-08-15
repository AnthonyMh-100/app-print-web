"use server";

import prisma from "@/lib/prisma";
import type { CatalogProduct } from "@/interfaces/catalog";
import type { CatalogCategoryItem } from "@/constants/catalog";

export interface LandingData {
  products: CatalogProduct[];
  categories: CatalogCategoryItem[];
}

export async function getLandingData(): Promise<LandingData> {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        basePrice: true,
        cardColor: true,
        isFeatured: true,
        stock: true,
        category: { select: { id: true, name: true, badgeColor: true } },
        images: {
          orderBy: { sortOrder: "asc" },
          select: { url: true },
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        badgeColor: true,
        _count: { select: { products: { where: { isActive: true } } } },
      },
    }),
  ]);

  const catalogProducts: CatalogProduct[] = products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: Number(product.basePrice),
    cardColor: product.cardColor,
    imageUrl: product.images[0]?.url ?? null,
    images: product.images.map((image) => image.url),
    isFeatured: product.isFeatured,
    category: product.category,
    stock: product.stock,
  }));

  const categoryFilters: CatalogCategoryItem[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    badgeColor: category.badgeColor,
    count: category._count.products,
  }));

  return { products: catalogProducts, categories: categoryFilters };
}
