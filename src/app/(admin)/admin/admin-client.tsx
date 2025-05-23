"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { LockKeyhole, User } from "lucide-react"

export default function AdminClient() {
    const router = useRouter()
    const { toast } = useToast()
    const [adminRoleInput, setAdminRoleInput] = useState("")
    const [adminPasswordInput, setAdminPasswordInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async () => {
        if (!adminRoleInput || !adminPasswordInput) {
            toast({
                title: "Input Required",
                description: "Please enter both admin role and password",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch("/api/verify-admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    role: adminRoleInput,
                    password: adminPasswordInput,
                }),
            })

            const data = await response.json()

            if (data.success) {
                toast({
                    title: "Success",
                    description: "Admin access granted",
                })
                router.push("/admin/dashboard")
            } else {
                toast({
                    title: "Access Denied",
                    description: "Invalid admin credentials. Please try again.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Error verifying admin:", error)
            toast({
                title: "Error",
                description: "Something went wrong. Please try later.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-md shadow-lg border-muted">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Admin Access</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access the admin dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="admin-role">Admin Role</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="admin-role"
                                placeholder="Enter admin role"
                                type="text"
                                className="pl-10"
                                value={adminRoleInput}
                                onChange={(e) => setAdminRoleInput(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="admin-password">Admin Password</Label>
                        <div className="relative">
                            <LockKeyhole className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="admin-password"
                                placeholder="Enter admin password"
                                type="password"
                                className="pl-10"
                                value={adminPasswordInput}
                                onChange={(e) => setAdminPasswordInput(e.target.value)}
                                disabled={isLoading}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSubmit()
                                    }
                                }}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="default" className="w-full" onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Verifying..." : "Access Dashboard"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
