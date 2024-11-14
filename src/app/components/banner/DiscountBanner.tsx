'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Clock, X, Zap, ShoppingBag } from "lucide-react"
import Container from "../Container"

const END_DATE = new Date('2024-11-30T23:59:59').getTime()

function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

    function calculateTimeLeft() {
        const difference = END_DATE - new Date().getTime()
        let timeLeft = {}

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            }
        }

        return timeLeft
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    return (
        <div className="flex justify-center items-center space-x-3 text-white">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center bg-gray-700 rounded-lg p-2 w-14">
                    <span className="text-xl font-bold">{value.toString().padStart(2, '0')}</span>
                    <span className="text-xs uppercase">{unit}</span>
                </div>
            ))}
        </div>
    )
}

export default function WhiteFridayBanner() {
    const [isBannerVisible, setIsBannerVisible] = useState(true)

    const handleClose = () => {
        setIsBannerVisible(false)
    }

    if (!isBannerVisible) return null

    return (
        <div className="bg-gradient-to-r from-gray-950 via-gray-900 to-black text-white shadow-lg relative overflow-hidden" aria-hidden="true" role="banner">
            <Container>
                <div className="flex flex-col md:flex-row justify-between items-center py-6 px-4 md:px-0">
                    <div className="flex items-center space-x-3 mb-4 md:mb-0">
                        <h2 className="text-xl md:text-2xl font-bold">White Friday Illumination!</h2>
                    </div>
                    <div className="flex flex-col items-center md:items-end space-y-4">
                        <p className="font-bold flex items-center flex-wrap justify-center md:justify-end">
                            <span className="mr-2 inline-block animate-bounce text-lg md:text-xl lg:text-2xl text-primary">Up to 50% OFF</span>
                            <span className="text-base md:text-lg font-semibold">Chandelier Products</span>
                        </p>
                        <CountdownTimer />
                        <div className="flex items-center space-x-2 text-sm md:text-base">
                            <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                            <span>Limited Time Offer | Online & In-Store</span>
                        </div>
                    </div>
                </div>
            </Container>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-primary rounded-full opacity-10 animate-ping" />
                <div className="absolute bottom-1/4 right-1/3 w-8 h-8 bg-primary rounded-full opacity-10 animate-ping animation-delay-1000" />
            </div>
            <Button
                onClick={handleClose}
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-gray-300 hover:text-white transition-colors duration-300"
                aria-label="Close banner"
            >
                <X className="w-5 h-5" />
            </Button>
        </div>
    )
}