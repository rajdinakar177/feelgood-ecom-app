// app/(pages)/(store)/products/[slug]/_components/ReviewsSection/index.tsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import ReviewSummary from "./ReviewSummary";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";

interface Props {
  productId:   string;
  avgRating:   number;
  reviewCount: number;
}

export default function ReviewsSection({ productId, avgRating, reviewCount }: Props) {
  const [reviews, setReviews]     = useState<any[]>([]);
  const [breakdown, setBreakdown] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage]           = useState(1);
  const [eligibility, setEligibility] = useState<any>(null);
  const [showForm, setShowForm]   = useState(false);

  const fetchReviews = async () => {
    const { data } = await axios.get(`/api/reviews?productId=${productId}&page=${page}`);
    setReviews(data.data);
    setBreakdown(data.breakdown);
    setPagination(data.pagination);
  };

  const fetchEligibility = async () => {
    const { data } = await axios.get(`/api/reviews/eligibility?productId=${productId}`);
    setEligibility(data.data);
  };

  useEffect(() => { fetchReviews(); }, [page]);
  useEffect(() => { fetchEligibility(); }, []);

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-bold">Customer Reviews</h2>

      <ReviewSummary avgRating={avgRating} reviewCount={reviewCount} breakdown={breakdown} />

      {/* Write review CTA */}
      {eligibility && !eligibility.alreadyReviewed && !showForm && (
        <Button
          variant="outline"
          onClick={() => {
            if (!eligibility.isLoggedIn) {
              window.location.href = "/login";
              return;
            }
            setShowForm(true);
          }}
        >
          Write a Review
        </Button>
      )}

      {eligibility?.alreadyReviewed && (
        <p className="text-sm text-muted-foreground">You've already reviewed this product.</p>
      )}

      {showForm && (
        <ReviewForm
          productId={productId}
          onSuccess={() => {
            setShowForm(false);
            fetchReviews();
            fetchEligibility();
          }}
        />
      )}

      {/* Review list */}
      <div>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((r) => <ReviewCard key={r._id} review={r} />)
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground self-center">Page {page} of {pagination.pages}</span>
          <Button variant="outline" size="sm" disabled={page === pagination.pages} onClick={() => setPage(page + 1)}>
            Next
          </Button>
        </div>
      )}
    </section>
  );
}