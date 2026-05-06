"use server";

import { env } from "../../../env";
import { getAuthCookies } from "@/lib/cookies";

const BASE_URL = env.NEXT_PUBLIC_AUTH_URL;

export const getAllUsers = async () => {
  try {
    const cookieHeader = await getAuthCookies();

    const res = await fetch(`${BASE_URL}/admin/users`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    const result = await res.json();

    return { data: result.data || [] };
  } catch (error: any) {
    console.error("getAllUsers error:", error);
    return { data: [] };
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const cookieHeader = await getAuthCookies();

    const res = await fetch(`${BASE_URL}/admin/remove/${userId}`, {
      method: "DELETE",
      headers: {
        Cookie: cookieHeader,
      },
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: result.message || "Failed to delete user",
      };
    }

    return {
      success: true,
      message: result.message || "User deleted successfully",
    };
  } catch (error: any) {
    console.error("deleteUser error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete user",
    };
  }
};
