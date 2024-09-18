'use client'

import React, { useState } from "react"
import { X, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ResponsiveDiscountBanner() {
    const [isBannerVisible, setIsBannerVisible] = useState(true)

    const handleClose = () => {
        setIsBannerVisible(false)
    }

    if (!isBannerVisible) {
        return null
    }

    return (
        <div className="bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 text-amber-900 dark:text-amber-100">
            <div className="container mx-auto px-4 py-3 flex flex-col items-center justify-between relative sm:flex-row sm:py-4">
                <div className="flex items-center mb-2 sm:mb-0">
                    <Lightbulb className="w-4 h-4 mr-2 animate-pulse sm:w-5 sm:h-5" />
                    <h2 className="text-lg font-bold sm:text-xl md:text-2xl">Chandelier Sale!</h2>
                </div>
                <div className="text-center sm:text-right">
                    <p className="text-sm font-semibold mb-1 sm:text-base md:text-lg">
                        Illuminate Your Space for Less
                    </p>
                    <p className="text-xl font-bold animate-bounce sm:text-2xl md:text-3xl">
                        20% OFF
                    </p>
                    <p className="text-xs mt-1 sm:text-sm">On All Chandelier Products</p>
                </div>
                <Button
                    onClick={handleClose}
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 text-primary-foreground hover:text-secondary transition-colors duration-300 sm:top-2 sm:right-2"
                    aria-label="Close banner"
                >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
            </div>
        </div>
    )
}
