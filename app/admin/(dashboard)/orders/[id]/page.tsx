import { notFound } from "next/navigation";
import { getAdminOrderDetail } from "@/actions/action-admin";
import { AdminOrderDetail } from "@/components/admin/sections/admin-order-detail";

export const dynamic = "force-dynamic";

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { id } = await params;
  const order = await getAdminOrderDetail(id);

  if (!order) notFound();

  return <AdminOrderDetail order={order} />;
}
