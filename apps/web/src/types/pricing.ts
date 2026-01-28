export interface PricingBreakdown {
    basePrice: number
    priceIncrease: number
    lampPriceIncrease: number
    subtotalBeforeDiscount: number
    discount: number
    discountAmount: number
    unitPriceAfterDiscount: number
    quantity: number
    totalBeforeShipping: number
    shippingPrice: number
    finalTotal: number
}

export interface PriceCalculation {
    basePrice: number
    priceIncrease: number
    lampPriceIncrease: number
    subtotal: number
    discount: number
    discountAmount: number
    totalBeforeShipping: number
    shippingPrice: number
    finalTotal: number
    unitPriceAfterDiscount: number
}

