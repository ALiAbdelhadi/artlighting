
import { formatPrice } from "@/lib/utils";
import React from "react";

type ProductPrices = {
    price: number;
    quantity?: number;
    shippingPrice?: number
    sectionType: string
};

const NormalPrice: React.FC<ProductPrices> = ({ price, quantity = 1, shippingPrice = 0, sectionType }) => {
    let priceIncreasing
    if (sectionType === "Chandelier") {
        priceIncreasing = price * (1.56)
    } else {
        priceIncreasing = price
    }
    let normalPrice = Math.ceil(priceIncreasing);
    const PriceAfterTimesQuantity = normalPrice * quantity + shippingPrice
    const formattedTotalPrice = formatPrice(PriceAfterTimesQuantity);
    return (
        <div>
            <p>{formattedTotalPrice}</p>
        </div>
    );
};

export default NormalPrice;