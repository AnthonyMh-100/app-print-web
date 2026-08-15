import { AdminOrders } from "@/components/admin/sections/admin-orders";
import { getAdminOrders } from "@/actions/action-admin";

export const dynamic = "force-dynamic";

interface AdminOrdersPageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    status?: string;
    payment?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const statuses = (params.status ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  const payments = (params.payment ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const data = await getAdminOrders({
    page,
    search: params.q ?? "",
    statuses: statuses.length ? statuses : undefined,
    payments: payments.length ? payments : undefined,
    dateFrom: params.from,
    dateTo: params.to,
  });

  return <AdminOrders {...data} />;
}