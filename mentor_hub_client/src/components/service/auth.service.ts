"use server";

import { cookies } from "next/headers";
import { env } from "../../../env";

const AUTH_URl = env.AUTH_URL;

export const userService = {
  getSession: async function () {
    try {
      const cookieStore = cookies();

      const res = await fetch(`${AUTH_URl}/get-session`, {
        headers: {
          Cookie: (await cookieStore).toString(),
        },
        cache: "no-store",
      });

      const session = await res.json();

      return { data: session };
    } catch (error) {
      console.log(error);
    }
  },
};
