import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getBusiness } from "@/lib/business";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session?.user?.kind !== "owner") redirect("/admin/login");

  const business = await getBusiness();

  return (
    <AdminShell
      business={{
        name: business.name,
        ownerName: business.ownerName,
        email: business.email,
      }}
    >
      {children}
    </AdminShell>
  );
}