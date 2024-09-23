'use client'

import { Button } from "@/components/ui/button"
import { Clock, X } from "lucide-react"
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
                <div className="flex flex-col sm:flex-row justify-between items-center py-4 px-4 sm:px-0">
                    <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                        <h2 className="text-base sm:text-lg md:text-xl font-bold">Chandelier Sale!</h2>
                    </div>
                    <div className="flex flex-col items-center sm:items-end space-y-2">
                        <p className="font-bold flex items-center flex-wrap justify-center sm:justify-end">
                            <span className="mr-2 inline-block animate-bounce text-base sm:text-lg md:text-xl lg:text-2xl">20% OFF</span>
                            <span className="text-sm sm:text-base md:text-lg font-semibold">All Chandeliers</span>
                        </p>
                        <div className="flex items-center space-x-2 text-xs sm:text-sm">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-amber-700" />
                            <span>Online & In-Store</span>
                        </div>
                    </div>
                </div>
            </Container>
            <Button
                onClick={handleClose}
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 sm:top-2 sm:right-2 text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-colors duration-300"
                aria-label="Close banner"
            >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
        </div>
    )
}