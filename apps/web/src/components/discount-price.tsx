"use client"

import { formatNumberWithConversion } from "@/lib/utils"
import { useLocale } from "next-intl"

interface DiscountPriceProps {
  price: number
  discount: number
  quantity?: number
  shippingPrice?: number
  sectionType?: string
}

export default function DiscountPrice({ price, discount, quantity = 1, shippingPrice = 0 }: DiscountPriceProps) {
  const locale = useLocale()

  const priceIncreasing = Math.ceil(price)
  const discountedPrice = Math.ceil(priceIncreasing * (1 - discount))

  const formattedPrice = formatNumberWithConversion(discountedPrice * quantity + shippingPrice, locale)

  return (
    <div>
      <p className="text-destructive font-semibold">{formattedPrice}</p>
    </div>
  )
}
