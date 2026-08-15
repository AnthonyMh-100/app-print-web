"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { productSchema } from "@/lib/schemas";
import { validate } from "@/lib/validation";
import { deleteImage } from "@/lib/cloudinary";

type ProductActionResult =
  | { success: false; errors: Record<string, string> }
  | { success: true; data: { id: number; slug: string } };

async function ensureUniqueSlug(base: string, excludeId?: number): Promise<string> {
  const root = base || "producto";
  let candidate = root;
  let counter = 2;
  while (
    await prisma.product.findFirst({
      where: { slug: candidate, NOT: excludeId ? { id: excludeId } : undefined },
    })
  ) {
    candidate = `${root}-${counter}`;
    counter += 1;
  }
  return candidate;
}

export async function createProduct(
  _prevState: ProductActionResult,
  formData: FormData,
): Promise<ProductActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, errors: { root: "Inicia sesión para continuar" } };
  }

  const input = Object.fromEntries(formData);
  const result = validate(productSchema, input);
  if (!result.success) return result;

  const data = result.data;
  const uniqueSlug = await ensureUniqueSlug(data.slug || slugify(data.name));

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: uniqueSlug,
        description: data.description ?? null,
        basePrice: data.price.toString(),
        stock: data.stock,
        cardColor: data.cardColor || null,
        categoryId: data.categoryId,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        images: {
          create: data.images.map((image, index) => ({
            publicId: image.publicId,
            url: image.url,
            format: image.format ?? null,
            sortOrder: index,
            isPrimary: index === 0,
          })),
        },
      },
    });

    return { success: true, data: { id: product.id, slug: product.slug } };
  } catch {
    for (const image of data.images) {
      try {
        await deleteImage(image.publicId);
      } catch {
        // limpieza de mejor esfuerzo
      }
    }
    return {
      success: false,
      errors: { root: "No se pudo guardar el producto. Inténtalo de nuevo." },
    };
  }
}

export async function updateProduct(
  _prevState: ProductActionResult,
  formData: FormData,
): Promise<ProductActionResult> {
  const session = await auth();
  if (!session?.user) {
    return { success: false, errors: { root: "Inicia sesión para continuar" } };
  }

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return { success: false, errors: { root: "Producto no encontrado" } };
  }

  const input = Object.fromEntries(formData);
  const result = validate(productSchema, input);
  if (!result.success) return result;

  const data = result.data;
  const uniqueSlug = await ensureUniqueSlug(data.slug || slugify(data.name), id);

  try {
    const existing = await prisma.product.findUnique({
      where: { id },
      select: { id: true, images: { select: { id: true, publicId: true } } },
    });
    if (!existing) {
      return { success: false, errors: { root: "Producto no encontrado" } };
    }

    const submittedPublicIds = new Set(data.images.map((image) => image.publicId));

    const removed = existing.images.filter((image) => !submittedPublicIds.has(image.publicId));

    if (removed.length > 0) {
      for (const image of removed) {
        try {
          await deleteImage(image.publicId);
        } catch {
          // limpieza de mejor esfuerzo
        }
      }
      await prisma.productImage.deleteMany({
        where: { productId: id, publicId: { in: removed.map((image) => image.publicId) } },
      });
    }

    const newImages = data.images.filter((image) => !image.existingId);
    const keptImages = data.images.filter((image) => image.existingId);

    const imageOps = [
      ...keptImages.map((image, index) =>
        prisma.productImage.update({
          where: { id: image.existingId! },
          data: { sortOrder: index, isPrimary: index === 0 },
        }),
      ),
      ...newImages.map((image, index) =>
        prisma.productImage.create({
          data: {
            productId: id,
            publicId: image.publicId,
            url: image.url,
            format: image.format ?? null,
            sortOrder: index,
            isPrimary: index === 0,
          },
        }),
      ),
    ];

    if (imageOps.length > 0) {
      await prisma.$transaction(imageOps);
    }

    await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: uniqueSlug,
        description: data.description ?? null,
        basePrice: data.price.toString(),
        stock: data.stock,
        cardColor: data.cardColor || null,
        categoryId: data.categoryId,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
      },
    });

    return { success: true, data: { id, slug: uniqueSlug } };
  } catch {
    return {
      success: false,
      errors: { root: "No se pudo guardar el producto. Inténtalo de nuevo." },
    };
  }
}

export async function toggleProductActive(formData: FormData): Promise<{ success: boolean }> {
  const session = await auth();
  if (!session?.user) return { success: false };

  const id = Number(formData.get("id"));
  const active = formData.get("active") === "true";
  if (!Number.isInteger(id) || id <= 0) return { success: false };

  try {
    await prisma.product.update({ where: { id }, data: { isActive: active } });
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function deleteProduct(formData: FormData): Promise<{ success: boolean }> {
  const session = await auth();
  if (!session?.user) return { success: false };

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return { success: false };

  try {
    const existing = await prisma.product.findUnique({
      where: { id },
      select: { images: { select: { publicId: true } } },
    });

    await prisma.product.delete({ where: { id } });

    if (existing) {
      for (const image of existing.images) {
        try {
          await deleteImage(image.publicId);
        } catch {
          // limpieza de mejor esfuerzo
        }
      }
    }

    return { success: true };
  } catch {
    return { success: false };
  }
}