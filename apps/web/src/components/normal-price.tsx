"use client"

import { formatNumberWithConversion } from "@/lib/numbers"
import { cn } from "@/lib/utils"
import { useLocale } from "next-intl"

type ProductPrices = {
  price: number
  quantity?: number
  shippingPrice?: number
  sectionType?: string
  className?: string
}

export default function NormalPrice({ price, quantity = 1, shippingPrice = 0, className }: ProductPrices) {
  const locale = useLocale()

  const normalPrice = price
  const PriceAfterTimesQuantity = normalPrice * quantity + shippingPrice
  const formattedTotalPrice = formatNumberWithConversion(Math.ceil(PriceAfterTimesQuantity), locale)

  return (
    <div>
      <p className={cn("", className)}>{formattedTotalPrice}</p>
    </div>
  )
}
