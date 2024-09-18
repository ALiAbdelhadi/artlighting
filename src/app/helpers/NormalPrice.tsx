import React from "react";
import { formatPrice } from "@/lib/utils";

type ProductPrices = {
    price: number;
    quantity?: number;
};

const NormalPrice: React.FC<ProductPrices> = ({ price, quantity = 1 }) => {
    let normalPrice = Math.ceil(price);
    const PriceAfterTimesQuantity =  normalPrice * quantity
    const formattedTotalPrice = formatPrice(PriceAfterTimesQuantity);
    return (
        <div>
            <p>{formattedTotalPrice}</p>
        </div>
    );
};

export default NormalPrice;
