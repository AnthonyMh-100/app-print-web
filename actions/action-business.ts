"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { hashPassword, verifyPassword } from "@/lib/password";
import prisma from "@/lib/prisma";
import { getBusiness, getPublicBusiness } from "@/lib/business";
import { businessSettingsSchema } from "@/lib/schemas/business";
import { validate } from "@/lib/validation";
import { translateMessage } from "@/constants/messages";

export type BusinessSettingsActionResult =
  | { success: false; errors: Record<string, string> }
  | { success: true };

export async function getPublicBusinessData() {
  return getPublicBusiness();
}

export async function updateBusinessSettings(
  _prevState: BusinessSettingsActionResult,
  formData: FormData,
): Promise<BusinessSettingsActionResult> {
  const session = await auth();
  if (session?.user?.kind !== "owner") {
    return {
      success: false,
      errors: { root: "No tienes permisos para esta acción" },
    };
  }

  const input = Object.fromEntries(formData);
  const result = validate(businessSettingsSchema, input);
  if (!result.success) return result;

  const business = await getBusiness();

  if (result.data.newPassword) {
    const currentPassword = result.data.currentPassword ?? "";

    if (
      !business.passwordHash ||
      !(await verifyPassword(currentPassword, business.passwordHash))
    ) {
      return {
        success: false,
        errors: { currentPassword: translateMessage("current_password_invalid") },
      };
    }
  }

  const data: {
    name: string;
    tagline: string | null;
    ownerName: string | null;
    email: string;
    phone: string | null;
    address: string | null;
    yapeNumber: string | null;
    yapeQrUrl: string | null;
    telegramUser: string | null;
    footerNote: string | null;
    passwordHash?: string;
  } = {
    name: result.data.name,
    tagline: result.data.tagline || null,
    ownerName: result.data.ownerName || null,
    email: result.data.email,
    phone: result.data.phone || null,
    address: result.data.address || null,
    yapeNumber: result.data.yapeNumber || null,
    yapeQrUrl: result.data.yapeQrUrl || null,
    telegramUser: result.data.telegramUser || null,
    footerNote: result.data.footerNote || null,
  };

  if (result.data.newPassword) {
    data.passwordHash = await hashPassword(result.data.newPassword);
  }

  await prisma.business.update({
    where: { id: 1 },
    data,
  });

  revalidatePath("/admin", "layout");
  revalidatePath("/", "layout");

  return { success: true };
}