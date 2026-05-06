"use server";

import { cookies } from "next/headers";

import { env } from "../../../env";

const AUTH_URL = typeof window === 'undefined' ? (env.AUTH_URL || "https://mentor-hub-1.onrender.com/api/auth") : (env.NEXT_PUBLIC_AUTH_URL || "/api/auth");

export const getSession = async () => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`${AUTH_URL}/get-session`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: "no-store",
    });

    const session = await res.json();
    return { data: session };
  } catch (error: any) {
    return { data: null };
  }
};
