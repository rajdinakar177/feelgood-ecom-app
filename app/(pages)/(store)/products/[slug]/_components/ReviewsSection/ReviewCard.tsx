// app/(pages)/(store)/products/[slug]/_components/ReviewsSection/ReviewCard.tsx
import { Star, BadgeCheck } from "lucide-react";

interface Props { review: any; }

export default function ReviewCard({ review }: Props) {
  const user = review.userId;
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="border-b py-5 last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
          {initials}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
            {review.isVerifiedPurchase && (
              <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <BadgeCheck className="w-3.5 h-3.5" /> Verified Purchase
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">
              {new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>

          {review.title && <p className="text-sm font-medium mt-2">{review.title}</p>}
          {review.body && <p className="text-sm text-muted-foreground mt-1">{review.body}</p>}
        </div>
      </div>
    </div>
  );
}