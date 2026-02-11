import { StatsDataType } from "@/type/statsType";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const adminStatsService = {
  getAdminStats: async (): Promise<{ data: StatsDataType | null }> => {
    try {
      const res = await fetch(`${API_URL}/api/admin/stats`, {
        method: "GET",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        return { data: null };
      }

      const result = await res.json();

      return { data: result.data || null };
    } catch (error) {
      return { data: null };
    }
  },
};
