import "server-only";
import { headers } from "next/headers";
import { auth as authInstance } from "./auth";

/** Drop-in replacement for Clerk's `auth()` — same `{ userId }` shape. */
export async function auth() {
  const session = await authInstance.api.getSession({ headers: await headers() });
  return { userId: session?.user?.id ?? null };
}

/** Drop-in replacement for Clerk's `currentUser()`. */
export async function currentUser() {
  const session = await authInstance.api.getSession({ headers: await headers() });
  if (!session) return null;
  return session.user;
}
