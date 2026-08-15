import { AdminProducts } from "@/components/admin/sections/admin-products";
import { getAdminProducts } from "@/actions/action-admin";

export const dynamic = "force-dynamic";

interface AdminProductsPageProps {
  searchParams: Promise<{ page?: string; q?: string; category?: string }>;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const categoryIds = (params.category ?? "")
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isInteger(value) && value > 0);

  const data = await getAdminProducts({
    page,
    search: params.q ?? "",
    categoryIds: categoryIds.length ? categoryIds : undefined,
  });

  return <AdminProducts {...data} />;
}