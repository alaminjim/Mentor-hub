import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "https://mentor-hub-server.vercel.app",
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    emailOTPClient()
  ]
});
