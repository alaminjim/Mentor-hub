import { ReviewDataType } from "@/type/reviewType";
import { env } from "../../../env";

const API_URL = env.API_URL || "http://localhost:5000";

export const reviewService = {
  getReviews: async function (
    tutorId?: string,
  ): Promise<{ data: ReviewDataType[] | null }> {
    try {
      const url = tutorId
        ? `${API_URL}/api/review?tutorId=${tutorId}`
        : `${API_URL}/api/review`;

      const res = await fetch(url, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        console.error("getReviews HTTP error:", res.status);
        return { data: null };
      }

      const result = await res.json();
      return { data: result.data || [] };
    } catch (error) {
      console.error("getReviews error:", error);
      return { data: null };
    }
  },

  getReviewById: async function (
    reviewId: string,
  ): Promise<{ data: ReviewDataType | null }> {
    try {
      const res = await fetch(`${API_URL}/api/review/${reviewId}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        console.error("getReviewById HTTP error:", res.status);
        return { data: null };
      }

      const result = await res.json();
      return { data: result.data || null };
    } catch (error) {
      console.error("getReviewById error:", error);
      return { data: null };
    }
  },
};
