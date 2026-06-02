import { createAuthClient } from "better-auth/react";
import { emailOTPClient } from "better-auth/client/plugins";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export const authClient = createAuthClient({
  baseURL: `${BACKEND_URL}/api/auth`,
  fetchOptions: {
    credentials: "include",
    additionalHeaders: {
      "Accept": "application/json",
    },
    onSuccess: (ctx) => {
      const authToken = ctx.response.headers.get("set-auth-token");
      if (authToken) {
        if (typeof window !== "undefined") {
          localStorage.setItem("bearer_token", authToken);
          const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";
          document.cookie = `better-auth.session_token=${authToken}; path=/; max-age=31536000; SameSite=Lax${secureFlag}`;
        }
      }
      if (ctx.request.url.includes("/sign-out")) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("bearer_token");
          document.cookie = "better-auth.session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
        }
      }
    },
    auth: {
      type: "Bearer",
      token: () => {
        if (typeof window !== "undefined") {
          return localStorage.getItem("bearer_token") || "";
        }
        return "";
      }
    }
  },
  plugins: [
    emailOTPClient()
  ]
});
