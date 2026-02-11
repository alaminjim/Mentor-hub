"use server";

import { cookies } from "next/headers";

const AUTH_URL =
  process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:5000/api/auth";

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
  } catch (error) {
    console.log("getSession error:", error);
    return { data: null };
  }
};
