import { ReviewDataType } from "@/type/reviewType";
import { env } from "../../../env";

const API_URL = env.API_URL;

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
};
