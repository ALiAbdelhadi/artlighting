"use client"

import { formatNumberWithConversion } from "@/lib/utils"
import { useLocale } from "next-intl"

type ProductPrices = {
  price: number
  quantity?: number
  shippingPrice?: number
  sectionType?: string
}

export default function NormalPrice({ price, quantity = 1, shippingPrice = 0 }: ProductPrices) {
  const locale = useLocale()

  const normalPrice = Math.ceil(price)
  const PriceAfterTimesQuantity = normalPrice * quantity + shippingPrice

  const formattedTotalPrice = formatNumberWithConversion(PriceAfterTimesQuantity, locale)

  return (
    <div>
      <p>{formattedTotalPrice}</p>
    </div>
  )
}
