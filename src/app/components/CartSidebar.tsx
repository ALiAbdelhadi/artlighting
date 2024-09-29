'use client'

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"
import { SignUpButton, useAuth } from "@clerk/nextjs"
import { ShoppingCartIcon, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from "next/link"
import { useEffect, useState } from 'react'
import DiscountPrice from '../helpers/DiscountPrice'
import NormalPrice from '../helpers/NormalPrice'
interface CartItem {
    id: string
    productId: string
    productName: string
    quantity: number
    productImages: string[]
    discount: number
    price: number
    Brand: string
    sectionType: string
    spotlightType: string
    totalPrice: number
}

export function CartSidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const { isSignedIn, userId } = useAuth()
    const { toast } = useToast()
    useEffect(() => {
        const fetchCartItems = async () => {
            if (!isSignedIn || !userId) return
            try {
                const response = await fetch(`/api/cart`)
                if (response.ok) {
                    const items = await response.json()
                    setCartItems(items)
                } else {
                    console.error('Failed to fetch cart items')
                }
            } catch (error) {
                console.error('Error fetching cart items:', error)
            }
        }
        if (isOpen) {
            fetchCartItems()
        }
    }, [isOpen, isSignedIn, userId])
    const removeItem = async (itemId: string) => {
        try {
            const response = await fetch('/api/cart', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ itemId }),
            })
            if (response.ok) {
                setCartItems(prevItems => prevItems.filter(item => item.id !== itemId))
                toast({
                    title: "Item removed",
                    description: "The item has been removed from your cart.",
                })
            } else {
                throw new Error('Failed to remove item')
            }
        } catch (error) {
            console.error('Error removing item:', error)
            toast({
                title: "Error",
                description: "Failed to remove item. Please try again.",
                variant: "destructive",
            })
        }
    }
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <ShoppingCartIcon className="h-6 w-6" />
                    {cartItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full inline-flex h-5 w-5 items-center justify-center text-xs font-medium">
                            {cartItems.length}
                        </span>
                    )}
                    <span className="sr-only">Open Cart</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-lg z-50">
                <SheetHeader className="border-b pb-4 -mb-4 ">
                    <SheetTitle className="sm:text-2xl text-xl font-bold">Your Cart</SheetTitle>
                </SheetHeader>
                <div className="flex-grow overflow-y-auto">
                    {isSignedIn ? (
                        cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <div key={item.id} className="flex justify-between items-start py-4 border-b">
                                    <div className="flex items-start space-x-4">
                                        {item.productImages && item.productImages[0] && (
                                            <Image src={item.productImages[0]} alt={item.productName} width={70} height={70} className="object-cover rounded" />
                                        )}
                                        <div className="space-y-1">
                                            <p className="font-medium text-lg ">{item.productName}</p>
                                            <div className="mb-0.5">
                                                {item.discount > 0 ? (
                                                    <div className="flex items-center">
                                                        <span className="text-sm text-destructive font-semibold">
                                                            <DiscountPrice price={item.price} discount={item.discount} />
                                                        </span>
                                                        <s className="text-gray-500 font-semibold ml-1.5 text-xs">
                                                            <NormalPrice price={item.price} />
                                                        </s>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center">
                                                        <span className="font-semibold text-sm">
                                                            <NormalPrice price={item.price} />
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Link href={`/category/${item.Brand}/${item.sectionType}/${item.spotlightType}/${item.productId}`}>
                                            <Button variant="link" size="sm">
                                                View Product
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full">
                                <ShoppingCartIcon className="h-16 w-16 text-gray-400 mb-4" />
                                <p className="text-xl font-medium mb-2">Your cart is empty</p>
                                <p className="text-gray-500 mb-4">Add some items to your cart to get started</p>
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                            <ShoppingCartIcon className="h-16 w-16 text-gray-400 mb-4" />
                            <p className="text-xl font-medium mb-2">Sign in to view your cart</p>
                            <p className="text-gray-500 mb-4">Please sign in to access your cart and start shopping</p>
                            <SignUpButton mode="modal">
                                <Button variant="default">
                                    Sign Up
                                </Button>
                            </SignUpButton>
                        </div>
                    )
                    }
                </div>
            </SheetContent>
        </Sheet>
    )
}