export interface CartItem {
  productId: number;
  slug: string;
  name: string;
  price: number;
  cardColor: string | null;
  imageUrl: string | null;
  categoryName: string | null;
  quantity: number;
}

export interface CartSummary {
  count: number;
  total: number;
}
