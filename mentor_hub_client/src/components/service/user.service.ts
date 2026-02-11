"use server";

import { cookies } from "next/headers";
import { env } from "../../../env";

const BASE_URL = env.NEXT_PUBLIC_AUTH_URL || "http://localhost:5000/api";

export const getAllUsers = async () => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${BASE_URL}/admin/users`, {
      method: "GET",
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    const result = await res.json();

    return { data: result.data || [] };
  } catch (error) {
    console.log("getAllUsers error:", error);
    return { data: [] };
  }
};
