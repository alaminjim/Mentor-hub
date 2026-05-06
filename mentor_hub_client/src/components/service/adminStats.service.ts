import { StatsDataType } from "@/type/statsType";

export const adminStatsService = {
  getAdminStats: async (): Promise<{ data: StatsDataType | null }> => {
    try {
      const baseUrl = typeof window === "undefined" ? (process.env.BACKEND_URL || "https://mentor-hub-1.onrender.com") : (process.env.NEXT_PUBLIC_BACKEND_URL || "https://mentor-hub-1.onrender.com");
      const res = await fetch(`${baseUrl}/api/auth/admin/stats`, {
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
