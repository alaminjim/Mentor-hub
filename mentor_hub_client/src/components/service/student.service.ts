import { env } from "../../../env";

const API_URL = env.NEXT_PUBLIC_BACKEND_URL;

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
  status: "BANNED" | "UnBAN";
}

export interface StudentProfileResponse {
  success: boolean;
  data: StudentProfile;
  message: string;
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  role?: "STUDENT" | "TUTOR";
  status?: "BANNED" | "UnBAN";
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

export interface StudentStats {
  totalTutors: number;
  totalStudents: number;
  totalSessions: number;
  averageRating: number;
}

export interface StudentStatsResponse {
  success: boolean;
  data: StudentStats;
  message: string;
}

export const getAuthMe = async (): Promise<StudentProfile | null> => {
  try {
    const res = await fetch(`/api/auth/authMe`, {
      cache: "no-store",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch user data");

    const json: StudentProfileResponse = await res.json();
    return json.data || null;
  } catch (err) {
    console.error("Error fetching auth data:", err);
    return null;
  }
};

export const updateStudentProfile = async (
  studentId: string,
  data: UpdateProfileData,
): Promise<ApiResponse> => {
  try {
    const res = await fetch(`/api/student/profile/${studentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to update profile");
    }

    const json: ApiResponse = await res.json();
    return json;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to update profile",
    };
  }
};

export const deleteStudentProfile = async (
  studentId: string,
): Promise<ApiResponse> => {
  try {
    const res = await fetch(`/api/student/remove/${studentId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to delete profile");
    }

    const json: ApiResponse = await res.json();
    return json;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Failed to delete profile",
    };
  }
};

export const getStudentStats = async (): Promise<StudentStats | null> => {
  try {
    const res = await fetch(`/api/student/stats`, {
      cache: "no-store",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch student stats");

    const json: StudentStatsResponse = await res.json();
    return json?.data || null;
  } catch (err) {
    return null;
  }
};
