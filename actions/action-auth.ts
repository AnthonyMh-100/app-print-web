"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { unstable_rethrow } from "next/navigation";
import { translateMessage } from "@/constants/messages";
import { hashPassword } from "@/lib/password";
import prisma from "@/lib/prisma";
import { loginSchema, registerSchema } from "@/lib/schemas";
import type { LoginInput, RegisterInput } from "@/lib/schemas";
import { validate } from "@/lib/validation";

type LoginActionResult =
  | { success: false; errors: Record<string, string> }
  | { success: true; data: Omit<LoginInput, "password"> };

type RegisterActionResult =
  | { success: false; errors: Record<string, string> }
  | { success: true; data: Omit<RegisterInput, "password"> };

type OwnerLoginActionResult =
  | { success: false; errors: Record<string, string> }
  | { success: true };

export async function ownerLoginWithCredentials(
  _prevState: OwnerLoginActionResult,
  formData: FormData,
): Promise<OwnerLoginActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      success: false,
      errors: { root: translateMessage("invalid_credentials") },
    };
  }

  try {
    await signIn("credentials", {
      username: email,
      password,
      kind: "owner",
      redirect: false,
    });
  } catch (error) {
    unstable_rethrow(error);

    if (error instanceof AuthError) {
      return {
        success: false,
        errors: { root: translateMessage("invalid_credentials") },
      };
    }
    throw error;
  }

  return {
    success: true,
  };
}

export async function loginWithCredentials(
  _prevState: LoginActionResult,
  formData: FormData,
): Promise<LoginActionResult> {
  const input = Object.fromEntries(formData);
  const result = validate(loginSchema, input);
  if (!result.success) return result;

  const { username, password } = result.data;

  try {
    await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
  } catch (error) {
    unstable_rethrow(error);

    if (error instanceof AuthError) {
      return {
        success: false,
        errors: { root: translateMessage("invalid_credentials") },
      };
    }
    throw error;
  }

  return {
    success: true,
    data: { username },
  };
}

export async function registerWithCredentials(
  _prevState: RegisterActionResult,
  formData: FormData,
): Promise<RegisterActionResult> {
  const input = Object.fromEntries(formData);
  const result = validate(registerSchema, input);
  if (!result.success) return result;

  const { name, username, email, password } = result.data;

  const usernameTaken = await prisma.user.findUnique({
    where: { username },
  });
  if (usernameTaken) {
    return {
      success: false,
      errors: { username: translateMessage("username_exists") },
    };
  }

  const emailTaken = await prisma.user.findUnique({
    where: { email },
  });
  if (emailTaken) {
    return {
      success: false,
      errors: { email: translateMessage("email_exists") },
    };
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.create({
    data: {
      name,
      username,
      email,
      password: hashedPassword,
      provider: "credentials",
    },
  });

  return {
    success: true,
    data: { name, username, email },
  };
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/" });
}

export async function logoutUser() {
  await signOut({ redirect: false });
}
