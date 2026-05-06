"use server";

import { cookies } from "next/headers";

import { env } from "../../../env";

const AUTH_URL = typeof window === 'undefined' ? (env.AUTH_URL || "https://mentor-hub-1.onrender.com/api/auth") : (env.NEXT_PUBLIC_AUTH_URL || "/api/auth");

export const getSession = async () => {
  try {
    const cookieStore = await cookies();
    
    // Get better-auth specific cookies
    const sessionCookie = cookieStore.get("better-auth.session");
    const sessionDataCookie = cookieStore.get("better-auth.session_data");
    
    if (!sessionCookie) {
      return { data: null };
    }
    
    // Build cookie string for fetch
    const cookieHeader = [
      sessionCookie ? `${sessionCookie.name}=${sessionCookie.value}` : "",
      sessionDataCookie ? `${sessionDataCookie.name}=${sessionDataCookie.value}` : "",
    ].filter(Boolean).join("; ");

    const res = await fetch(`${AUTH_URL}/get-session`, {
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
    console.error("getSession error:", error);
    return { data: null };
  }
};
