"use client";

import { createAuthClient } from "better-auth/react";

// No baseURL — Better Auth defaults to same-origin relative requests. The
// previous version pointed at NEXT_PUBLIC_APP_URL, which is apps/web's
// production URL, not this app's own origin — a completely different
// Better Auth instance/database tables. Same-origin is correct everywhere.
export const authClient = createAuthClient({
  basePath: "/api/auth",
});

export const { useSession, signIn, signUp, signOut } = authClient;
