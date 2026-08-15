import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteImage, uploadImageBuffer } from "@/lib/cloudinary";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se envió ningún archivo" }, { status: 400 });
  }
  if (!ACCEPTED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Formato no permitido (usa JPG, PNG o WEBP)" },
      { status: 400 },
    );
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return NextResponse.json(
      { error: "La imagen supera el máximo de 2 MB" },
      { status: 400 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImageBuffer(buffer);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "No se pudo subir la imagen" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const publicId = body?.publicId;

  if (typeof publicId !== "string" || publicId.length === 0) {
    return NextResponse.json({ error: "publicId requerido" }, { status: 400 });
  }

  try {
    await deleteImage(publicId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se pudo eliminar la imagen" }, { status: 500 });
  }
}
