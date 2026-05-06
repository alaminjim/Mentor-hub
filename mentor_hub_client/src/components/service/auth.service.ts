"use server";

import { cookies } from "next/headers";

import { env } from "../../../env";

const AUTH_URL = typeof window === 'undefined' ? (env.AUTH_URL || "https://mentor-hub-1.onrender.com/api/auth") : (env.NEXT_PUBLIC_AUTH_URL || "/api/auth");

export const getSession = async () => {
  try {
    const cookieStore = await cookies();
    
    // Debug: log all available cookies
    const allCookies = cookieStore.getAll();
    console.log("[getSession] All cookies:", allCookies.map(c => c.name));
    
    // Get better-auth specific cookies (check all possible names)
    let sessionCookie = cookieStore.get("better-auth.session_token") 
      || cookieStore.get("better-auth.session")
      || cookieStore.get("session_token");
      
    let sessionDataCookie = cookieStore.get("better-auth.session_data")
      || cookieStore.get("session_data");
    
    console.log("[getSession] Session cookie found:", !!sessionCookie);
    console.log("[getSession] Cookie names tried: better-auth.session_token, better-auth.session, session_token");
    
    if (!sessionCookie) {
      console.log("[getSession] No session cookie found, returning null");
      return { data: null };
    }
    
    // Build cookie string for fetch
    const cookieHeader = [
      `${sessionCookie.name}=${sessionCookie.value}`,
      sessionDataCookie ? `${sessionDataCookie.name}=${sessionDataCookie.value}` : "",
    ].filter(Boolean).join("; ");
    
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
