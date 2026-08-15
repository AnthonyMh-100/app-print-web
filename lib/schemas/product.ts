import { z } from "zod";

const name = z
  .string({ error: "required" })
  .trim()
  .min(2, { error: "name_short" })
  .max(50, { error: "name_long" });

const slug = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9-]*$/, { error: "slug_invalid" });

const description = z
  .string({ error: "required" })
  .trim()
  .max(300, { error: "description_long" })
  .optional()
  .nullable();

const categoryId = z.coerce.number({ error: "category_required" }).int().positive();

const price = z.coerce.number({ error: "price_invalid" }).min(0, { error: "price_invalid" });

const stock = z.coerce
  .number({ error: "stock_invalid" })
  .int({ error: "stock_invalid" })
  .min(0, { error: "stock_invalid" });

const cardColor = z.string().trim().optional();

const boolFromString = (defaultValue: "true" | "false") =>
  z
    .enum(["true", "false"])
    .default(defaultValue)
    .transform((value) => value === "true");

const image = z.object({
  publicId: z.string().min(1, { error: "image_invalid" }),
  url: z.string().min(1, { error: "image_invalid" }),
  format: z.string().nullable().optional(),
  existingId: z.coerce.number().int().positive().optional(),
});

const images = z
  .string({ error: "image_invalid" })
  .default("[]")
  .transform((value) => {
    try {
      return JSON.parse(value) as unknown;
    } catch {
      return [];
    }
  })
  .pipe(z.array(image).max(6, { error: "images_max" }));

export const productSchema = z.object({
  name,
  slug,
  description,
  categoryId,
  price,
  stock,
  cardColor,
  isActive: boolFromString("true"),
  isFeatured: boolFromString("false"),
  images,
});

export type ProductInput = z.infer<typeof productSchema>;
