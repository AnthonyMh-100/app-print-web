import type {
  CatalogFilterOption,
  CatalogPriceRangeId,
  CatalogProduct,
  SortOption,
} from "@/interfaces/catalog";

export interface CatalogCategoryItem {
  id: number;
  name: string;
  slug: string;
  badgeColor: string | null;
  count: number;
}

export interface CatalogCategoryBadge {
  badgeBg: string;
  badgeText: string;
}

const BADGE_COLORS: Record<string, CatalogCategoryBadge> = {
  blue: { badgeBg: "#e6f1fb", badgeText: "#0c447c" },
  honey: { badgeBg: "#fff3dd", badgeText: "#854f0b" },
  pink: { badgeBg: "#fde5ee", badgeText: "#8f1f4d" },
  turquoise: { badgeBg: "#ddf6f3", badgeText: "#0b6e63" },
  coral: { badgeBg: "#ffedea", badgeText: "#c8432c" },
};

export const categoryBadgeFor = (badgeColor: string | null): CatalogCategoryBadge =>
  BADGE_COLORS[badgeColor ?? "blue"] ?? BADGE_COLORS.blue;

export function amountInRange(price: number, rangeId: CatalogPriceRangeId): boolean {
  switch (rangeId) {
    case "r1":
      return price <= 15;
    case "r2":
      return price > 15 && price <= 30;
    case "r3":
      return price > 30 && price <= 50;
    case "r4":
      return price > 50;
  }
}

export function priceRangesFor(
  products: Pick<CatalogProduct, "price">[],
): CatalogFilterOption[] {
  const ranges: Array<{ id: CatalogPriceRangeId; label: string }> = [
    { id: "r1", label: "Hasta S/ 15" },
    { id: "r2", label: "S/ 15 – S/ 30" },
    { id: "r3", label: "S/ 30 – S/ 50" },
    { id: "r4", label: "Más de S/ 50" },
  ];

  return ranges.map(({ id, label }) => ({
    id,
    label,
    count: products.filter((product) => amountInRange(product.price, id)).length,
  }));
}

export const SORT_OPTIONS: SortOption[] = [
  { value: "default", label: "Ordenar: recomendados" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name-asc", label: "Nombre A-Z" },
];