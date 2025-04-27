"use server";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { CartSidebar } from "../CartSidebar";
const AuthInDesktop = async () => {
  try {
    const user = await currentUser();
    const isAdmin =
      user?.emailAddresses?.[0]?.emailAddress === process.env.ADMIN_EMAIL;
    return (
      <div className="flex flex-col md:flex-row md:space-x-4 md:ml-1 mr-2 space-y-4 md:space-y-0 px-2 md:p-0">
        <SignedIn>
          {isAdmin && (
            <Link href="/admin/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
          )}
        </SignedIn>
        <SignedOut>
          <SignUpButton>
            <Button variant="default">Sign Up</Button>
          </SignUpButton>
          <SignInButton>
            <Button variant="outline">Sign In</Button>
          </SignInButton>
        </SignedOut>
        <CartSidebar />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            variables: {
              fontSize: "13px",
            },
          }}
        />
      </div>
    );
  } catch (error) {
    console.error("Error while rendering AuthInDesktop:", error);
    return null;
  }
};

export default AuthInDesktop;
