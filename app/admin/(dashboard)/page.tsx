import { AdminDashboard } from "@/components/admin/sections/admin-dashboard";
import { getAdminDashboardData } from "@/actions/action-admin";

export const dynamic = "force-dynamic";

interface AdminDashboardPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {
  const params = await searchParams;
  const data = await getAdminDashboardData({
    dateFrom: typeof params.from === "string" ? params.from : undefined,
    dateTo: typeof params.to === "string" ? params.to : undefined,
  });

  return (
    <AdminDashboard
      totalProducts={data.totalProducts}
      activeProducts={data.activeProducts}
      categories={data.categories}
      totalOrders={data.totalOrders}
      revenue={data.revenue}
      unpaidCount={data.unpaidCount}
      unpaidAmount={data.unpaidAmount}
      lowStockProducts={data.lowStockProducts}
    />
  );
}