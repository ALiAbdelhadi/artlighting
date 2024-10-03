'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { SignUp } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import "../../styles/clerk.css"
export function ThemedSignUp() {
    const { theme } = useTheme()
    const [mountedComponent, setMountedComponent] = useState(false)

    useEffect(() => {
        setMountedComponent(true)
    }, [])

    if (!mountedComponent) {
        return null
    }

    return (
        <div className='max-h-[90vh] col-span-full lg:col-span-1 overflow-auto'>
            <ScrollArea>
                <div className='ml-6'>
                    <SignUp
                        appearance={{
                            baseTheme: theme === 'dark' ? dark : undefined,
                            elements: {
                                formButtonPrimary: {
                                    backgroundColor: 'hsl(var(--primary))',
                                    color: 'hsl(var(--primary-foreground))',
                                    '&:hover': {
                                        backgroundColor: 'hsl(var(--primary) / 0.9)',
                                    },
                                },
                                card: {
                                    backgroundColor: 'hsl(var(--card))',
                                    color: 'hsl(var(--card))',
                                    boxShadow: "none"
                                },
                                maxHeight: '80vh',
                                overflow: 'auto',
                                headerTitle: {
                                    color: 'hsl(var(--foreground))',
                                },
                                headerSubtitle: {
                                    color: 'hsl(var(--muted-foreground))',
                                },
                                socialButtonsBlockButton: {
                                    borderColor: 'hsl(var(--border))',
                                    color: 'hsl(var(--foreground))',
                                    '&:hover': {
                                        backgroundColor: 'hsl(var(--secondary))',
                                    },
                                },
                                formFieldLabel: {
                                    color: 'hsl(var(--foreground))',
                                },
                                formFieldInput: {
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--input))',
                                    color: 'hsl(var(--foreground))',
                                    '&::placeholder': {
                                        color: 'hsl(var(--muted-foreground))',
                                    },
                                },
                                footerActionLink: {
                                    color: 'hsl(var(--primary))',
                                    '&:hover': {
                                        color: 'hsl(var(--primary) / 0.9)',
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </ScrollArea>
        </div>
    )
}