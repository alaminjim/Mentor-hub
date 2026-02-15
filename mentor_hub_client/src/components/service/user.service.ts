"use server";

import { cookies } from "next/headers";

export const getAllUsers = async () => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`/api/auth/admin/users`, {
      method: "GET",
      headers: {
        Cookie: cookieStore.toString(),
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
    const cookieStore = await cookies();

    const res = await fetch(`/api/auth/admin/remove/${userId}`, {
      method: "DELETE",
      headers: {
        Cookie: cookieStore.toString(),
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
