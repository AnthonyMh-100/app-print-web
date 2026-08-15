"use client";

import { useEffect, useRef, useState } from "react";
import { useActionState } from "react";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";
import { PageHeader } from "../ui/page-header";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Field, Input, Select, Textarea } from "../ui/field";
import { Switch } from "../ui/switch";
import { ProductImageUploader } from "../product-image-uploader";
import { createProduct, updateProduct } from "@/actions/action-products";
import { useToast } from "@/components/ui/toast";
import { slugify } from "@/lib/slug";
import { formatCurrency } from "@/lib/currency";

interface AdminProductFormProps {
  mode: "create" | "edit";
  categories: { id: number; name: string }[];
  product?: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    stock: number;
    cardColor: string | null;
    categoryId: number;
    isActive: boolean;
    isFeatured: boolean;
    images: {
      id: number;
      publicId: string;
      url: string;
      format: string | null;
    }[];
  };
}

const initialState = { success: false as const, errors: {} as Record<string, string> };

export function AdminProductForm({ mode, categories, product }: AdminProductFormProps) {
  const action = mode === "edit" ? updateProduct : createProduct;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const router = useRouter();
  const { showToast } = useToast();

  const [values, setValues] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    categoryId: product ? String(product.categoryId) : "",
    cardColor: product?.cardColor ?? "#e6f1fb",
    price: product ? String(product.price) : "",
    stock: product ? String(product.stock) : "",
  });
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [slugTouched, setSlugTouched] = useState(false);
  const handledSuccessRef = useRef(false);

  useEffect(() => {
    if (state.success && !handledSuccessRef.current) {
      handledSuccessRef.current = true;
      showToast(
        "success",
        mode === "edit" ? "Producto actualizado correctamente" : "Producto creado correctamente",
      );
      router.push("/admin/products");
      router.refresh();
    }
  }, [state.success, mode, router, showToast]);

  const setField =
    (key: keyof typeof values) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValues((current) => ({ ...current, [key]: event.target.value }));
    };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setValues((current) => ({
      ...current,
      name,
      slug: slugTouched ? current.slug : slugify(name),
    }));
  };

  const fieldErrors = state.success ? [] : Object.entries(state.errors);
  const selectedCategory = categories.find(
    (category) => category.id === Number(values.categoryId),
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title={mode === "edit" ? "Editar producto" : "Nuevo producto"}
        description={
          mode === "edit"
            ? "Actualiza la información del producto."
            : "Completa la información del producto para publicarlo en la tienda."
        }
        actions={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/products">
              <IoArrowBackOutline className="h-4 w-4" aria-hidden="true" />
              Volver a productos
            </Link>
          </Button>
        }
      />

      {fieldErrors.length > 0 && (
        <div className="rounded-xl border border-coral/20 bg-coral/5 px-4 py-3">
          <ul className="list-inside list-disc space-y-0.5 text-[12.5px] text-coral-deep">
            {fieldErrors.map(([key, message]) => (
              <li key={key}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      <form action={formAction}>
        {mode === "edit" && <input type="hidden" name="id" value={product?.id} />}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.7fr_1fr]">
          <div className="space-y-6">
            <Card className="p-5">
              <h3 className="mb-4 font-disp text-[16px] font-semibold text-ink">
                Información básica
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field id="product-name" label="Nombre del producto" className="sm:col-span-2">
                  <Input
                    id="product-name"
                    name="name"
                    required
                    value={values.name}
                    onChange={handleNameChange}
                    placeholder="Ej. Taza personalizada"
                  />
                </Field>
                <Field
                  id="product-slug"
                  label="Slug (URL)"
                  hint="Se genera automáticamente desde el nombre."
                  className="sm:col-span-2"
                >
                  <Input
                    id="product-slug"
                    name="slug"
                    value={values.slug}
                    onChange={(event) => {
                      setSlugTouched(true);
                      setField("slug")(event);
                    }}
                    placeholder="taza-personalizada"
                  />
                </Field>
                <Field id="product-desc" label="Descripción" className="sm:col-span-2">
                  <Textarea
                    id="product-desc"
                    name="description"
                    value={values.description}
                    onChange={setField("description")}
                    placeholder="Breve descripción que se muestra en la tarjeta del producto. Opcional."
                  />
                </Field>
                <Field id="product-category" label="Categoría">
                  <Select
                    id="product-category"
                    name="categoryId"
                    required
                    value={values.categoryId}
                    onChange={setField("categoryId")}
                  >
                    <option value="" disabled>
                      Selecciona una categoría
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field id="product-card" label="Color de la tarjeta">
                  <Input
                    id="product-card"
                    name="cardColor"
                    type="color"
                    value={values.cardColor}
                    onChange={setField("cardColor")}
                    className="h-11 cursor-pointer p-1"
                  />
                </Field>
                <Field id="product-price" label="Precio (S/)">
                  <Input
                    id="product-price"
                    name="price"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    required
                    value={values.price}
                    onChange={setField("price")}
                    placeholder="0.00"
                  />
                </Field>
                <Field id="product-stock" label="Stock (unidades)">
                  <Input
                    id="product-stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={values.stock}
                    onChange={setField("stock")}
                    placeholder="0"
                  />
                </Field>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="mb-4 font-disp text-[16px] font-semibold text-ink">
                Visibilidad en tienda
              </h3>
              <ul className="divide-y divide-line">
                <li className="flex items-center justify-between gap-4 py-3.5">
                  <div>
                    <p className="text-[13.5px] font-semibold text-ink">Producto activo</p>
                    <p className="text-[12px] text-muted">
                      Visible en el catálogo público de la landing.
                    </p>
                  </div>
                  <Switch
                    checked={isActive}
                    label="Producto activo"
                    onClick={() => setIsActive((current) => !current)}
                  />
                </li>
                <li className="flex items-center justify-between gap-4 py-3.5">
                  <div>
                    <p className="text-[13.5px] font-semibold text-ink">Destacado</p>
                    <p className="text-[12px] text-muted">
                      Se muestra con prioridad en la tienda.
                    </p>
                  </div>
                  <Switch
                    checked={isFeatured}
                    label="Destacado"
                    onClick={() => setIsFeatured((current) => !current)}
                  />
                </li>
              </ul>
              <input type="hidden" name="isActive" value={isActive ? "true" : "false"} />
              <input type="hidden" name="isFeatured" value={isFeatured ? "true" : "false"} />
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-5">
              <h3 className="mb-4 font-disp text-[16px] font-semibold text-ink">
                Imágenes del producto
              </h3>
              <p className="mb-4 text-[12px] text-muted">
                Opcional. Sube una o varias imágenes; la primera se usa como principal.
              </p>
              <ProductImageUploader initialImages={product?.images} />
            </Card>

            <Card className="p-5">
              <h3 className="mb-3 font-disp text-[16px] font-semibold text-ink">Resumen</h3>
              <dl className="space-y-2.5 text-[13px]">
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Categoría</dt>
                  <dd className="font-semibold text-ink">
                    {selectedCategory?.name ?? "—"}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Precio</dt>
                  <dd className="font-semibold text-ink">
                    {values.price === "" ? "—" : formatCurrency(Number(values.price))}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Stock</dt>
                  <dd className="font-semibold text-ink">
                    {values.stock === "" ? "—" : `${values.stock} uds.`}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-line pt-2.5">
                  <dt className="text-muted">Estado</dt>
                  <dd className="font-semibold text-blue-deep">
                    {isActive ? "Activo" : "Inactivo"}
                  </dd>
                </div>
              </dl>
            </Card>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
          <Button variant="ghost" size="md" asChild>
            <Link href="/admin/products">Cancelar</Link>
          </Button>
          <Button type="submit" size="md" disabled={isPending}>
            {isPending
              ? mode === "edit"
                ? "Guardando…"
                : "Guardando…"
              : mode === "edit"
                ? "Guardar cambios"
                : "Guardar producto"}
          </Button>
        </div>
      </form>
    </div>
  );
}
