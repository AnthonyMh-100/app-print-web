"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { categorySchema } from "@/lib/schemas";
import { validate } from "@/lib/validation";

export type CategoryActionResult =
  | { success: false; errors: Record<string, string> }
  | { success: true; data: { id: number; slug: string } };

type CategoryDeleteResult =
  | { success: false; error: string }
  | { success: true };

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return false;
  return true;
}

async function ensureUniqueSlug(
  base: string,
  excludeId?: number,
): Promise<string> {
  const root = base || "categoria";
  let candidate = root;
  let counter = 2;
  while (
    await prisma.category.findFirst({
      where: {
        slug: candidate,
        NOT: excludeId ? { id: excludeId } : undefined,
      },
    })
  ) {
    candidate = `${root}-${counter}`;
    counter += 1;
  }
  return candidate;
}

export async function createCategory(
  _prevState: CategoryActionResult,
  formData: FormData,
): Promise<CategoryActionResult> {
  if (!(await requireAdmin())) {
    return { success: false, errors: { root: "Unauthorized" } };
  }

  const input = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    badgeColor: formData.get("badgeColor"),
  };

  const outcome = validate(categorySchema, input);
  if (!outcome.success) {
    return { success: false, errors: outcome.errors };
  }

  const { name, description, badgeColor, slug } = outcome.data;
  const uniqueSlug = await ensureUniqueSlug(slugify(slug || name));

  try {
    const category = await prisma.category.create({
      data: {
        name,
        slug: uniqueSlug,
        description: description || null,
        badgeColor: badgeColor || null,
      },
      select: { id: true, slug: true },
    });

    return { success: true, data: { id: category.id, slug: category.slug } };
  } catch {
    return { success: false, errors: { root: "error_generic" } };
  }
}

export async function updateCategory(
  _prevState: CategoryActionResult,
  formData: FormData,
): Promise<CategoryActionResult> {
  if (!(await requireAdmin())) {
    return { success: false, errors: { root: "Unauthorized" } };
  }

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return { success: false, errors: { root: "category_not_found" } };
  }

  const input = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    badgeColor: formData.get("badgeColor"),
  };

  const outcome = validate(categorySchema, input);
  if (!outcome.success) {
    return { success: false, errors: outcome.errors };
  }

  const { name, description, badgeColor, slug } = outcome.data;
  const uniqueSlug = await ensureUniqueSlug(slugify(slug || name), id);

  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug: uniqueSlug,
        description: description || null,
        badgeColor: badgeColor || null,
      },
      select: { id: true, slug: true },
    });

    return { success: true, data: { id: category.id, slug: category.slug } };
  } catch {
    return { success: false, errors: { root: "category_not_found" } };
  }
}

export async function deleteCategory(
  formData: FormData,
): Promise<CategoryDeleteResult> {
  if (!(await requireAdmin())) {
    return { success: false, error: "Unauthorized" };
  }

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return { success: false, error: "category_not_found" };
  }

  try {
    await prisma.category.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "P2003"
    ) {
      return { success: false, error: "category_has_products" };
    }
    return { success: false, error: "category_not_found" };
  }
}
