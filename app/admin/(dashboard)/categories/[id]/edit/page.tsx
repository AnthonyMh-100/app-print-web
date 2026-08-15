import { AdminCategoryForm } from "@/components/admin/sections/admin-category-form";
import { getCategoryForEdit } from "@/actions/action-admin";

export const dynamic = "force-dynamic";

interface AdminCategoryEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCategoryEditPage({ params }: AdminCategoryEditPageProps) {
  const { id } = await params;

  const category = await getCategoryForEdit(id);

  return <AdminCategoryForm mode="edit" category={category} />;
}
