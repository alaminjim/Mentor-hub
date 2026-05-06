"use server";

import { env } from "../../../env";
import { getAuthCookies, logAllCookies } from "@/lib/cookies";

const AUTH_URL = typeof window === 'undefined' ? (env.AUTH_URL || "https://mentor-hub-1.onrender.com/api/auth") : (env.NEXT_PUBLIC_AUTH_URL || "/api/auth");

export const getSession = async () => {
  try {
    // Debug: log all available cookies
    await logAllCookies();
    
    // Get better-auth specific cookies (check all possible names with and without __Secure- prefix)
    let sessionCookie = cookieStore.get("better-auth.session_token") 
      || cookieStore.get("__Secure-better-auth.session_token")
      || cookieStore.get("better-auth.session")
      || cookieStore.get("session_token");
      
    let sessionDataCookie = cookieStore.get("better-auth.session_data")
      || cookieStore.get("__Secure-better-auth.session_data")
      || cookieStore.get("session_data");

    const cookieHeader = `${sessionCookie}; ${sessionDataCookie}`;

    console.log("[getSession] Cookie header:", cookieHeader ? "present" : "missing");
    
    console.log("[getSession] Fetching from:", AUTH_URL);
    console.log("[getSession] Cookie header:", cookieHeader.substring(0, 50) + "...");

    const res = await fetch(`${AUTH_URL}/get-session`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });
    
    console.log("[getSession] Response status:", res.status);

    if (!res.ok) {
      console.log("[getSession] Response not ok, returning null");
      return { data: null };
    }

    const session = await res.json();
    console.log("[getSession] Session found:", !!session?.user);
    return { data: session };
  } catch (error: any) {
    console.error("[getSession] Error:", error);
    return { data: null };
  }
};
