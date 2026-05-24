"use server";

import { env } from "../../../env";
import { cookies } from "next/headers";

const AUTH_URL = process.env.BACKEND_URL || "";

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
      signal: AbortSignal.timeout(8000),
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
