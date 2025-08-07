"use client"

import { SignUpButton, useAuth } from "@clerk/nextjs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@repo/ui/button"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Loader2, Minus, Plus, ShoppingBag, ShoppingCartIcon, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import DiscountPrice from "./discount-price"
import NormalPrice from "./normal-price"

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
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const { isSignedIn, userId } = useAuth()

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!isSignedIn || !userId) return

      setIsLoading(true)
      try {
        const response = await fetch(`/api/cart`)
        if (response.ok) {
          const items = await response.json()
          setCartItems(items)
        } else {
          const errorData = await response.json()
          console.error("Failed to fetch cart items:", errorData)
          toast.error("Failed to load cart items")
        }
      } catch (error) {
        console.error("Error fetching cart items:", error)
        toast.error("Error loading cart")
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      fetchCartItems()
    }
  }, [isOpen, isSignedIn, userId])

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    // Optimistic update
    const previousItems = [...cartItems]
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity * (1 - item.discount) }
          : item,
      ),
    )

    setIsUpdating(itemId)
    try {
      const response = await fetch("/api/cart", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      })

      if (response.ok) {
        const updatedItem = await response.json()
        // Update with server response
        setCartItems((prevItems) => prevItems.map((item) => (item.id === itemId ? updatedItem : item)))
        // Update localStorage for this specific item
        localStorage.setItem(`quantity-${itemId}`, newQuantity.toString())
        toast.success("Quantity updated")
      } else {
        // Revert optimistic update on error
        setCartItems(previousItems)
        const errorData = await response.json()
        console.error("Failed to update quantity:", errorData)
        toast.error(errorData.error || "Failed to update quantity")
      }
    } catch (error) {
      // Revert optimistic update on error
      setCartItems(previousItems)
      console.error("Error updating quantity:", error)
      toast.error("Failed to update quantity")
    } finally {
      setIsUpdating(null)
    }
  }

  const removeItem = async (itemId: string) => {
    // Optimistic update
    const previousItems = [...cartItems]
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId))

    setIsUpdating(itemId)
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      })

      if (response.ok) {
        // Remove from localStorage
        localStorage.removeItem(`quantity-${itemId}`)
        toast.success("Item removed from cart successfully.")
      } else {
        // Revert optimistic update on error
        setCartItems(previousItems)
        const errorData = await response.json()
        console.error("Failed to remove item:", errorData)
        toast.error(errorData.error || "Failed to remove item")
      }
    } catch (error) {
      // Revert optimistic update on error
      setCartItems(previousItems)
      console.error("Error removing item:", error)
      toast.error("Failed to remove item. Please try again.")
    } finally {
      setIsUpdating(null)
    }
  }

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-9 w-9 border-border">
          <ShoppingCartIcon className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs font-medium"
            >
              {totalItems > 99 ? "99+" : totalItems}
            </Badge>
          )}
          <span className="sr-only">Open Cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg z-50">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart
            {totalItems > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-hidden flex flex-col">
          {!isSignedIn ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <ShoppingCartIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sign in to view your cart</h3>
              <p className="text-muted-foreground mb-6">Please sign in to access your cart and start shopping</p>
              <SignUpButton mode="modal">
                <Button size="lg" className="w-full max-w-xs">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          ) : isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <ShoppingCartIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">Add some items to your cart to get started</p>
              <SheetClose asChild>
                <Button variant="outline" size="lg" className="w-full max-w-xs bg-transparent">
                  Continue Shopping
                </Button>
              </SheetClose>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-1">
                <div className="space-y-4 py-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="group relative">
                      <div className="flex gap-4 px-3 pb-3 border-b border-border">
                        <div className="relative flex-shrink-0">
                          {item.productImages && item.productImages[0] && (
                            <Image
                              src={item.productImages[0]}
                              alt={item.productName}
                              className="object-cover rounded-md"
                              width={80}
                              height={80}
                            />
                          )}
                          {item.discount > 0 && (
                            <Badge variant="destructive" className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5">
                              -{Math.round(item.discount * 100)}%
                            </Badge>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm leading-tight line-clamp-2">{item.productName}</h4>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeItem(item.id)}
                              disabled={isUpdating === item.id}
                            >
                              {isUpdating === item.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <div className="mb-3">
                            {item.discount > 0 ? (
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-destructive">
                                  <DiscountPrice
                                    price={item.price}
                                    discount={item.discount}
                                    quantity={item.quantity}
                                    sectionType={item.sectionType}
                                  />
                                </span>
                                <span className="text-xs text-muted-foreground line-through">
                                  <NormalPrice
                                    price={item.price}
                                    quantity={item.quantity}
                                    sectionType={item.sectionType}
                                  />
                                </span>
                              </div>
                            ) : (
                              <span className="font-semibold">
                                <NormalPrice
                                  price={item.price}
                                  quantity={item.quantity}
                                  sectionType={item.sectionType}
                                />
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border rounded-md">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || isUpdating === item.id}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={isUpdating === item.id}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <SheetClose asChild className="flex items-end justify-center gap-2">
                              <div>
                                <Link
                                  href={`/category/${item.Brand}/${item.sectionType}/${item.spotlightType}/${item.productId}`}
                                  className="text-xs text-foreground"
                                >
                                  View Details
                                </Link>
                                <Link
                                  href={`/preview/${item.productId}`}
                                  className="text-sm underline text-primary hover:text-primary/80"
                                >
                                  Order now
                                </Link>
                              </div>
                            </SheetClose>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* <div className="border-t bg-muted/30 p-4 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatPrice(subtotal)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span>Shipping Cost</span>
                    <NormalPrice price={shippingCost} />
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span className="font-semibold text-destructive">{formatPrice(total)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handleProceedToCheckout}
                    disabled={isCheckingOut || cartItems.length === 0}
                  >
                    {isCheckingOut ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Order...
                      </>
                    ) : (
                      <>
                        Proceed to Checkout
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <SheetClose asChild>
                    <Button variant="outline" size="lg" className="w-full bg-transparent">
                      Continue Shopping
                    </Button>
                  </SheetClose>
                </div>
              </div> */}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
