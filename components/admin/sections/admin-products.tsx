"use client";

import { useEffect, useState } from "react";
import {
  IoCreateOutline,
  IoAddOutline,
} from "react-icons/io5";
import Link from "next/link";
import { PageHeader } from "../ui/page-header";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { SearchInput } from "../ui/search-input";
import { FilterDropdown } from "../ui/filter-dropdown";
import { FilterChips } from "../ui/filter-chips";
import { ProductThumb } from "../ui/product-thumb";
import { Pagination } from "../ui/pagination";
import { Table, TBody, TD, TH, THead, TR } from "../ui/table";
import { ProductActiveToggle } from "../product-active-toggle";
import { ProductDeleteButton } from "../product-delete-button";
import { formatCurrency } from "@/lib/currency";
import { useTableQuery } from "../ui/use-table-query";
import { useDebouncedValue } from "../ui/use-debounced-value";

export interface AdminProductsCategory {
  id: number;
  name: string;
  badgeColor: string;
  count: number;
}

export interface AdminProductsItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  stock: number;
  cardColor: string | null;
  isActive: boolean;
  isFeatured: boolean;
  imageUrl: string | null;
  categoryId: number | null;
  categoryName: string | null;
  categoryBadgeColor: string | null;
  createdAt: string;
}

interface AdminProductsProps {
  products: AdminProductsItem[];
  categories: AdminProductsCategory[];
  totalCount: number;
  page: number;
  totalPages: number;
  search: string;
  categoryIds: number[];
}

const BADGE_TONES: Record<string, "blue" | "honey" | "pink" | "turquoise" | "coral"> = {
  blue: "blue",
  honey: "honey",
  pink: "pink",
  turquoise: "turquoise",
  coral: "coral",
};

const PAGE_SIZE = 10;

export function AdminProducts({
  products,
  categories,
  totalCount,
  page,
  totalPages,
  search,
  categoryIds,
}: AdminProductsProps) {
  const navigate = useTableQuery();
  const [searchInput, setSearchInput] = useState(search);
  const [prevSearch, setPrevSearch] = useState(search);
  const debouncedSearch = useDebouncedValue(searchInput, 300);

  if (prevSearch !== search) {
    setPrevSearch(search);
    setSearchInput(search);
  }

  useEffect(() => {
    if (debouncedSearch.trim().toLowerCase() !== search) {
      navigate({ q: debouncedSearch.trim() || null, page: "1" });
    }
  }, [debouncedSearch, search, navigate]);

  const handleCategoryChange = (ids: string[]) => {
    navigate({ category: ids.length ? ids.join(",") : null, page: "1" });
  };

  const handleRemoveCategory = (id: string) => {
    handleCategoryChange(categoryIds.filter((value) => String(value) !== id).map(String));
  };

  const selectedCategoryIds = categoryIds.map(String);
  const selectedCategoryChips = categories
    .filter((category) => categoryIds.includes(category.id))
    .map((category) => ({
      id: String(category.id),
      label: category.name,
      tone: BADGE_TONES[category.badgeColor] ?? "blue",
    }));

  const from = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, totalCount);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Productos"
        description="Gestiona el catálogo que se muestra en la tienda."
        actions={
          <Button size="sm" asChild>
            <Link href="/admin/products/new">
              <IoAddOutline className="h-4 w-4" aria-hidden="true" />
              Nuevo producto
            </Link>
          </Button>
        }
      />

      <div className="rounded-2xl border border-line bg-paper p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SearchInput
            placeholder="Buscar producto…"
            className="w-full sm:w-80"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
          />
          <FilterDropdown
            label="Categoría"
            selected={selectedCategoryIds}
            onChange={handleCategoryChange}
            options={categories.map((category) => ({
              id: String(category.id),
              label: category.name,
              tone: BADGE_TONES[category.badgeColor] ?? "blue",
              count: category.count,
            }))}
          />
        </div>
        {selectedCategoryIds.length > 0 && (
          <FilterChips
            items={selectedCategoryChips}
            onRemove={handleRemoveCategory}
            onClear={() => handleCategoryChange([])}
            className="mt-3"
          />
        )}
      </div>

      <Card>
        {products.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <p className="text-[14px] font-semibold text-ink">No hay productos</p>
            <p className="max-w-sm text-[12.5px] text-muted">
              {totalCount === 0
                ? "Crea el primer producto para publicarlo en la tienda."
                : "Ningún producto coincide con la búsqueda o el filtro actual."}
            </p>
            {totalCount === 0 ? (
              <Button size="sm" asChild>
                <Link href="/admin/products/new">
                  <IoAddOutline className="h-4 w-4" aria-hidden="true" />
                  Nuevo producto
                </Link>
              </Button>
            ) : null}
          </div>
        ) : (
          <Table>
            <THead>
              <tr>
                <TH>Producto</TH>
                <TH>Categoría</TH>
                <TH>Precio</TH>
                <TH>Stock</TH>
                <TH>Estado</TH>
                <TH className="text-right">Acciones</TH>
              </tr>
            </THead>
            <TBody>
              {products.map((product) => (
                <TR key={product.id}>
                  <TD>
                    <div className="flex items-center gap-3">
                      <ProductThumb
                        name={product.name}
                        cardColor={product.cardColor}
                        imageUrl={product.imageUrl}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-semibold text-ink">
                          {product.name}
                        </p>
                        <p className="truncate text-[11.5px] text-muted">
                          {product.isFeatured && (
                            <span className="font-semibold text-honey-deep">Destacado · </span>
                          )}
                          {product.slug}
                        </p>
                      </div>
                    </div>
                  </TD>
                  <TD>
                    {product.categoryName ? (
                      <Badge tone={BADGE_TONES[product.categoryBadgeColor ?? "blue"] ?? "blue"}>
                        {product.categoryName}
                      </Badge>
                    ) : (
                      <span className="text-[12px] text-muted">Sin categoría</span>
                    )}
                  </TD>
                  <TD className="font-semibold text-ink">{formatCurrency(product.price)}</TD>
                  <TD>
                    {product.stock === 0 ? (
                      <span className="text-[12.5px] font-semibold text-coral-deep">Agotado</span>
                    ) : (
                      <span className="text-[12.5px] text-muted">{product.stock} uds.</span>
                    )}
                  </TD>
                  <TD>
                    <ProductActiveToggle
                      id={product.id}
                      active={product.isActive}
                      name={product.name}
                    />
                  </TD>
                  <TD>
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        aria-label={`Editar ${product.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-[#e6f1fb] hover:text-blue-deep"
                      >
                        <IoCreateOutline className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <ProductDeleteButton id={product.id} name={product.name} />
                    </div>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}

        {totalCount > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalCount}
            from={from}
            to={to}
            itemLabel="productos"
            onPageChange={(nextPage) => navigate({ page: String(nextPage) })}
          />
        )}
      </Card>
    </div>
  );
}