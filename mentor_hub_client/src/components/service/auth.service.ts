"use server";

import { env } from "../../../env";
import { cookies } from "next/headers";

const AUTH_URL = process.env.BACKEND_URL || "https://mentor-hub-1.onrender.com";

export const getSession = async () => {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join("; ");

    const res = await fetch(`${AUTH_URL}/api/auth/get-session`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return { data: null };
    }

    const session = await res.json();
    return { data: session };
  } catch (error: any) {
    console.error("[getSession] Error:", error);
    return { data: null };
  }
};
