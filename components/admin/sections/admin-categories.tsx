"use client";

import { useMemo, useState } from "react";
import {
  IoAddOutline,
  IoCreateOutline,
} from "react-icons/io5";
import Link from "next/link";
import { BADGE_COLOR_DOTS } from "@/constants/admin";
import { PageHeader } from "../ui/page-header";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { SearchInput } from "../ui/search-input";
import { Pagination } from "../ui/pagination";
import { CategoryDeleteButton } from "../category-delete-button";

export interface AdminCategoriesItem {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  badgeColor: string | null;
  productsCount: number;
  createdAt: string;
}

interface AdminCategoriesProps {
  categories: AdminCategoriesItem[];
}

const PAGE_SIZE = 12;

export function AdminCategories({ categories }: AdminCategoriesProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (term === "") return categories;
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(term) ||
        category.slug.toLowerCase().includes(term),
    );
  }, [categories, search]);

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageCategories = filteredCategories.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const from = filteredCategories.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, filteredCategories.length);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Categorías"
        description="Agrupa tus productos por categorías que se muestran en la landing."
        actions={
          <Button size="sm" asChild>
            <Link href="/admin/categories/new">
              <IoAddOutline className="h-4 w-4" aria-hidden="true" />
              Nueva categoría
            </Link>
          </Button>
        }
      />

      <SearchInput
        placeholder="Buscar categoría…"
        className="w-full sm:w-72"
        value={search}
        onChange={(event) => {
          setPage(1);
          setSearch(event.target.value);
        }}
      />

      {filteredCategories.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 px-6 py-12 text-center">
          <p className="text-[14px] font-semibold text-ink">Aún no hay categorías</p>
          <p className="max-w-sm text-[12.5px] text-muted">
            {categories.length === 0
              ? "Crea la primera categoría para comenzar a agrupar tus productos."
              : "Ninguna categoría coincide con la búsqueda actual."}
          </p>
          {categories.length === 0 && (
            <Button size="sm" asChild>
              <Link href="/admin/categories/new">
                <IoAddOutline className="h-4 w-4" aria-hidden="true" />
                Crear categoría
              </Link>
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pageCategories.map((category) => {
            const badgeColor = category.badgeColor ?? "blue";
            return (
              <Card key={category.id} className="flex flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[14px] font-bold text-white ${
                      BADGE_COLOR_DOTS[badgeColor] ?? BADGE_COLOR_DOTS.blue
                    }`}
                    aria-hidden="true"
                  >
                    {category.name.slice(0, 1)}
                  </span>
                  <div className="flex items-center gap-0.5">
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      aria-label={`Editar ${category.name}`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-[#e6f1fb] hover:text-blue-deep"
                    >
                      <IoCreateOutline className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <CategoryDeleteButton
                      id={category.id}
                      name={category.name}
                      hasProducts={category.productsCount > 0}
                    />
                  </div>
                </div>

                <h3 className="mt-2.5 font-disp text-[15px] font-semibold leading-tight text-ink">
                  {category.name}
                </h3>
                <p className="text-[11px] text-muted">/{category.slug}</p>
                <p className="mt-1.5 line-clamp-2 text-[12.5px] leading-relaxed text-muted">
                  {category.description || "Sin descripción."}
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                  <Badge tone={badgeColor as "blue" | "honey" | "pink" | "turquoise" | "coral"} dot>
                    {category.productsCount} productos
                  </Badge>
                  <span className="text-[11px] text-muted">{category.createdAt}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {filteredCategories.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredCategories.length}
          from={from}
          to={to}
          itemLabel="categorías"
          onPageChange={setPage}
          bordered={false}
        />
      )}
    </div>
  );
}