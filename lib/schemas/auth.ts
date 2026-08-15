import { z } from "zod";

const name = z
  .string({ error: "required" })
  .trim()
  .min(2, { error: "name_short" })
  .max(50, { error: "name_long" });

const usernameSchema = z
  .string({ error: "required" })
  .trim()
  .toLowerCase()
  .min(3, { error: "username_short" })
  .max(20, { error: "username_long" })
  .regex(/^[a-z0-9_]+$/, { error: "username_invalid" });

const email = z
  .string({ error: "required" })
  .trim()
  .toLowerCase()
  .email({ error: "email_invalid" });

const password = z
  .string({ error: "required" })
  .min(6, { error: "password_short" });

export const loginSchema = z.object({
  username: usernameSchema,
  password,
});

export const registerSchema = loginSchema.extend({
  name,
  email,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
