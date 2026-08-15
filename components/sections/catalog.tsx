"use client";

import { useMemo, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { CatalogCard } from "@/components/catalog/catalog-card";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";
import { FilterGroup } from "@/components/catalog/filter-group";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { amountInRange, priceRangesFor, SORT_OPTIONS } from "@/constants/catalog";
import type { CatalogProduct, CatalogPriceRangeId } from "@/interfaces/catalog";
import type { CatalogCategoryItem } from "@/constants/catalog";

interface CatalogProps {
  products: CatalogProduct[];
  categories: CatalogCategoryItem[];
  initialCategorySlug?: string;
}

const PAGE_SIZE = 6;

export function Catalog({ products, categories, initialCategorySlug }: CatalogProps) {
  const [search, setSearch] = useState("");
  const initialCategory = categories.find((category) => category.slug === initialCategorySlug);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [String(initialCategory.id)] : [],
  );
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<CatalogPriceRangeId[]>([]);
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);

  const priceOptions = useMemo(() => priceRangesFor(products), [products]);

  const toggleCategory = (id: string) => {
    setPage(1);
    setSelectedCategories((current) =>
      current.includes(id)
        ? current.filter((categoryId) => categoryId !== id)
        : [...current, id],
    );
  };

  const togglePriceRange = (id: string) => {
    setPage(1);
    setSelectedPriceRanges((current) =>
      current.includes(id as CatalogPriceRangeId)
        ? current.filter((rangeId) => rangeId !== id)
        : [...current, id as CatalogPriceRangeId],
    );
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setSelectedPriceRanges([]);
    setSort("default");
    setPage(1);
  };

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    let result = products.filter((product) => {
      const matchesTerm =
        term === "" ||
        product.name.toLowerCase().includes(term) ||
        product.slug.includes(term);
      const matchesCategory =
        selectedCategories.length === 0 ||
        (product.category !== null &&
          selectedCategories.includes(String(product.category.id)));
      const matchesPrice =
        selectedPriceRanges.length === 0 ||
        selectedPriceRanges.some((rangeId) => amountInRange(product.price, rangeId));
      return matchesTerm && matchesCategory && matchesPrice;
    });

    switch (sort) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name, "es"));
        break;
      default:
        break;
    }

    return result;
  }, [products, search, selectedCategories, selectedPriceRanges, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const from = filteredProducts.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const to = Math.min(currentPage * PAGE_SIZE, filteredProducts.length);

  const categoryOptions = categories.map((category) => ({
    id: String(category.id),
    label: category.name,
    count: category.count,
  }));

  return (
    <section id="catalog" className="relative overflow-hidden bg-paper py-19">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-100 w-100 rounded-full bg-blue/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-105 w-105 rounded-full bg-pink/10 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 h-40 w-40 rounded-full bg-honey/15 blur-2xl" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(27,95,168,0.14) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <Container className="relative">
        <Reveal className="section-head">
          <h2>Nuestro catálogo</h2>
          <p>
            Elige tu producto, personaliza el color o la variante y arma tu
            pedido — todo desde aquí.
          </p>
        </Reveal>

        <div className="catalog-layout">
          <Reveal className="catalog-sidebar">
            <FilterGroup
              title="Categoría"
              options={categoryOptions}
              selectedIds={selectedCategories}
              onToggle={toggleCategory}
            />
            <FilterGroup
              title="Precio"
              options={priceOptions}
              selectedIds={selectedPriceRanges}
              onToggle={togglePriceRange}
            />
            <button type="button" className="btn btn-outline btn-sm btn-block" onClick={clearFilters}>
              Limpiar filtros
            </button>
          </Reveal>

          <div className="catalog-main">
            <Reveal className="catalog-toolbar">
              <div className="search-box w-full">
                <IoSearchOutline aria-hidden="true" />
                <input
                  type="text"
                  className="flex flex-1"
                  placeholder="Buscar producto..."
                  aria-label="Buscar producto"
                  value={search}
                  onChange={(event) => {
                    setPage(1);
                    setSearch(event.target.value);
                  }}
                />
              </div>
            </Reveal>

            <Reveal className="w-full flex flex-row-reverse justify-between items-center mb-4">
              <select
                className="sort-select"
                value={sort}
                onChange={(event) => {
                  setPage(1);
                  setSort(event.target.value);
                }}
                aria-label="Ordenar por"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="results-count">
                Mostrando <strong>{from}–{to}</strong> de{" "}
                <strong>{filteredProducts.length}</strong> productos
              </p>
            </Reveal>

            {visibleProducts.length === 0 ? (
              <div className="rounded-2xl border border-line bg-paper px-6 py-14 text-center">
                <p className="text-[16px] font-semibold text-ink">
                  No hay productos que coincidan
                </p>
                <p className="mt-1 text-[13px] text-muted">
                  Prueba con otra búsqueda o limpia los filtros.
                </p>
                <button type="button" className="btn btn-outline btn-sm mt-5" onClick={clearFilters}>
                  Limpiar filtros
                </button>
              </div>
            ) : (
              <div className="grid-products">
                {visibleProducts.map((product) => (
                  <CatalogCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <CatalogPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}