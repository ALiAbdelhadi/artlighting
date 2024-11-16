
import { formatPrice } from "@/lib/utils";
import React from "react";

interface DiscountPriceProps {
    price: number;
    discount: number,
    quantity?: number,
    shippingPrice?: number
    sectionType: string
}
const DiscountPrice: React.FC<DiscountPriceProps> = ({ price, discount, quantity = 1, shippingPrice = 0, sectionType }) => {
    let priceIncreasing
    if (sectionType === "Chandelier") {
        priceIncreasing = price * (1.56)
    } else {
        priceIncreasing = price
    }
    Math.ceil(priceIncreasing)
    const discountedPrice = Math.ceil(priceIncreasing * (1 - discount));
    const formattedPrice = formatPrice(discountedPrice * quantity + shippingPrice);
    return (
        <div>
            <p className="text-destructive font-semibold">{formattedPrice}</p>
        </div>
    );
};

export default DiscountPrice