import type { ZodType } from "zod";
import { translateMessage } from "@/constants/messages";

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> };

export function validate<T>(
  schema: ZodType<T>,
  input: unknown,
): ValidationResult<T> {
  const result = schema.safeParse(input);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const { issues } = result.error;
  const errors: Record<string, string> = {};
  for (const { path, message } of issues) {
    const field = path.join(".") || "root";
    if (!(field in errors)) {
      errors[field] = translateMessage(message);
    }
  }

  return { success: false, errors };
}
