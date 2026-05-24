"use client";

import { useEffect, useState } from "react";
import { reviewService } from "@/components/service/reviews.service";
import ReviewCard from "./reviewCard";
import { ReviewDataType } from "@/type/reviewType";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewDataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await reviewService.getReviews();
        setReviews(data || []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const latestReviews = reviews
    ? [...reviews]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 3)
    : [];

  return (
    <main className=" bg-gradient-to-b from-blue-50/50 to-cyan-50/30 text-center mt-14">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Recent Student Reviews
          </h1>
          <p className="text-gray-600">
            {loading
              ? "Loading reviews..."
              : latestReviews.length > 0
              ? `Latest ${latestReviews.length} reviews from our students`
              : "No reviews yet"}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-48 bg-slate-100 dark:bg-slate-900/40 rounded-2xl border border-cyan-100/50 animate-pulse"
              />
            ))}
          </div>
        ) : latestReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {latestReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No reviews yet
            </h2>
            <p className="text-gray-500">
              Be the first to share your experience!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

