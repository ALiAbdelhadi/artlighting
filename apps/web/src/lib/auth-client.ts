"use client";

import { createAuthClient } from "better-auth/react";

// No baseURL — Better Auth defaults to same-origin relative requests, which
// is correct in every environment (dev/staging/prod) without configuration.
// Hardcoding NEXT_PUBLIC_APP_URL here previously sent every environment's
// auth requests to the production domain, which the CSP also didn't allow.
export const authClient = createAuthClient({
  basePath: "/api/auth",
});

export const { useSession, signIn, signUp, signOut } = authClient;
