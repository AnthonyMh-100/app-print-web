import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { bootstrapBusiness } from "@/lib/business";
import { AdminLoginForm } from "@/components/auth/admin-login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await auth();

  if (session?.user?.kind === "owner") redirect("/admin");

  const { created } = await bootstrapBusiness();

  return <AdminLoginForm showDefaultHint={created} />;
}