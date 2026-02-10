import { env } from "../../../env";

const API_URL = env.API_URL;

export const tutorService = {
  getTutors: async function (): Promise<{ data: any[] }> {
    try {
      const res = await fetch(`${API_URL}/api/tutor`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch tutors");
      }

      const result = await res.json();

      return { data: result.data || [] };
    } catch (error) {
      console.error("getTutors error:", error);
      return { data: [] };
    }
  },
};
