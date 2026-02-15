"use server";

import { cookies } from "next/headers";

export const getSession = async () => {
  try {
    const cookieStore = await cookies();

    const res = await fetch(`/api/auth/get-session`, {
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
