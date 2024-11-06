import { formatPrice } from "@/lib/utils";
import React from "react";

interface DiscountPriceProps {
    price: number;
    discount: number,
    quantity?: number,
    shippingPrice?: number
}
const DiscountPrice: React.FC<DiscountPriceProps> = ({ price, discount, quantity = 1, shippingPrice = 0 }) => {
    const priceIncreasing = price * (1 + 0.25)
    const discountedPrice = Math.ceil(priceIncreasing * (1 - discount));
    const formattedPrice = formatPrice(discountedPrice * quantity + shippingPrice);
    return (
        <div>
            <p className="text-destructive font-semibold">{formattedPrice}</p>
        </div>
    );
};

export default DiscountPrice