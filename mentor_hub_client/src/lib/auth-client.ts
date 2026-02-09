import { createAuthClient } from "better-auth/react";
import { env } from "../../env";

const auth_url = env.NEXT_PUBLIC_AUTH_URL;

export const authClient = createAuthClient({
  baseURL: auth_url,
});
