import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    BACKEND_URL: z.string().optional(),
    API_URL: z.string().optional(),
    AUTH_URL: z.string().optional(),
  },

  client: {
    NEXT_PUBLIC_FRONTEND_URL: z.string().optional(),
    NEXT_PUBLIC_AUTH_URL: z.string().optional(),
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    NEXT_PUBLIC_BACKEND_URL: z.string().optional(),
  },

  runtimeEnv: {
    BACKEND_URL: process.env.BACKEND_URL,
    API_URL: process.env.API_URL,
    AUTH_URL: process.env.AUTH_URL,

    NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
});
