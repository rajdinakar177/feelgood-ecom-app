"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Star } from "lucide-react";
import { buildQueryString } from "@/app/lib/utils/buildQueryString";

export default function RatingFilter() {
  const router       = useRouter();
  const pathname      = usePathname();
  const searchParams  = useSearchParams();
  const activeRating  = searchParams.get("minRating");

  const select = (rating: string | null) => {
    const qs = buildQueryString(searchParams, { minRating: rating });
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  return (
    <div>
      <h3 className="font-semibold text-sm mb-3">Customer Rating</h3>
      <div className="space-y-1.5">
        {[4, 3, 2, 1].map((rating) => (
          <button
            key={rating}
            onClick={() => select(activeRating === String(rating) ? null : String(rating))}
            className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm transition-colors
              ${activeRating === String(rating) ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"}`}
          >
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < rating
                      ? (activeRating === String(rating) ? "fill-primary-foreground text-primary-foreground" : "fill-yellow-400 text-yellow-400")
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
            <span>& up</span>
          </button>
        ))}
      </div>
    </div>
  );
}