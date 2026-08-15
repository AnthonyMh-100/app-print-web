export interface CatalogProduct {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  cardColor: string | null;
  imageUrl: string | null;
  images: string[];
  isFeatured: boolean;
  stock: number;
  category: {
    id: number;
    name: string;
    badgeColor: string | null;
  } | null;
}

export interface CatalogFilterOption {
  id: string;
  label: string;
  count: number;
}

export interface SortOption {
  value: string;
  label: string;
}

export const CATALOG_PRICE_RANGE_IDS = ["r1", "r2", "r3", "r4"] as const;
export type CatalogPriceRangeId = (typeof CATALOG_PRICE_RANGE_IDS)[number];
