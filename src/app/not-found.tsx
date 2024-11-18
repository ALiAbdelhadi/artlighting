'use client'

import { searchProducts } from "@/app/(main)/actions/search"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Contact, Home, Search, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import ProductCard from "./components/ProductCard/ProductCard"

type Product = {
    id: string;
    productId: string;
    ProductId: string;
    productName: string;
    price: number;
    Brand: string;
    sectionType: string;
    spotlightType: string | null;
    productImages: string[];
    discount: number;
}

export default function NotFound() {
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [isSearching, setIsSearching] = useState(false)
    useEffect(() => {
        const performSearch = async () => {
            if (debouncedSearchTerm.trim() === '') {
                setFilteredProducts([])
                return
            }
            setIsSearching(true)
            try {
                const results = await searchProducts(debouncedSearchTerm)
                const formattedResults: Product[] = results.map(product => ({
                    ...product,
                    ProductId: product.productId,
                    discount: product.discount || 0,
                }))
                setFilteredProducts(formattedResults)
            } catch (error) {
                console.error('Error searching products:', error)
                setFilteredProducts([])
            } finally {
                setIsSearching(false)
            }
        }
        performSearch()
    }, [debouncedSearchTerm])

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <div className="flex-grow flex flex-col items-center justify-start pt-16 px-4 md:px-6">
                <div className="w-full space-y-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-center lg:text-5xl">404 - Page Not Found</h1>
                    <p className="text-xl text-center text-muted-foreground">Oops! The page you're looking for doesn't exist.</p>
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search for products..."
                            className="pl-10 pr-4 py-4 h-12 w-full text-lg  shadow-md focus:ring-2 focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {isSearching && (
                        <div className="text-center">
                            <p className="text-lg text-muted-foreground">Searching...</p>
                        </div>
                    )}
                    {filteredProducts.length > 0 && (
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle>Search Results</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-6">
                                    {filteredProducts.map((product) => (
                                        <ProductCard key={product.productId} product={product} />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    <Card className="max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle>Try one of these</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
                                <Link
                                    href="/"
                                    className="flex items-center justify-center p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                                >
                                    <Home className="mr-2 h-5 w-5" />
                                    Home Page
                                </Link>
                                <Link
                                    href="/category"
                                    className="flex items-center justify-center p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                                >
                                    <ShoppingBag className="mr-2 h-5 w-5" />
                                    All Products
                                </Link>
                                <Link
                                    href="/ContactUs"
                                    className="flex items-center justify-center p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
                                >
                                    <Contact className="mr-2 h-5 w-5" />
                                    Contact Us
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}