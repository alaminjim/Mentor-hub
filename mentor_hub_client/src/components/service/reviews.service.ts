import { CreateReviewData, ReviewDataType } from "@/type/reviewType";
import { env } from "../../../env";

const app_url = env.NEXT_PUBLIC_BACKEND_URL;

export const reviewService = {
  getReviews: async function (
    tutorId?: string,
  ): Promise<{ data: ReviewDataType[] | null }> {
    try {
      const url = tutorId
        ? `${app_url}/api/review?tutorId=${tutorId}`
        : `/api/review`;

      const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        return { data: null };
      }

      const result = await res.json();
      return { data: result.data || [] };
    } catch (error) {
      return { data: null };
    }
  },

  getOwnReviews: async function (): Promise<{
    success: boolean;
    data?: ReviewDataType[];
    error?: string;
  }> {
    try {
      const response = await fetch(`/api/review/own`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || "Failed to fetch reviews",
        };
      }

      return {
        success: true,
        data: result.data || [],
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Network error",
      };
    }
  },

  createReview: async function (
    reviewData: CreateReviewData,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      if (!reviewData.tutorId) {
        return {
          success: false,
          error: "Tutor ID is required",
        };
      }

      if (
        !reviewData.rating ||
        reviewData.rating < 1 ||
        reviewData.rating > 5
      ) {
        return {
          success: false,
          error: "Rating must be between 1 and 5",
        };
      }

      const payload = {
        tutorId: reviewData.tutorId,
        rating: Number(reviewData.rating),
        ...(reviewData.comment?.trim() && {
          comment: reviewData.comment.trim(),
        }),
      };

      const response = await fetch(`/api/review/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || result.error || "Failed to create review",
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Network error",
      };
    }
  },
};

export const CreateReview = reviewService.createReview;
export const GetOwnReviews = reviewService.getOwnReviews;
