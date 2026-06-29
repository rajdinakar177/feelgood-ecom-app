// app/(store)/_components/HeroBanner/index.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BannerSlide from "./BannerSlide";

interface Banner {
  _id:        string;
  title:      string;
  subtitle:   string;
  image:      string;
  link:       string;
  buttonText: string;
}

interface Props { banners: Banner[]; }

export default function HeroBanner({ banners }: Props) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() =>
    setCurrent((c) => (c + 1) % banners.length), [banners.length]);

  const prev = () =>
    setCurrent((c) => (c - 1 + banners.length) % banners.length);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, banners.length]);

  if (!banners.length) return null;

  return (
    <div className="relative w-full h-[420px] sm:h-[520px] md:h-[600px] overflow-hidden bg-muted">
      {banners.map((banner, i) => (
        <BannerSlide key={banner._id} {...banner} active={i === current} />
      ))}

      {/* Prev / Next */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40
              backdrop-blur-sm text-white rounded-full p-2 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40
              backdrop-blur-sm text-white rounded-full p-2 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all ${
                i === current ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}