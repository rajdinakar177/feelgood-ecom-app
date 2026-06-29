// app/components/shared/ImageUploader/ImagePreview.tsx
"use client";
import { X, GripVertical } from "lucide-react";
import { UploadedImage } from "./types";

interface Props {
  images:   UploadedImage[];
  onRemove: (publicId: string) => void;
  single:   boolean;
}

export default function ImagePreview({ images, onRemove, single }: Props) {
  if (images.length === 0) return null;

  if (single) {
    const img = images[0];
    return (
      <div className="relative w-32 h-32 rounded-xl overflow-hidden border group">
        <img src={img.url} alt="" className="w-full h-full object-cover" />
        <button
          onClick={() => onRemove(img.publicId)}
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
            transition-opacity flex items-center justify-center"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {images.map((img, i) => (
        <div key={img.publicId} className="relative group aspect-square rounded-xl overflow-hidden border">
          <img src={img.url} alt="" className="w-full h-full object-cover" />

          {/* Cover badge on first image */}
          {i === 0 && (
            <span className="absolute bottom-1 left-1 text-[10px] font-medium
              bg-black/60 text-white px-1.5 py-0.5 rounded-full">
              Cover
            </span>
          )}

          {/* Remove button */}
          <button
            onClick={() => onRemove(img.publicId)}
            className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80
              text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
}