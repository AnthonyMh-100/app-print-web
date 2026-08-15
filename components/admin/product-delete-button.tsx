"use client";

import { useState, useTransition } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/actions/action-products";
import { useToast } from "@/components/ui/toast";

interface ProductDeleteButtonProps {
  id: number;
  name: string;
}

export function ProductDeleteButton({ id, name }: ProductDeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { showToast } = useToast();

  const handleDelete = () => {
    const formData = new FormData();
    formData.set("id", String(id));

    startTransition(async () => {
      const result = await deleteProduct(formData);
      if (result.success) {
        showToast("success", `${name} eliminado correctamente`);
        router.refresh();
        setOpen(false);
      } else {
        showToast("error", "No se pudo eliminar el producto");
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
          aria-labelledby="delete-product-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
          onClick={() => !isPending && setOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-paper p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="delete-product-title" className="font-disp text-[17px] font-bold text-ink">
              Eliminar producto
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              ¿Seguro que deseas eliminar <strong className="text-ink">{name}</strong>? Se borrarán
              también sus imágenes. Esta acción no se puede deshacer.
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