import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://mentor-hub-server-tov4.onrender.com";

export const authClient = createAuthClient({
  baseURL: BACKEND_URL,
  fetchOptions: {
    credentials: "include",
    additionalHeaders: {
      "Accept": "application/json",
    }
  },
  plugins: [
    emailOTPClient()
  ]
});
