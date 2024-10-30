// 'use client'

// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { Clock, ShoppingBag, X } from "lucide-react"
// import { useEffect, useState } from 'react'

// export default function WhiteFridayBox() {
//     const [isOpen, setIsOpen] = useState(false)
//     const [timeLeft, setTimeLeft] = useState('')

//     useEffect(() => {
//         const hasSeenDialog = localStorage.getItem('hasSeenWhiteFridayDialog')
//         if (!hasSeenDialog) {
//             setIsOpen(true)
//             localStorage.setItem('hasSeenWhiteFridayDialog', 'true')
//         }

//         const endDate = new Date('2023-11-24T23:59:59').getTime()
//         const timer = setInterval(() => {
//             const now = new Date().getTime()
//             const distance = endDate - now
//             const days = Math.floor(distance / (1000 * 60 * 60 * 24))
//             const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
//             const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
//             setTimeLeft(`${days}d ${hours}h ${minutes}m`)
//             if (distance < 0) {
//                 clearInterval(timer)
//                 setTimeLeft('العرض انتهى')
//             }
//         }, 1000)

//         return () => clearInterval(timer)
//     }, [])

//     return (
//         <Dialog open={isOpen} onOpenChange={setIsOpen}>
//             <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-card text-card-foreground rounded-lg">
//                 <DialogHeader className="p-6 pb-0 relative">
//                     <DialogTitle className="text-2xl font-semibold text-center text-primary-foreground">
//                         🎉 خصم 30% لفترة محدودة!
//                     </DialogTitle>
//                     <Button
//                         className="absolute right-4 top-4 rounded-full p-1.5 bg-muted hover:bg-muted-foreground transition-colors"
//                         onClick={() => setIsOpen(false)}
//                         variant="ghost"
//                     >
//                         <X className="h-5 w-5 text-card-foreground" />
//                         <span className="sr-only">إغلاق</span>
//                     </Button>
//                 </DialogHeader>
//                 <div className="relative">
//                     <img
//                         src="/placeholder.svg?height=250&width=500"
//                         alt="عرض الجمعة البيضاء"
//                         className="w-full h-auto object-cover"
//                     />
//                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                         <p className="text-4xl font-bold text-primary-foreground bg-destructive px-6 py-2 rounded-lg shadow-lg">
//                             خصم حتى 30٪!
//                         </p>
//                     </div>
//                 </div>
//                 <div className="p-6">
//                     <DialogDescription className="text-center text-muted-foreground mb-4">
//                         لا تفوت فرصة الحصول على خصم 30% على منتجاتك المفضلة. تسوق الآن!
//                     </DialogDescription>
//                     <div className="flex items-center justify-center mb-6 space-x-2">
//                         <Clock className="h-5 w-5 text-primary" />
//                         <span className="text-primary font-semibold">{timeLeft}</span>
//                     </div>
//                     <DialogFooter className="flex flex-col sm:flex-row gap-4">
//                         <Button
//                             onClick={() => setIsOpen(false)}
//                             className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent-foreground transition-colors"
//                         >
//                             تصفح العروض
//                         </Button>
//                         <Button
//                             onClick={() => setIsOpen(false)}
//                             className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary-foreground transition-colors"
//                         >
//                             <ShoppingBag className="mr-2 h-5 w-5" />
//                             تسوق الآن
//                         </Button>
//                     </DialogFooter>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     )
// }
