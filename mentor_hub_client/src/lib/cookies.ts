"use server";

import { cookies } from "next/headers";

/**
 * Helper to get better-auth cookies for server-side API calls
 * Checks for cookies with and without _Secure- prefix
 */
export async function getAuthCookies(): Promise<string> {
  const cookieStore = await cookies();
  
  // Get better-auth specific cookies (check both with and without _Secure- prefix)
  const sessionToken = cookieStore.get("better-auth.session_token") 
    || cookieStore.get("_Secure-better-auth.session_token");
  const sessionData = cookieStore.get("better-auth.session_data")
    || cookieStore.get("_Secure-better-auth.session_data");
  
  const cookieStrings: string[] = [];
  if (sessionToken) {
    cookieStrings.push(`${sessionToken.name}=${sessionToken.value}`);
  }
  if (sessionData) {
    cookieStrings.push(`${sessionData.name}=${sessionData.value}`);
  }
  
  return cookieStrings.join("; ");
}

/**
 * Debug helper to log all available cookies
 */
export async function logAllCookies(): Promise<void> {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  console.log("[Cookies] All available cookies:", allCookies.map(c => c.name));
}
