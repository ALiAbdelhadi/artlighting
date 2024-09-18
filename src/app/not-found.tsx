import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Contact, Home, Search, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
export default function NotFound() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <main className="flex-grow flex flex-col items-center justify-center text-center px-4 md:px-6">
                <div className="space-y-4 max-w-3xl">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">404 - Page Not Found</h1>
                    <p className="text-xl text-muted-foreground">Oops! The page you're looking for doesn't exist.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search for products..."
                                className="pl-8"
                            />
                        </div>
                        <Button type="submit">Search</Button>
                    </div>
                    <div className="pt-8">
                        <h2 className="text-xl font-semibold mb-4">Or try one of these:</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Link
                                href="/"
                                className="flex items-center justify-center p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                            >
                                <Home className="mr-2 h-5 w-5" />
                                Home Page
                            </Link>
                            <Link
                                href="/category"
                                className="flex items-center justify-center p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                            >
                                <ShoppingBag className="mr-2 h-5 w-5" />
                                All Products
                            </Link>
                            <Link
                                href="/ContactUs"
                                className="flex items-center justify-center p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                            >
                                <Contact className="mr-2 h-5 w-5"  />
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}