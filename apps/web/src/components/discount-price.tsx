"use client"

import { formatNumberWithConversion } from "@/lib/numbers"
import { useLocale } from "next-intl"

type RoundingMode = "round" | "ceil" | "floor"

interface DiscountPriceProps {
  price: number
  discount?: number 
  quantity?: number 
  shippingPrice?: number 
  sectionType?: string
  priceIncrease?: number 
  lampPriceIncrease?: number
  roundingMode?: RoundingMode
}

export default function DiscountPrice({
  price,
  discount = 0,
  quantity = 1,
  shippingPrice = 0,
  priceIncrease = 0,
  lampPriceIncrease = 0,
  sectionType,
  roundingMode = "ceil",
}: DiscountPriceProps) {
  const locale = useLocale()

  const normalizedDiscount = discount > 1 ? discount / 100 : discount

  const applyRounding = (v: number, mode: RoundingMode) => {
    if (mode === "ceil") return Math.ceil(v)
    if (mode === "floor") return Math.floor(v)
    return Math.round(v)
  }

  const discountedBaseRaw = price * (1 - normalizedDiscount)
  const discountedBase = applyRounding(discountedBaseRaw, roundingMode)
  const unitPriceWithIncreases = discountedBase + priceIncrease + lampPriceIncrease

  const itemsTotal = unitPriceWithIncreases * Math.max(1, quantity)

  const shipping = applyRounding(shippingPrice, roundingMode)
  const finalTotal = itemsTotal + shipping

  const formattedFinal = formatNumberWithConversion(finalTotal, locale)

  return (
    <div className="flex flex-col gap-1">
      <p className="font-semibold text-destructive">
        {formattedFinal}
      </p>
    </div>
  )
}
