'use client'

import Container from "@/app/components/Container"
import ProductCard from "@/app/components/ProductCard/ProductCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { CalendarDays, Clock, Send, Share2 } from 'lucide-react'
import Link from "next/link"
import { useState } from 'react'

export default function Component() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
    const [selectedCity, setSelectedCity] = useState("Cairo")
    const prayerTimes = {
        Cairo: {
            fajr: "04:45",
            dhuhr: "12:23",
            asr: "15:47",
            maghrib: "18:38",
            isha: "19:52"
        },
        abudhabi: {
            fajr: "04:47",
            dhuhr: "12:25",
            asr: "15:49",
            maghrib: "18:40",
            isha: "19:54"
        }
    }

    const eventTimeline = [
        { time: "18:00", event: "Doors Open" },
        { time: "18:30", event: "Welcome Speech" },
        { time: "19:00", event: "Maghrib Prayer" },
        { time: "19:15", event: "Iftar Begins" },
        { time: "20:00", event: "Company Employee Awards" },
        { time: "20:30", event: "Company Employee Awards" },
        { time: "21:00", event: "Awards to our customers" },
        { time: "21:30", event: "Closing Remarks" }
    ]

    return (
        <div className=" min-h-screen">
            <Container className="py-12">
                {/* Hero Section */}
                <section className="text-center mb-16 mt-10 py-20 px-4 relative overflow-hidden rounded-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-[hsl(37,95%,45%)] via-[hsl(37,40%,88%)] to-[hsl(37,60%,80%)] opacity-90"></div>
                    <div className="relative z-10 max-w-4xl mx-auto">
                        <h1 className="text-6xl font-extrabold mb-6 text-black">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-black to-[hsl(37,20%,15%)]">
                                14th Annual Ramadan Iftar
                            </span>
                        </h1>
                        <p className="text-2xl text-[hsl(37,20%,15%)] mb-8 font-medium">
                            Join us for a night of community, reflection, and celebration
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href={"#Registration"} className="text-lg px-8 py-2 bg-[hsl(37,95%,45%)] hover:bg-[hsl(37,95%,40%)] text-white flex items-center">
                                Register Now
                            </Link>
                            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white bg-opacity-50 hover:bg-opacity-70 text-[hsl(37,20%,15%)]">
                                <CalendarDays className="mr-2 h-5 w-5" />
                                Event Details
                            </Button>
                        </div>
                    </div>
                </section>
                {/* Ramadan Products */}
                <section className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8 text-center">Ramadan Special Offers</h2>
                    <Carousel className="w-full max-w-4xl mx-auto">
                        <CarouselContent>
                            <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                                {/* <ProductCard product={undefined} /> */}
                            </CarouselItem>
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </section>
                {/* Ramadan Timetable */}
                <section className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8 text-center">Ramadan Timetable</h2>
                    <Card className="max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle>Prayer Times</CardTitle>
                            <CardDescription>Select your city for accurate timings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center mb-6">
                                <Select value={selectedCity} onValueChange={setSelectedCity}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a city" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Cairo">Cairo</SelectItem>
                                        <SelectItem value="abudhabi">Abu Dhabi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                {Object.entries(prayerTimes[selectedCity as keyof typeof prayerTimes]).map(([prayer, time]) => (
                                    <div key={prayer} className="flex justify-between items-center bg-muted p-4 rounded-lg">
                                        <span className="capitalize font-medium">{prayer}</span>
                                        <span className="text-primary">{time}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>
                {/* Event Registration */}
                <section className="mb-16" id="Registration">
                    <h2 className="text-3xl font-semibold mb-8 text-center">Event Registration</h2>
                    <Card className="max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle>Register for the 14th Annual Ramadan Iftar</CardTitle>
                            <CardDescription>Please fill out the form below to secure your spot</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" placeholder="John Doe" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="john@example.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="guests">Number of Guests</Label>
                                    <Input id="guests" type="number" min="1" max="10" placeholder="1" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dietary">Dietary Requirements</Label>
                                    <Textarea id="dietary" placeholder="Any special dietary needs?" />
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="w-full">Select Seating</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Select Your Seat</DialogTitle>
                                            <DialogDescription>
                                                Click on an available seat to select it.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid grid-cols-5 gap-2">
                                            {Array.from({ length: 25 }).map((_, i) => (
                                                <Button key={i} variant="outline" className="w-10 h-10">
                                                    {i + 1}
                                                </Button>
                                            ))}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </form>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Register Now</Button>
                        </CardFooter>
                    </Card>
                </section>
                {/* Event Program */}
                <section className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8 text-center">Event Program</h2>
                    <Card className=" mx-auto">
                        <CardHeader>
                            <CardTitle>14th Annual Ramadan Iftar Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-4">
                                {eventTimeline.map((item, index) => (
                                    <li key={index} className="mb-10 ml-6">
                                        <span className="absolute flex items-center justify-center w-8 h-8 bg-primary rounded-full -left-4 ring-4 ring-white dark:ring-gray-900">
                                            <Clock className="w-4 h-4 text-primary-foreground" />
                                        </span>
                                        <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                            {item.event}
                                        </h3>
                                        <time className="block mb-2 text-sm font-normal leading-none text-muted-foreground">
                                            {item.time}
                                        </time>
                                    </li>
                                ))}
                            </ol>
                        </CardContent>
                    </Card>
                </section>
                {/* Live Streaming */}
                <section className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8 text-center">Live Stream</h2>
                    <Card className="max-w-4xl mx-auto">
                        <CardContent className="p-0">
                            <div className="aspect-video bg-muted flex items-center justify-center">
                                <p className="text-muted-foreground">Live stream will be available here during the event</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between p-6">
                            <Button variant="outline">
                                <Share2 className="mr-2 h-4 w-4" /> Share Stream
                            </Button>
                            <Button>Join Live Chat</Button>
                        </CardFooter>
                    </Card>
                </section>
                {/* Social Media Integration */}
                <section className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8 text-center">Join the Conversation</h2>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">Share your experience with #RamadanIftar2025</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="bg-muted aspect-square rounded-lg flex items-center justify-center shadow-inner">
                                        <p className="text-muted-foreground">Social Post {i + 1}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>
                {/* Feedback Form */}
                <section className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8 text-center">Your Feedback Matters</h2>
                    <Card className=" mx-auto">
                        <CardHeader>
                            <CardTitle>Help Us Improve</CardTitle>
                            <CardDescription>Share your thoughts on the event and suggestions for next year</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="experience">How was your experience?</Label>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select rating" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="5">Excellent</SelectItem>
                                            <SelectItem value="4">Very Good</SelectItem>
                                            <SelectItem value="3">Good</SelectItem>
                                            <SelectItem value="2">Fair</SelectItem>
                                            <SelectItem value="1">Poor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="feedback">Your Feedback</Label>
                                    <Textarea id="feedback" placeholder="Share your thoughts..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="suggestions">Suggestions for Next Year</Label>
                                    <Textarea id="suggestions" placeholder="How can we make it even better?" />
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">
                                <Send className="mr-2 h-4 w-4" /> Submit Feedback
                            </Button>
                        </CardFooter>
                    </Card>
                </section>
            </Container>
        </div>
    )
}