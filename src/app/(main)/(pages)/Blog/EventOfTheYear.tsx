"use client"

import Container from "@/app/components/Container"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface EventProps {
    targetDate: Date
    eventName: string
    eventDescription: string
    imageUrl: string
}

export default function EventOfTheYear({ targetDate, eventName, eventDescription, imageUrl }: EventProps) {
    const [timeRemaining, setTimeRemaining] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    })
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime()
            const distance = targetDate.getTime() - now
            if (distance < 0) {
                clearInterval(interval)
                return
            }
            const days = Math.floor(distance / (1000 * 60 * 60 * 24))
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((distance % (1000 * 60)) / 1000)
            setTimeRemaining({ days, hours, minutes, seconds })
        }, 1000)
        return () => clearInterval(interval)
    }, [targetDate])
    return (
        <section className="bg-gradient-to-b from-primary to-primary-foreground py-16 md:py-24">
            <Container>
                <Card className="overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <CardContent className="p-6 md:p-10">
                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                            <div className="w-full md:w-1/2">
                                <Image
                                    src={imageUrl || "/placeholder.svg?height=400&width=600"}
                                    alt={eventName}
                                    width={600}
                                    height={400}
                                    className="rounded-lg shadow-lg object-cover w-full h-[300px] md:h-[400px]"
                                />
                            </div>
                            <div className="w-full md:w-1/2 space-y-6">
                                <h2 className="text-3xl md:text-4xl font-bold text-primary">{eventName}</h2>
                                <p className="text-muted-foreground">{eventDescription}</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {Object.entries(timeRemaining).map(([unit, value]) => (
                                        <div key={unit} className="bg-primary/10 rounded-lg p-4 text-center">
                                            <div className="text-4xl md:text-5xl font-bold text-primary">{value}</div>
                                            <div className="text-sm md:text-base font-medium text-muted-foreground capitalize">{unit}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Container>
        </section>
    )
}