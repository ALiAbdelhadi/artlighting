"use server"
import { Button } from "@/components/ui/button"
import {
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton
} from '@clerk/nextjs'
import { currentUser } from "@clerk/nextjs/server"
import Link from "next/link"
import { Fragment } from "react"
export default async function AuthInMobile() {
    const user = await currentUser()
    const isAdmin = user?.emailAddresses[0].emailAddress === process.env.ADMIN_EMAIL
    return (
        <Fragment>
            {user ? (
                <Fragment>
                    {isAdmin ? (
                        <Link scroll={true}
                            href="/dashboard"
                        >
                            <Button variant="default"
                                className="w-full"
                            >
                                Dashboard
                            </Button>
                        </Link>
                    ) : null}
                    <div className="order-1">
                        
                    </div>
                </Fragment>
            ) : (
                <Fragment>
                    <SignedOut>
                        <SignUpButton>
                            <Button variant="default">
                                Sign Up
                            </Button>
                        </SignUpButton>
                        <SignInButton>
                            <Button variant="outline">
                                Sign In
                            </Button>
                        </SignInButton>
                    </SignedOut>
                </Fragment>
            )}
        </Fragment>
    )
}