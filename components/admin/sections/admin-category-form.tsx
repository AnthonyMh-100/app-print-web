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
import { Field, Input, Textarea } from "../ui/field";
import { createCategory, updateCategory } from "@/actions/action-categories";
import type { CategoryActionResult } from "@/actions/action-categories";
import { CATEGORY_BADGE_OPTIONS } from "@/constants/admin";
import { useToast } from "@/components/ui/toast";
import { slugify } from "@/lib/slug";
import { cn } from "@/utils/cn";

interface AdminCategoryFormProps {
  mode: "create" | "edit";
  category?: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    badgeColor: string | null;
  };
}

const initialState: CategoryActionResult = { success: false, errors: {} };

export function AdminCategoryForm({ mode, category }: AdminCategoryFormProps) {
  const action = mode === "edit" ? updateCategory : createCategory;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const router = useRouter();
  const { showToast } = useToast();

  const [values, setValues] = useState({
    name: category?.name ?? "",
    slug: category?.slug ?? "",
    description: category?.description ?? "",
  });
  const [badgeColor, setBadgeColor] = useState(category?.badgeColor ?? "blue");
  const [slugTouched, setSlugTouched] = useState(false);
  const handledSuccessRef = useRef(false);

  useEffect(() => {
    if (state.success && !handledSuccessRef.current) {
      handledSuccessRef.current = true;
      showToast(
        "success",
        mode === "edit" ? "Categoría actualizada correctamente" : "Categoría creada correctamente",
      );
      router.push("/admin/categories");
      router.refresh();
    }
  }, [state.success, mode, router, showToast]);

  const setField =
    (key: keyof typeof values) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
  const backHref = "/admin/categories";

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader
        title={mode === "edit" ? "Editar categoría" : "Nueva categoría"}
        description={
          mode === "edit"
            ? "Actualiza la información de la categoría."
            : "Crea una agrupación para tus productos de la tienda."
        }
        actions={
          <Button variant="ghost" size="sm" asChild>
            <Link href={backHref}>
              <IoArrowBackOutline className="h-4 w-4" aria-hidden="true" />
              Volver a categorías
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
        {mode === "edit" && (
          <input type="hidden" name="id" value={category?.id} />
        )}

        <Card className="p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id="category-name" label="Nombre de la categoría">
              <Input
                id="category-name"
                name="name"
                required
                value={values.name}
                onChange={handleNameChange}
                placeholder="Ej. Tazas personalizadas"
              />
            </Field>
            <Field
              id="category-slug"
              label="Slug (URL)"
              hint="Se genera automáticamente desde el nombre."
            >
              <Input
                id="category-slug"
                name="slug"
                value={values.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setField("slug")(event);
                }}
                placeholder="tazas-personalizadas"
              />
            </Field>
            <Field id="category-desc" label="Descripción" className="sm:col-span-2">
              <Textarea
                id="category-desc"
                name="description"
                value={values.description}
                onChange={setField("description")}
                placeholder="Describe brevemente qué productos agrupa."
              />
            </Field>

            <fieldset className="sm:col-span-2">
              <legend className="mb-1.5 text-[12.5px] font-semibold text-ink">
                Color del badge
              </legend>
              <div className="flex items-center gap-2.5">
                {CATEGORY_BADGE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-label={`Color ${option.label}`}
                    aria-pressed={badgeColor === option.id}
                    onClick={() => setBadgeColor(option.id)}
                    className={cn(
                      "h-8 w-8 rounded-full transition-transform hover:scale-110",
                      option.swatchClass,
                      badgeColor === option.id
                        ? "scale-110 ring-2 ring-blue ring-offset-2"
                        : "",
                    )}
                  />
                ))}
              </div>
            </fieldset>
          </div>
        </Card>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-2">
          <Button variant="ghost" asChild>
            <Link href={backHref}>Cancelar</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? mode === "edit"
                ? "Guardando…"
                : "Creando…"
              : mode === "edit"
                ? "Guardar cambios"
                : "Crear categoría"}
          </Button>
        </div>

        <input type="hidden" name="badgeColor" value={badgeColor} />
      </form>
    </div>
  );
}