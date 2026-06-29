// app/components/shared/ImageUploader/DropZone.tsx
"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, Loader2 } from "lucide-react";

interface Props {
  onDrop:    (files: File[]) => void;
  uploading: boolean;
  disabled:  boolean;
  single:    boolean;
}

export default function DropZone({ onDrop, uploading, disabled, single }: Props) {
  const handleDrop = useCallback((accepted: File[]) => {
    onDrop(accepted);
  }, [onDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop:   handleDrop,
    accept:   { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    multiple: !single,
    disabled: disabled || uploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
        ${isDragActive  ? "border-primary bg-primary/5 scale-[1.01]" : "border-border"}
        ${disabled      ? "opacity-50 cursor-not-allowed" : "hover:border-primary/60 hover:bg-muted/40"}
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2 text-muted-foreground">
        {uploading ? (
          <>
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
            <p className="text-sm font-medium">Uploading...</p>
          </>
        ) : (
          <>
            <ImagePlus className="w-7 h-7" />
            <p className="text-sm font-medium">
              {isDragActive ? "Drop images here" : single ? "Click or drag to upload image" : "Click or drag to upload images"}
            </p>
            <p className="text-xs">JPG, PNG, WEBP · Max {single ? "1 image" : "6 images"} · 5MB each</p>
          </>
        )}
      </div>
    </div>
  );
}