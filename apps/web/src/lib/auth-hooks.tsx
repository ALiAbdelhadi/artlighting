"use client";

import { authClient } from "./auth-client";
import Link from "next/link";
import type { ReactNode } from "react";

/** Drop-in replacement for Clerk's `useAuth()`. */
export function useAuth() {
  const { data: session, isPending } = authClient.useSession();
  return {
    isLoaded: !isPending,
    isSignedIn: !!session,
    userId: session?.user?.id ?? null,
  };
}

/** Drop-in replacement for Clerk's `useUser()`. */
export function useUser() {
  const { data: session, isPending } = authClient.useSession();
  return {
    isLoaded: !isPending,
    isSignedIn: !!session,
    user: session?.user ?? null,
  };
}

export function SignedIn({ children }: { children: ReactNode }) {
  const { isSignedIn } = useAuth();
  return isSignedIn ? <>{children}</> : null;
}

export function SignedOut({ children }: { children: ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  return isLoaded && !isSignedIn ? <>{children}</> : null;
}

/** Drop-in-ish replacement for Clerk's <SignInButton>/<SignUpButton> — links to the app's own pages instead of opening a hosted modal. */
export function SignInButton({ children }: { children: ReactNode }) {
  return (
    <Link href="/sign-in" className="contents">
      {children}
    </Link>
  );
}

export function SignUpButton({ children }: { children: ReactNode }) {
  return (
    <Link href="/sign-up" className="contents">
      {children}
    </Link>
  );
}
