// app/(pages)/(store)/products/[slug]/_components/ReviewsSection/ReviewSummary.tsx
import { Star } from "lucide-react";

interface Props {
  avgRating: number;
  reviewCount: number;
  breakdown: { _id: number; count: number }[];
}

export default function ReviewSummary({ avgRating, reviewCount, breakdown }: Props) {
  const countFor = (star: number) => breakdown.find((b) => b._id === star)?.count ?? 0;

  return (
    <div className="flex flex-col sm:flex-row gap-8 items-start">
      <div className="text-center sm:text-left">
        <p className="text-4xl font-bold">{avgRating.toFixed(1)}</p>
        <div className="flex justify-center sm:justify-start gap-0.5 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-1">{reviewCount} review{reviewCount !== 1 ? "s" : ""}</p>
      </div>

      <div className="flex-1 w-full space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = countFor(star);
          const pct = reviewCount ? (count / reviewCount) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-sm">
              <span className="w-8 text-muted-foreground">{star}★</span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-yellow-400" style={{ width: `${pct}%` }} />
              </div>
              <span className="w-8 text-muted-foreground text-right">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}