import { StatsDataType } from "@/type/statsType";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://mentor-hub-server.vercel.app";

export const statsService = {
  getStats: async (): Promise<{ data: StatsDataType | null }> => {
    try {
      const res = await fetch(`${API_URL}/api/student/stats`, {
        method: "GET",
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
