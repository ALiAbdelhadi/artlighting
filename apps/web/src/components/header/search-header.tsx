"use client"

import { searchProducts } from "@/actions/search"
import { Input } from "@/components/ui/input"
import { Button } from "@repo/ui/button"
import { ScrollArea } from "@repo/ui/scroll-area"
import { Loader2, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useDebounce } from "use-debounce"
import DiscountPrice from "../discount-price"
import NormalPrice from "../normal-price"

interface Product {
    productId: string
    productName: string
    Brand: string
    price: number
    productImages: string[]
    sectionType: string
    spotlightType: string
    discount: number
    ProductId: string
    ChandelierLightingType: string
    hNumber: number
    maximumWattage: string
    lampBase: string
    mainMaterial: string
    beamAngle: string
}

interface SearchHeaderProps {
    isMobile?: boolean
    isMobileSheet?: boolean
}

export function SearchHeader({ isMobile = false, isMobileSheet = false }: SearchHeaderProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    useEffect(() => {
        const performSearch = async () => {
            if (debouncedSearchTerm.trim() === "") {
                setFilteredProducts([])
                setShowResults(false)
                return
            }

            setIsSearching(true)
            setShowResults(true)
            try {
                const results = await searchProducts(debouncedSearchTerm)
                interface SearchResult {
                    productId: string
                    productName: string
                    Brand: string
                    price: number
                    productImages: string[]
                    sectionType: string
                    spotlightType: string
                    discount?: number
                    ChandelierLightingType: string
                    hNumber: number
                    maximumWattage: string
                    lampBase: string
                    mainMaterial: string
                    beamAngle: string
                }

                const formattedResults: Product[] = (results as SearchResult[]).map(
                    (product: SearchResult): Product => ({
                        ...product,
                        ProductId: product.productId,
                        discount: product.discount || 0,
                    }),
                )

                setFilteredProducts(formattedResults)
            } catch (error) {
                console.error("Error searching products:", error)
                setFilteredProducts([])
            } finally {
                setIsSearching(false)
            }
        }

        performSearch()
    }, [debouncedSearchTerm])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        if (e.target.value.trim() !== "") {
            setShowResults(true)
        }
    }

    const handleInputFocus = () => {
        if (searchTerm.trim() !== "") {
            setShowResults(true)
        }
    }

    const handleResultClick = () => {
        setShowResults(false)
    }

    if (isMobile && !isMobileSheet) {
        return (
            <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent" aria-label="Search products">
                <Search className="h-5 w-5" />
            </Button>
        )
    }

    if (isMobileSheet) {
        return (
            <div className="relative" ref={searchRef}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search products..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                    />
                </div>
                {showResults && (
                    <div className="absolute top-full left-0 right-0 z-50 bg-background border border-border rounded-lg shadow-lg mt-2">
                        <div className="max-h-96 overflow-hidden">
                            {isSearching && (
                                <div className="flex items-center justify-center p-8">
                                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                    <span>Searching...</span>
                                </div>
                            )}
                            {!isSearching && searchTerm && filteredProducts.length === 0 && (
                                <div className="p-8 text-center text-muted-foreground">No products found for &quot;{searchTerm}&quot;</div>
                            )}
                            {filteredProducts.length > 0 && (
                                <ScrollArea className="relative h-96 overflow-auto">
                                    <div className="p-4">
                                        <div className="space-y-4">
                                            {filteredProducts.slice(0, 6).map((product) => (
                                                <Link
                                                    key={product.productId}
                                                    href={`/category/${product.Brand}/${product.sectionType}/${product.spotlightType}/${product.productId}`}
                                                    onClick={handleResultClick}
                                                    className="block hover:bg-muted/70 rounded-lg p-3 transition-colors"
                                                >
                                                    <div className="flex items-start space-x-4">
                                                        {product.productImages && product.productImages[0] && (
                                                            <Image
                                                                src={product.productImages[0] || "/placeholder.svg"}
                                                                alt={product.productName}
                                                                className="object-cover rounded md:w-20 md:h-20 w-16 h-16 flex-shrink-0"
                                                                width={80}
                                                                height={80}
                                                            />
                                                        )}
                                                        <div className="flex-1 space-y-1 min-w-0">
                                                            <p className="font-medium uppercase lg:text-base md:text-sm text-sm line-clamp-2">
                                                                {product.productName}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {product.Brand} • {product.spotlightType}
                                                            </p>
                                                            <div className="flex items-center space-x-2">
                                                                {product.discount > 0 ? (
                                                                    <div className="flex items-center space-x-2">
                                                                        <span className="text-sm text-destructive font-semibold">
                                                                            <DiscountPrice
                                                                                price={product.price}
                                                                                discount={product.discount}
                                                                                sectionType={product.sectionType}
                                                                            />
                                                                        </span>
                                                                        <s className="text-gray-500 italic text-xs">
                                                                            <NormalPrice price={product.price} sectionType={product.sectionType} />
                                                                        </s>
                                                                    </div>
                                                                ) : (
                                                                    <span className="font-semibold text-sm">
                                                                        <NormalPrice price={product.price} sectionType={product.sectionType} />
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        {filteredProducts.length > 6 && (
                                            <div className="text-center mt-4 text-sm text-muted-foreground border-t pt-4">
                                                Showing 6 of {filteredProducts.length} results
                                                <Link
                                                    href={`/search?q=${encodeURIComponent(searchTerm)}`}
                                                    onClick={handleResultClick}
                                                    className="block mt-2"
                                                >
                                                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                                                        View All Results
                                                    </Button>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </ScrollArea>
                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    }
    return (
        <div className="relative" ref={searchRef}>
            <div className="relative w-80 ">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-10 w-full bg-background"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                />
            </div>
            {showResults && (
                <div className="absolute top-full left-0 right-0 z-50 bg-background border border-border rounded-lg shadow-lg mt-2">
                    <div className="max-h-96 overflow-hidden">
                        {isSearching && (
                            <div className="flex items-center justify-center p-8">
                                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                <span>Searching...</span>
                            </div>
                        )}
                        {!isSearching && searchTerm && filteredProducts.length === 0 && (
                            <div className="p-8 text-center text-muted-foreground">No products found for &quot;{searchTerm}&quot;</div>
                        )}
                        {filteredProducts.length > 0 && (
                            <ScrollArea className="relative h-96 overflow-auto">
                                <div className="p-4">
                                    <div className="space-y-4">
                                        {filteredProducts.slice(0, 6).map((product) => (
                                            <Link
                                                key={product.productId}
                                                href={`/category/${product.Brand}/${product.sectionType}/${product.spotlightType}/${product.productId}`}
                                                onClick={handleResultClick}
                                                className="block hover:bg-accent/50 rounded-lg p-3 transition-colors"
                                            >
                                                <div className="flex items-start space-x-4">
                                                    {product.productImages && product.productImages[0] && (
                                                        <Image
                                                            src={product.productImages[0] || "/placeholder.svg"}
                                                            alt={product.productName}
                                                            className="object-cover rounded w-16 h-16 flex-shrink-0"
                                                            width={40}
                                                            height={40}
                                                        />
                                                    )}
                                                    <div className="flex-1 space-y-1 min-w-0">
                                                        <p className="font-medium uppercase text-sm line-clamp-2">
                                                            {product.productName}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {product.Brand} • {product.spotlightType}
                                                        </p>
                                                        <div className="flex items-center space-x-2">
                                                            {product.discount > 0 ? (
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="text-sm text-destructive font-semibold">
                                                                        <DiscountPrice
                                                                            price={product.price}
                                                                            discount={product.discount}
                                                                            sectionType={product.sectionType}
                                                                        />
                                                                    </span>
                                                                    <s className="text-gray-500 italic text-xs">
                                                                        <NormalPrice price={product.price} sectionType={product.sectionType} />
                                                                    </s>
                                                                </div>
                                                            ) : (
                                                                <span className="font-semibold text-sm">
                                                                    <NormalPrice price={product.price} sectionType={product.sectionType} />
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    {filteredProducts.length > 6 && (
                                        <div className="text-center mt-4 text-sm text-muted-foreground border-t pt-4">
                                            Showing 6 of {filteredProducts.length} results
                                            <Link
                                                href={`/search?q=${encodeURIComponent(searchTerm)}`}
                                                onClick={handleResultClick}
                                                className="block mt-2"
                                            >
                                                <Button variant="outline" size="sm" className="w-full bg-transparent">
                                                    View All Results
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
