import { Catalog } from "@/components/sections/catalog";
import { getLandingData } from "@/actions/action-landing";

export const dynamic = "force-dynamic";

interface CatalogPageProps {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const { products, categories } = await getLandingData();

  return (
    <Catalog
      key={params.categoria ?? "all"}
      products={products}
      categories={categories}
      initialCategorySlug={params.categoria}
    />
  );
}
