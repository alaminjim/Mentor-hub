import { TutorDataType } from "@/type/tutorDataTyp";
import { env } from "../../../env";

const API_URL = env.NEXT_PUBLIC_APP_URL;

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

  createTutorProfile: async function (
    profileData: any,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const res = await fetch(`${API_URL}/api/tutor/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify(profileData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return {
          success: false,
          error: errorData.message || "Failed to create tutor profile",
        };
      }

      const result = await res.json();
      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error("createTutorProfile error:", error);
      return {
        success: false,
        error: "An error occurred while creating tutor profile",
      };
    }
  },
};
