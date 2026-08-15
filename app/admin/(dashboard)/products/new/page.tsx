import { IoAlbumsOutline } from "react-icons/io5";
import Link from "next/link";
import { PageHeader } from "@/components/admin/ui/page-header";
import { Button } from "@/components/admin/ui/button";
import { Card } from "@/components/admin/ui/card";
import { AdminProductForm } from "@/components/admin/sections/admin-product-form";
import { getCategoriesForForm } from "@/actions/action-admin";

export default async function AdminProductNewPage() {
  const categories = await getCategoriesForForm();

  if (!categories.length) {
    return (
      <div className="space-y-5">
        <PageHeader
          title="Nuevo producto"
          description="Completa la información del producto para publicarlo en la tienda."
        />
        <Card className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-12 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e6f1fb] text-blue-deep">
            <IoAlbumsOutline className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-disp text-[17px] font-semibold text-ink">
              Todavía no hay categorías
            </h3>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">
              Para crear un producto necesitas al menos una categoría. Crea la
              primera para continuar.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/categories/new">Crear categoría</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return <AdminProductForm mode="create" categories={categories} />;
}
