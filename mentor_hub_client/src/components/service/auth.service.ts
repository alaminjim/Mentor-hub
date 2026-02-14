"use server";

import { cookies } from "next/headers";

import { env } from "../../../env";

const AUTH_URL = env.NEXT_PUBLIC_AUTH_URL;

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
    console.log(error);
    return { data: null };
  }
};
