'use client'

import { Badge } from "@/components/ui/badge"
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog"
import { Cross2Icon } from "@radix-ui/react-icons"
import { X } from "lucide-react"
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function WhiteFridayBox() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const hasSeenDialog = localStorage.getItem('hasSeenWhiteFridayDialog')
        if (!hasSeenDialog) {
            setIsOpen(true)
            localStorage.setItem('hasSeenWhiteFridayDialog', 'true')
        }
    }, [])
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[525px] p-0 border-none">
                <div className="relative w-full">
                    <Image
                        src="/friday/white-friday.jpeg"
                        alt="White Friday sale"
                        width={525}
                        height={525}
                        className="w-full h-auto"
                    />
                    <Badge className="absolute top-4 left-4 bg-red-500 text-white sm:text-lg text-sm font-bold sm:px-3 px-2 py-1 rounded-full">
                        50% OFF
                    </Badge>
                    <DialogClose className="absolute right-4 top-4 rounded-full bg-white/90 p-2 backdrop-blur-sm transition-colors hover:bg-white/80" style={{ color: 'white' }}>
                        <Cross2Icon className="sm:h-6 sm:w-6 w-4 h-4 text-gray-950" />
                        <span className="sr-only">Close</span>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}