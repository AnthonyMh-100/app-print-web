"use client";

import { useState, useTransition } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { deleteCategory } from "@/actions/action-categories";
import { translateMessage } from "@/constants/messages";
import { useToast } from "@/components/ui/toast";

interface CategoryDeleteButtonProps {
  id: number;
  name: string;
  hasProducts: boolean;
}

export function CategoryDeleteButton({ id, name, hasProducts }: CategoryDeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { showToast } = useToast();

  const handleDelete = () => {
    if (hasProducts) {
      showToast("error", translateMessage("category_has_products"));
      return;
    }

    const formData = new FormData();
    formData.set("id", String(id));

    startTransition(async () => {
      const result = await deleteCategory(formData);
      if (result.success) {
        showToast("success", `${name} eliminada correctamente`);
        router.refresh();
        setOpen(false);
      } else {
        showToast("error", translateMessage(result.error));
      }
    });
  };

  return (
    <>
      <button
        type="button"
        aria-label={`Eliminar ${name}`}
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-coral/10 hover:text-coral-deep"
      >
        <IoTrashOutline className="h-4 w-4" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-category-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          onClick={() => !isPending && setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-paper p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="delete-category-title" className="font-disp text-[17px] font-bold text-ink">
              Eliminar categoría
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              ¿Seguro que deseas eliminar <strong className="text-ink">{name}</strong>? Esta acción
              no se puede deshacer.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-2 text-[13px] font-semibold text-muted transition-colors hover:bg-canvas hover:text-ink"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-coral px-5 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-coral-deep disabled:opacity-60"
              >
                {isPending ? "Eliminando…" : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}