"use server"
import { Button } from "@/components/ui/button"
import {
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton
} from '@clerk/nextjs'
import { auth, currentUser } from "@clerk/nextjs/server"
import Link from "next/link"
import { Fragment } from "react"
export default async function AuthInMobile() {
    const { userId } = auth()
    const user = await currentUser()
    const isAdmin = user?.emailAddresses[0].emailAddress === process.env.ADMIN_EMAIL
    return (
        <Fragment>
            {user ? (
                <>
                    {isAdmin ? (
                        <Link scroll={true}
                            href="/dashboard"
                        >
                            <Button variant="default"
                            >
                                Dashboard
                            </Button>
                        </Link>
                    ) : null}
                    <UserButton afterSignOutUrl="/" />
                </>
            ) : (
                <>
                    <SignedOut>
                        <SignUpButton mode="modal">
                            <Button variant="default">
                                Sign Up
                            </Button>
                        </SignUpButton>
                        <SignInButton mode="modal">
                            <Button variant="outline">
                                Sign In
                            </Button>
                        </SignInButton>
                    </SignedOut>
                </>
            )}
        </Fragment>
    )
}