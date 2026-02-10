import { TutorDataType } from "@/type/tutorDataTyp";
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

  getTutorById: async function (
    tutorId: string,
  ): Promise<{ data: TutorDataType | null }> {
    try {
      const res = await fetch(`${API_URL}/api/tutor/${tutorId}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        console.error("getTutorById HTTP error:", res.status);
        return { data: null };
      }

      const result = await res.json();
      return { data: result.data || null };
    } catch (error) {
      console.error("getTutorById error:", error);
      return { data: null };
    }
  },
};
