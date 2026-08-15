import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string({ error: "required" })
    .trim()
    .max(max, { error: "field_too_long" });

export const businessSettingsSchema = z.object({
  name: z
    .string({ error: "required" })
    .trim()
    .min(2, { error: "name_short" })
    .max(50, { error: "name_long" }),
  tagline: optionalText(200),
  ownerName: optionalText(50),
  email: z
    .string({ error: "required" })
    .trim()
    .toLowerCase()
    .email({ error: "email_invalid" }),
  phone: optionalText(30),
  address: optionalText(200),
  footerNote: optionalText(300),
  telegramUser: optionalText(50),
  yapeNumber: optionalText(30),
  yapeQrUrl: optionalText(300),
  currentPassword: z.string({ error: "required" }).optional(),
  newPassword: z
    .string({ error: "required" })
    .min(6, { error: "password_short" })
    .optional()
    .or(z.literal("")),
});

export type BusinessSettingsInput = z.infer<typeof businessSettingsSchema>;