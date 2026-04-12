"use server";

import { cookies } from "next/headers";

import { env } from "../../../env.js";

const AUTH_URL = typeof window === 'undefined' ? "https://mentor-hub-server.vercel.app/api/auth" : (env.NEXT_PUBLIC_AUTH_URL || "/api/auth");

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
    console.log(session);
    return { data: session };
  } catch (error: any) {
    console.log(error);
    return { data: null };
  }
};
