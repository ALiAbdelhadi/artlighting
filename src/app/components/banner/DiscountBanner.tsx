'use client'

import { Button } from "@/components/ui/button"
import { Clock, ShoppingBag, X } from "lucide-react"
import { useState } from "react"
import Container from "../Container"

export default function ResponsiveDiscountBanner() {
    const [isBannerVisible, setIsBannerVisible] = useState(true)

    const handleClose = () => {
        setIsBannerVisible(false)
    }

    if (!isBannerVisible) return null

    return (
        <div className="bg-gradient-to-r from-amber-100 via-amber-200 to-primary text-amber-900 shadow-md relative">
            <Container>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center py-4">
                    <div className="flex items-center space-x-3">
                        <h2 className="text-base sm:text-lg font-bold">Chandelier Sale!</h2>
                    </div>
                    <div className="flex flex-col sm:items-end space-y-2 sm:space-y-0">
                        <p className="text-lg sm:text-xl font-bold">
                            <span className="mr-2 inline-block animate-bounce">20% OFF</span>
                            <span className="text-sm sm:text-base font-semibold">All Chandeliers</span>
                        </p>
                        <div className="flex justify-center sm:justify-end space-x-6 text-sm">
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1 text-amber-700 " />
                                <span>Online & In-Store</span>
                            </div>
                        </div>
                    </div>
                </div>
            <Button
                onClick={handleClose}
                variant="ghost"
                size="icon"
                className="absolute  text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors duration-300"
                aria-label="Close banner"
            >
                <X className="w-5 h-5" />
            </Button>
            </Container>
        </div>
    )
}
