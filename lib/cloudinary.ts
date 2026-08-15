import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  format: string | null;
}

const ALLOWED_FORMATS = ["jpg", "jpeg", "png", "webp", "avif"];
const UPLOAD_FOLDER = "print-products";

export function uploadImageBuffer(
  buffer: Buffer,
  options?: { publicId?: string },
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        allowed_formats: ALLOWED_FORMATS,
        folder: UPLOAD_FOLDER,
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result)
          return reject(new Error("Cloudinary no devolvió un resultado"));
        resolve({
          publicId: result.public_id,
          url: result.secure_url,
          format: result.format ?? null,
        });
      },
    );
    uploadStream.end(buffer);
  });
}

export function deleteImage(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: "image" },
      (error) => {
        if (error) return reject(error);
        resolve();
      },
    );
  });
}
