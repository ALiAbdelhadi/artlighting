"use client"

import { formatNumberWithConversion } from "@/lib/utils"
import { useLocale } from "next-intl"

interface DiscountPriceProps {
  price: number
  discount: number
  quantity?: number
  shippingPrice?: number
  sectionType?: string
  priceIncrease?: number
}

export default function DiscountPrice({
  price,
  discount,
  quantity = 1,
  shippingPrice = 0,
  priceIncrease = 0,
  sectionType
}: DiscountPriceProps) {
  const locale = useLocale()
  const discountedBasePrice = price * (1 - discount)
  const discountedPriceIncrease = priceIncrease 
  const totalDiscountedPrice = discountedBasePrice + discountedPriceIncrease
  const totalItemsPrice = totalDiscountedPrice * quantity
  const finalPrice = totalItemsPrice + shippingPrice
  const formattedPrice = formatNumberWithConversion(Math.ceil(finalPrice), locale)

  return (
    <div>
      <p className="text-destructive font-semibold">{formattedPrice}</p>
    </div>
  )
}