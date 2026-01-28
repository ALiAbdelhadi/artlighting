import { ProductChandLamp, ProductIP } from "@repo/database"

export const PRODUCT_IP_RULES: Record<
    ProductIP,
    {
        increaseOnPricePercent: number
    }
> = {
    IP20: {
        increaseOnPricePercent: 0,
    },
    IP44: {
        increaseOnPricePercent: 0.02,
    },
    IP54: {
        increaseOnPricePercent: 0.04,
    },
    IP65: {
        increaseOnPricePercent: 0.06,
    },
    IP68: {
        increaseOnPricePercent: 0.08,
    },
}

export const PRODUCT_CHAND_LAMP_RULES: Record<
    ProductChandLamp,
    {
        priceIncreasePerLamp: number
    }
> = {
    lamp9w: {
        priceIncreasePerLamp: 0,
    },
    lamp12w: {
        priceIncreasePerLamp: 20,
    },
}

export function calculateIpPriceIncrease(basePrice: number, ip: ProductIP): number {
    const rule = PRODUCT_IP_RULES[ip]
    if (!rule) return 0
    return Math.ceil(basePrice * rule.increaseOnPricePercent)
}

export function calculateLampPriceIncrease(hNumber: number, lampType: ProductChandLamp): number {
    const rule = PRODUCT_CHAND_LAMP_RULES[lampType]
    if (!rule || hNumber <= 0) return 0
    return rule.priceIncreasePerLamp * hNumber
}

