"use client"

import { QuantitySelector } from "@/components/quantity-selector"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SignUpButton, useAuth } from "@clerk/nextjs"
import { Button } from "@repo/ui/button"
import { Loader2, ShoppingBag, ShoppingCartIcon, Trash2, XIcon } from "lucide-react"
import { useTranslations } from "next-intl"
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
  brand: string
  sectionType: string
  spotlightType: string
  totalPrice: number
}

export function CartSidebar() {
  const t = useTranslations('cart')
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
          toast.error(t('messages.failedToLoad'))
        }
      } catch (error) {
        console.error("Error fetching cart items:", error)
        toast.error(t('messages.errorLoading'))
      } finally {
        setIsLoading(false)
      }
    }

    if (isOpen) {
      fetchCartItems()
    }
  }, [isOpen, isSignedIn, userId, t])

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    const previousItems = [...cartItems]
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity * (1 - item.discount / 100) }
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
        setCartItems((prevItems) => prevItems.map((item) => (item.id === itemId ? updatedItem : item)))
        localStorage.setItem(`quantity-${itemId}`, newQuantity.toString())
        toast.success(t('messages.quantityUpdated'))
      } else {
        setCartItems(previousItems)
        const errorData = await response.json()
        console.error("Failed to update quantity:", errorData)
        toast.error(errorData.error || t('messages.failedToUpdate'))
      }
    } catch (error) {
      setCartItems(previousItems)
      console.error("Error updating quantity:", error)
      toast.error(t('messages.failedToUpdate'))
    } finally {
      setIsUpdating(null)
    }
  }

  const removeItem = async (itemId: string) => {
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
        localStorage.removeItem(`quantity-${itemId}`)
        toast.success(t('messages.itemRemoved'))
      } else {
        setCartItems(previousItems)
        const errorData = await response.json()
        console.error("Failed to remove item:", errorData)
        toast.error(errorData.error || t('messages.failedToRemove'))
      }
    } catch (error) {
      setCartItems(previousItems)
      console.error("Error removing item:", error)
      toast.error(t('messages.failedToRemove'))
    } finally {
      setIsUpdating(null)
    }
  }

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-9 w-9 border-border bg-transparent">
          <ShoppingCartIcon className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs font-medium"
            >
              {totalItems > 99 ? "99+" : totalItems}
            </Badge>
          )}
          <span className="sr-only">{t('actions.openCart')}</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg z-50">
        <SheetClose asChild className="cursor-pointer">
          <button
            className="absolute right-3 rtl:left-3 top-4 rounded-full p-1.5 hover:bg-muted transition"
          >
            <XIcon className="size-5" />
          </button>
        </SheetClose>
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold">
            <ShoppingBag className="h-5 w-5" />
            {t('title')}
            {totalItems > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {totalItems} {totalItems === 1 ? t('item') : t('items')}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-hidden flex flex-col">
          {!isSignedIn ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <ShoppingCartIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('signInRequired.title')}</h3>
              <p className="text-muted-foreground mb-6">{t('signInRequired.description')}</p>
              <SignUpButton mode="modal">
                <Button size="lg" className="w-full max-w-xs">
                  {t('signInRequired.signUp')}
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
              <h3 className="text-lg font-semibold mb-2">{t('emptyCart.title')}</h3>
              <p className="text-muted-foreground mb-6">{t('emptyCart.description')}</p>
              <SheetClose asChild>
                <Button variant="outline" size="lg" className="w-full max-w-xs bg-transparent">
                  {t('emptyCart.continueShopping')}
                </Button>
              </SheetClose>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-1">
                <div className="space-y-3 py-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="group relative">
                      <div className="bg-card border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex gap-4">
                          <div className="relative flex-shrink-0">
                            {item.productImages && item.productImages[0] && (
                              <Image
                                src={item.productImages[0] || "/placeholder.svg"}
                                alt={item.productName}
                                className="object-cover rounded-lg border"
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
                          <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <h4 className="font-semibold text-sm leading-tight line-clamp-2">{item.productName}</h4>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {item.brand} • <span className="uppercase">{item.spotlightType}</span>
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeItem(item.id)}
                                disabled={isUpdating === item.id}
                                title={t('actions.remove')}
                              >
                                {isUpdating === item.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                            <div className="space-y-1">
                              {item.discount > 0 ? (
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-lg text-destructive">
                                    <DiscountPrice
                                      price={item.price}
                                      discount={item.discount}
                                      quantity={item.quantity}
                                      sectionType={item.sectionType}
                                    />
                                  </span>
                                  <span className="text-sm text-muted-foreground line-through">
                                    <NormalPrice
                                      price={item.price}
                                      quantity={item.quantity}
                                      sectionType={item.sectionType}
                                    />
                                  </span>
                                </div>
                              ) : (
                                <span className="font-bold text-lg">
                                  <NormalPrice
                                    price={item.price}
                                    quantity={item.quantity}
                                    sectionType={item.sectionType}
                                  />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <QuantitySelector
                                quantity={item.quantity}
                                onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                                onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={isUpdating === item.id}
                                size="sm"
                                minQuantity={1}
                              />
                              <div className="flex items-center gap-3">
                                <SheetClose asChild>
                                  <Link
                                    href={`/category/${item.brand}/${item.sectionType}/${item.spotlightType}/${item.productId}`}
                                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    {t('actions.viewDetails')}
                                  </Link>
                                </SheetClose>
                                <SheetClose asChild>
                                  <Link
                                    href={`/preview/${item.productId}`}
                                    className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                  >
                                    {t('actions.orderNow')}
                                  </Link>
                                </SheetClose>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}