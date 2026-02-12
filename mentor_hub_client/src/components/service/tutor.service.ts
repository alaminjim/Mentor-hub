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

  getOwnProfile: async (): Promise<{
    data: TutorDataType | null;
    error?: string;
  }> => {
    try {
      const res = await fetch(`${API_URL}/api/tutor/own/profile`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        const errorData = await res.json();
        return {
          data: null,
          error: errorData.message || "Failed to fetch profile",
        };
      }

      const result = await res.json();
      return { data: result.data || null };
    } catch (error) {
      console.error("getOwnProfile error:", error);
      return {
        data: null,
        error: "An error occurred while fetching profile",
      };
    }
  },

  updateOwnProfile: async (
    tutorId: string,
    profileData: Partial<TutorDataType>,
  ): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
      const res = await fetch(
        `${API_URL}/api/tutor/profile/update/${tutorId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify(profileData),
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        return {
          success: false,
          error: errorData.message || "Failed to update profile",
        };
      }

      const result = await res.json();
      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error("updateOwnProfile error:", error);
      return {
        success: false,
        error: "An error occurred while updating profile",
      };
    }
  },

  // Delete own tutor profile
  deleteOwnProfile: async (
    tutorId: string,
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const res = await fetch(`${API_URL}/api/tutor/own/profile/${tutorId}`, {
        method: "DELETE",
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        const errorData = await res.json();
        return {
          success: false,
          error: errorData.message || "Failed to delete profile",
        };
      }

      const result = await res.json();
      return {
        success: true,
        message: result.message || "Profile deleted successfully",
      };
    } catch (error) {
      console.error("deleteOwnProfile error:", error);
      return {
        success: false,
        error: "An error occurred while deleting profile",
      };
    }
  },
};
