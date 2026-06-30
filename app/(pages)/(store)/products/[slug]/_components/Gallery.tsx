// app/(pages)/(store)/products/[slug]/_components/Gallery.tsx
"use client";
import { useState } from "react";

interface Props {
  images: { url: string }[];
  productName: string;
}

export default function Gallery({ images, productName }: Props) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  if (!images.length) {
    return <div className="aspect-square rounded-2xl bg-muted" />;
  }

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-4">

      {/* Thumbnails */}
      <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[500px]">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors
              ${active === i ? "border-primary" : "border-transparent hover:border-border"}`}
          >
            <img src={img.url} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div
        className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-muted cursor-zoom-in"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        <img
          src={images[active].url}
          alt={productName}
          className={`w-full h-full object-cover transition-transform duration-300
            ${zoomed ? "scale-125" : "scale-100"}`}
        />
      </div>
    </div>
  );
}