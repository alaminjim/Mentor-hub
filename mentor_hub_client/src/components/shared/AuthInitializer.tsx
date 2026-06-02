"use client";

import { useEffect } from "react";

export default function AuthInitializer() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalFetch = window.fetch;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

    window.fetch = async function (input, init) {
      let url = "";
      if (typeof input === "string") {
        url = input;
      } else if (input instanceof Request) {
        url = input.url;
      } else if (input && typeof input === "object" && "url" in input) {
        url = (input as any).url;
      }

      // Check if this is a request to the backend domain
      const isBackendCall = backendUrl && url.startsWith(backendUrl);

      if (isBackendCall) {
        const token = localStorage.getItem("bearer_token");
        if (token) {
          // Normalize init headers
          init = init || {};
          const headers = new Headers(init.headers || {});
          if (!headers.has("Authorization")) {
            headers.set("Authorization", `Bearer ${token}`);
          }
          init.headers = headers;
        }
      }

      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}
