"use server";

import { cookies } from "next/headers";
import { env } from "../../../env";
import toast from "react-hot-toast";

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
  } catch (error: any) {
    toast.error(error);
    return { data: [] };
  }
};
