import { AdminCategories } from "@/components/admin/sections/admin-categories";
import { getAdminCategories } from "@/actions/action-admin";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const { categories } = await getAdminCategories();

  return <AdminCategories categories={categories} />;
}
