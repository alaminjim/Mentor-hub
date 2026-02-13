"use server";

import { cookies } from "next/headers";
import toast from "react-hot-toast";
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
    toast.error(error);
    return { data: null };
  }
};
