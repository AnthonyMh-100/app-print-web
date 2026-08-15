"use client";

import { useMemo, useState } from "react";
import { IoBagHandleOutline, IoEyeOutline } from "react-icons/io5";
import { categoryBadgeFor } from "@/constants/catalog";
import { formatCurrency } from "@/lib/currency";
import { useCartStore } from "@/lib/cart-store";
import { useToast } from "@/components/ui/toast";
import { QuantityControl } from "@/components/ui/quantity-control";
import { ProductLightbox } from "@/components/catalog/product-lightbox";
import type { CatalogProduct } from "@/interfaces/catalog";

interface CatalogCardProps {
  product: CatalogProduct;
}

export function CatalogCard({ product }: CatalogCardProps) {
  const badge = categoryBadgeFor(product.category?.badgeColor ?? null);
  const [quantity, setQuantity] = useState(1);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const { showToast } = useToast();

  const outOfStock = useMemo(() => product?.stock <= 0, [product.stock]);

  const hasImages = useMemo(
    () => product.images.length > 0,
    [product.images],
  );

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        cardColor: product.cardColor,
        imageUrl: product.imageUrl,
        categoryName: product.category?.name ?? null,
      },
      quantity,
    );
    setQuantity(1);
    showToast("success", `${product.name} agregado al carrito`);
    openCart();
  };

  return (
    <article className="p-card" aria-label={`Personalizar ${product.name}`}>
      <div
        className="p-media"
        style={{
          background: `linear-gradient(160deg, ${product.cardColor ?? "#e6f1fb"} 0%, #ffffff 130%)`,
        }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-disp text-[28px] font-bold text-blue-deep">
            {product.name.slice(0, 1)}
          </span>
        )}
        {product.category && (
          <span
            className="p-media-badge"
            style={{ background: badge.badgeBg, color: badge.badgeText }}
          >
            {product.category.name}
          </span>
        )}
        {outOfStock && <span className="p-stock-flag">Agotado</span>}
        <button
          className="p-quickview"
          type="button"
          aria-label={`Ver imágenes de ${product.name}`}
          onClick={() => setLightboxOpen(true)}
          disabled={!hasImages}
        >
          <IoEyeOutline aria-hidden="true" />
        </button>
      </div>
      <div className="p-body">
        <div className="p-name">{product.name}</div>
        <div className="p-desc">
          {product.description ?? "Producto personalizable."}
        </div>
        <div className="p-variants">
          {product.isFeatured && (
            <span className="p-variants-text">Destacado en tienda</span>
          )}
        </div>
        <div className="text-[12px] text-right font-medium">
          {outOfStock ? "Sin stock" : `Stock : ${product?.stock} unidades`}
        </div>
        <div className="p-divider"></div>
        <div className="p-cta-row">
          <div className="p-price">
            {formatCurrency(product.price)}
            <span>desde, c/u</span>
          </div>
          {!outOfStock && (
            <QuantityControl quantity={quantity} onChange={setQuantity} />
          )}
        </div>
        <button
          className="p-cta"
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock}
        >
          <IoBagHandleOutline aria-hidden="true" />
          {outOfStock ? "Sin stock" : "Agregar al carrito"}
        </button>
      </div>

      {lightboxOpen && (
        <ProductLightbox
          product={product}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </article>
  );
}
