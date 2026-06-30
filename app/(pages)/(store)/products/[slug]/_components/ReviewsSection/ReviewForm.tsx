// app/(pages)/(store)/products/[slug]/_components/ReviewsSection/ReviewForm.tsx
"use client";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface Props {
  productId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ productId, onSuccess }: Props) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle]   = useState("");
  const [body, setBody]     = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) { toast.error("Please select a rating"); return; }

    try {
      setLoading(true);
      await axios.post("/api/reviews", { productId, rating, title, body });
      toast.success("Review submitted — thank you!");
      setRating(0); setTitle(""); setBody("");
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-xl p-5 space-y-4">
      <h3 className="font-semibold">Write a Review</h3>

      <div>
        <p className="text-sm font-medium mb-2">Your Rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`w-7 h-7 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <Input
        placeholder="Review title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <Textarea
        placeholder="Share your experience with this product..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
      />

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </div>
  );
}