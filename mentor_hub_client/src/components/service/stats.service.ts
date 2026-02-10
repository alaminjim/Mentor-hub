import { StatsDataType } from "@/type/statsType";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const statsService = {
  getStats: async (): Promise<{ data: StatsDataType | null }> => {
    try {
      const res = await fetch(`${API_URL}/api/student/stats`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        console.error("getStats HTTP error:", res.status);
        return { data: null };
      }

      const result = await res.json();
      return { data: result.data || null };
    } catch (error) {
      console.error("getStats error:", error);
      return { data: null };
    }
  },
};
