"use client";

import { useRef, useState } from "react";
import {
  IoCloudUploadOutline,
  IoCloseOutline,
  IoStarOutline,
} from "react-icons/io5";
import { cn } from "@/utils/cn";

interface UploadedImage {
  publicId: string;
  url: string;
  format: string | null;
  existingId?: number;
}

export interface ProductImageUploaderInitial {
  id: number;
  publicId: string;
  url: string;
  format: string | null;
}

interface ProductImageUploaderProps {
  initialImages?: ProductImageUploaderInitial[];
}

const MAX_IMAGES = 6;

export function ProductImageUploader({
  initialImages = [],
}: ProductImageUploaderProps) {
  const [images, setImages] = useState<UploadedImage[]>(
    initialImages.map((image) => ({
      publicId: image.publicId,
      url: image.url,
      format: image.format,
      existingId: image.id,
    })),
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);
    setError(null);
    setUploading(true);

    const uploaded: UploadedImage[] = [];
    try {
      for (const file of files) {
        if (uploaded.length >= MAX_IMAGES) break;

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/admin/products/images", {
          method: "POST",
          body: formData,
        });
        const body = await response.json().catch(() => null);

        if (!response.ok) {
          setError(body?.error ?? "No se pudo subir la imagen");
          break;
        }

        uploaded.push({
          publicId: body.publicId,
          url: body.url,
          format: body.format ?? null,
        });
      }
    } catch {
      setError("No se pudo subir la imagen");
    } finally {
      if (uploaded.length > 0) {
        setImages((current) => [...current, ...uploaded].slice(0, MAX_IMAGES));
      }
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const setPrimary = (publicId: string) => {
    setImages((current) => {
      const target = current.find((image) => image.publicId === publicId);
      if (!target) return current;
      return [
        target,
        ...current.filter((image) => image.publicId !== publicId),
      ];
    });
  };

  const removeImage = async (publicId: string, existingId?: number) => {
    setImages((current) =>
      current.filter((image) => image.publicId !== publicId),
    );
    if (existingId) return;
    try {
      await fetch("/api/admin/products/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      });
    } catch {
      // borrado de mejor esfuerzo
    }
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line bg-canvas/50 px-4 py-8 text-center transition-colors hover:border-blue hover:bg-[#e6f1fb]/50">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          disabled={uploading}
          onChange={(event) => handleFiles(event.target.files)}
          className="hidden"
        />
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e6f1fb] text-blue-deep">
          <IoCloudUploadOutline className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="text-[13px] font-semibold text-ink">
          Arrastra o sube la imagen
        </span>
        <span className="text-[11.5px] text-muted">
          PNG, JPG o WEBP · máxima 2 MB · opcional
        </span>
        <span className="mt-1 rounded-full bg-blue px-3.5 py-1.5 text-[11.5px] font-semibold text-white">
          {uploading ? "Subiendo…" : "Elegir imagen"}
        </span>
      </label>

      {error && (
        <p className="rounded-lg bg-coral/10 px-3 py-2 text-[12.5px] font-medium text-coral-deep">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((image, index) => (
            <li
              key={image.publicId}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border border-line",
                index === 0 && "ring-2 ring-blue ring-offset-2",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.url}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-linear-to-t from-ink/70 to-transparent p-1.5">
                {index === 0 ? (
                  <span className="rounded-full bg-blue px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Principal
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPrimary(image.publicId)}
                    aria-label="Establecer como principal"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-paper/90 text-muted transition-colors hover:text-blue-deep"
                  >
                    <IoStarOutline className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(image.publicId, image.existingId)}
                  aria-label="Quitar imagen"
                  className="flex h-6 w-6 items-center justify-center rounded-full bg-paper/90 text-muted transition-colors hover:text-coral-deep"
                >
                  <IoCloseOutline className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
