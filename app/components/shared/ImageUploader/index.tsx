// app/components/shared/ImageUploader/index.tsx
"use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DropZone from "./DropZone";
import ImagePreview from "./ImagePreview";
import { UploadedImage, ImageUploaderProps } from "./types";

export default function ImageUploader({
  images,
  onChange,
  folder    = "feelgood/misc",
  maxImages = 6,
  maxSizeMB = 5,
  single    = false,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [errors,   setErrors]    = useState<string[]>([]);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSizeMB * 1024 * 1024) return `${file.name} exceeds ${maxSizeMB}MB`;
    if (!file.type.startsWith("image/"))      return `${file.name} is not an image`;
    return null;
  };

  const uploadFile = async (file: File): Promise<UploadedImage> => {
    // Step 1 — get signature from your API
    const { data: signData } = await axios.post("/api/upload/sign", { folder });
    const { signature, timestamp, cloudName, apiKey } = signData.data;

    // Step 2 — upload directly to Cloudinary using the signature
    const formData = new FormData();
    formData.append("file",       file);
    formData.append("signature",  signature);
    formData.append("timestamp",  String(timestamp));
    formData.append("api_key",    apiKey);
    formData.append("folder",     folder);

    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return { url: data.secure_url, publicId: data.public_id };
  };

  const handleDrop = async (acceptedFiles: File[]) => {
    setErrors([]);

    // Validate all files first
    const validationErrors = acceptedFiles
      .map(validateFile)
      .filter(Boolean) as string[];

    if (validationErrors.length) {
      setErrors(validationErrors);
      return;
    }

    // Check image count limit
    const remaining = (single ? 1 : maxImages) - images.length;
    if (acceptedFiles.length > remaining) {
      setErrors([`You can only add ${remaining} more image(s)`]);
      return;
    }

    try {
      setUploading(true);
      const uploaded = await Promise.all(acceptedFiles.map(uploadFile));

      // In single mode replace, in multi mode append
      onChange(single ? uploaded : [...images, ...uploaded]);
      toast.success(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded`);
    } catch (err: any) {
      toast.error("Upload failed — please try again");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (publicId: string) => {
    try {
      await axios.post("/api/upload/delete", { publicId });
      onChange(images.filter((img) => img.publicId !== publicId));
      toast.success("Image removed");
    } catch {
      toast.error("Failed to remove image");
    }
  };

  const isDisabled = single
    ? images.length >= 1
    : images.length >= maxImages;

  return (
    <div className="space-y-3">
      <ImagePreview images={images} onRemove={handleRemove} single={single} />

      {!isDisabled && (
        <DropZone
          onDrop={handleDrop}
          uploading={uploading}
          disabled={isDisabled}
          single={single}
        />
      )}

      {errors.length > 0 && (
        <ul className="space-y-1">
          {errors.map((err, i) => (
            <li key={i} className="text-xs text-destructive">{err}</li>
          ))}
        </ul>
      )}

      {!single && (
        <p className="text-xs text-muted-foreground">
          {images.length}/{maxImages} images · First image is the cover photo
        </p>
      )}
    </div>
  );
}