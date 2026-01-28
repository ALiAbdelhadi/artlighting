export interface PricingCalculation {
    configPrice: number;
    totalPrice: number;
    quantity: number;
    discount: number;
    unitPriceAfterDiscount: number;
    hasDiscount: boolean;
    discountPercentage: number;
    subtotal: number;
    discountAmount: number;
    finalTotal: number;
    shippingCost: number;
}

export class PricingService {
    private static readonly DEFAULT_SHIPPING_COST = 69;

    static calculateOrderPricing(
        configPrice: number,
        totalPrice: number,
        quantity: number,
        discount: number,
        shippingCost: number = this.DEFAULT_SHIPPING_COST
    ): PricingCalculation {
        const unitPriceAfterDiscount = quantity > 0 ? totalPrice / quantity : 0;
        const hasDiscount = discount > 0;
        const discountPercentage = Math.round(discount > 1 ? discount : discount * 100);
        const subtotal = configPrice * quantity;
        const discountAmount = hasDiscount
            ? subtotal * (discount > 1 ? discount / 100 : discount)
            : 0;
        const finalTotal = totalPrice + shippingCost;

        return {
            configPrice,
            totalPrice,
            quantity,
            discount,
            unitPriceAfterDiscount,
            hasDiscount,
            discountPercentage,
            subtotal,
            discountAmount,
            finalTotal,
            shippingCost,
        };
    }

    static calculateConfigurationPrice(
        basePrice: number,
        priceIncrease: number,
        lampPriceIncrease: number,
        quantity: number,
        discount: number
    ): number {
        const unitPrice = basePrice + priceIncrease + lampPriceIncrease;
        const subtotal = unitPrice * quantity;
        const discountAmount = discount > 0 ? subtotal * (discount > 1 ? discount / 100 : discount) : 0;
        return subtotal - discountAmount;
    }
}