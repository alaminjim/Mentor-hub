import { StatsDataType } from "@/type/statsType";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || (process.env.BACKEND_URL || "https://mentor-hub-server-tov4.onrender.com");

export const statsService = {
  getStats: async (): Promise<{ data: StatsDataType | null }> => {
    try {
      const baseUrl = typeof window === "undefined" ? (process.env.BACKEND_URL || "https://mentor-hub-server-tov4.onrender.com") : (process.env.NEXT_PUBLIC_BACKEND_URL || "https://mentor-hub-server-tov4.onrender.com");
      const res = await fetch(`${baseUrl}/api/stats`, {
        method: "GET",
        cache: "no-store",
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
