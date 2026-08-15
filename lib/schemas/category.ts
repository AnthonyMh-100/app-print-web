import { z } from "zod";

export const categoryBadgeColors = ["blue", "honey", "pink", "turquoise", "coral"] as const;

export const categorySchema = z.object({
  name: z
    .string({ error: "required" })
    .trim()
    .min(2, { error: "name_short" })
    .max(40, { error: "name_long" }),
  slug: z.string().trim().toLowerCase().regex(/^[a-z0-9-]*$/, { error: "slug_invalid" }),
  description: z
    .string()
    .trim()
    .max(200, { error: "description_long" })
    .optional(),
  badgeColor: z.enum(categoryBadgeColors, { error: "badge_required" }),
});

export type CategoryInput = z.infer<typeof categorySchema>;