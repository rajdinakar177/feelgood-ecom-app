// app/components/shared/ImageUploader/types.ts
export interface UploadedImage {
  url:      string;
  publicId: string;
}

export interface ImageUploaderProps {
  images:     UploadedImage[];
  onChange:   (images: UploadedImage[]) => void;
  folder?:    string;       // Cloudinary folder: "feelgood/products" | "feelgood/categories" | "feelgood/avatars"
  maxImages?: number;       // default 6
  maxSizeMB?: number;       // default 5
  single?:    boolean;      // true for avatar/category (single image mode)
}