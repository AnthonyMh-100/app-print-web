import { AdminProductForm } from "@/components/admin/sections/admin-product-form";
import { getCategoriesForForm, getProductForEdit } from "@/actions/action-admin";

export const dynamic = "force-dynamic";

interface AdminProductEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminProductEditPage({ params }: AdminProductEditPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getProductForEdit(id),
    getCategoriesForForm(),
  ]);

  return (
    <AdminProductForm
      mode="edit"
      categories={categories}
      product={product}
    />
  );
}
