"use client"

import { formatNumberWithConversion } from "@/lib/utils"
import { useLocale } from "next-intl"

type RoundingMode = "round" | "ceil" | "floor"

interface DiscountPriceProps {
  price: number // السعر الأساسي للمنتج
  discount?: number // نسبة الخصم (0.1 = 10% أو 10 = 10%)
  quantity?: number // الكمية
  shippingPrice?: number // سعر الشحن
  sectionType?: string
  priceIncrease?: number // زيادة IP
  lampPriceIncrease?: number // زيادة المصابيح
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

  // تطبيع نسبة الخصم (إذا كانت أكبر من 1، فهي بالنسبة المئوية)
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
  const formattedOriginalUnit = formatNumberWithConversion(
    applyRounding(price, roundingMode),
    locale
  )

  return (
    <div className="flex flex-col gap-1">
      <p className="font-semibold text-destructive">
        {formattedFinal}
      </p>
    </div>
  )
}
