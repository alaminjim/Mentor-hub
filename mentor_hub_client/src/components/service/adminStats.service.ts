import { StatsDataType } from "@/type/statsType";

export const adminStatsService = {
  getAdminStats: async (): Promise<{ data: StatsDataType | null }> => {
    try {
      const res = await fetch(`/api/auth/admin/stats`, {
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
