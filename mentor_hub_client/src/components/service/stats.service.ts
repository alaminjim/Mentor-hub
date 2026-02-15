import { StatsDataType } from "@/type/statsType";

export const statsService = {
  getStats: async (): Promise<{ data: StatsDataType | null }> => {
    try {
      const res = await fetch(`/api/student/stats`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
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
