import { formatPrice } from "@/lib/utils";
import React from "react";

interface DiscountPriceProps {
    price: number;
    discount: number,
    quantity?: number,
    shippingPrice?: number
}
const DiscountPrice: React.FC<DiscountPriceProps> = ({ price,discount, quantity = 1, shippingPrice = 0}) => {
    const discountedPrice = Math.ceil(price * (1 - discount));
    const formattedPrice = formatPrice(discountedPrice * quantity + shippingPrice);
    return (
        <div>
            <p className="text-destructive font-semibold">{formattedPrice}</p>
        </div>
    );
};

export default DiscountPrice