// src/services/student.service.ts
import { env } from "../../../env";

const API_URL = env.NEXT_PUBLIC_APP_URL;

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

export const getStudentStats = async (): Promise<StudentStats | null> => {
  try {
    const res = await fetch(`${API_URL}/api/student/stats`, {
      cache: "no-store",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to fetch student stats");

    const json: StudentStatsResponse = await res.json();
    return json.data || null;
  } catch (err) {
    return null;
  }
};
