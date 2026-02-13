"use client";

import { useState, useEffect } from "react";
import {
  Star,
  Loader2,
  MessageSquare,
  User,
  Calendar,
  StarOff,
} from "lucide-react";
import toast from "react-hot-toast";
import { GetOwnReviews } from "@/components/service/reviews.service";
import { ReviewDataType } from "@/type/reviewType";

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<ReviewDataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const result = await GetOwnReviews();

      if (result.success && result.data) {
        setReviews(result.data);
      } else {
        toast.error(result.error || "Failed to load reviews");
        setReviews([]);
      }
    } catch (error) {
      toast.error("An error occurred while loading reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return "Poor";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Very Good";
      case 5:
        return "Excellent";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="size-12 animate-spin text-sky-500 mx-auto mb-4" />
          <p className="text-sky-600 font-medium">Loading your reviews...</p>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Star className="text-yellow-500 fill-yellow-500" size={32} />
            My Reviews
          </h1>
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <StarOff className="size-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No Reviews Yet
            </h2>
            <p className="text-gray-600">
              You haven't submitted any reviews yet. Complete a session to leave
              your first review!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Star className="text-yellow-500 fill-yellow-500" size={32} />
            My Reviews
          </h1>
          <p className="text-gray-600">Total Reviews: {reviews.length}</p>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      {renderStars(review.rating)}
                      <span className="text-sm font-semibold text-gray-700 px-3 py-1 bg-yellow-100 rounded-full">
                        {getRatingText(review.rating)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar size={16} />
                    {formatDate(review.createdAt)}
                  </div>
                </div>

                {review.tutorId && typeof review.tutorId === "object" && (
                  <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-lg">
                    <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                      <User className="text-sky-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Tutor
                      </p>
                      <p className="font-semibold text-gray-900">
                        {(review.tutorId as any).name || "N/A"}
                      </p>
                    </div>
                  </div>
                )}

                {review.comment && (
                  <div className="flex gap-3">
                    <MessageSquare
                      className="text-purple-500 flex-shrink-0 mt-1"
                      size={20}
                    />
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                        Your Comment
                      </p>
                      <p className="text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                )}

                {!review.comment && (
                  <div className="flex gap-3 text-gray-400 italic">
                    <MessageSquare size={20} className="flex-shrink-0" />
                    <p className="text-sm">No comment provided</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
