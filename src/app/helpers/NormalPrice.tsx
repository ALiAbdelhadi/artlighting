import { formatPrice } from "@/lib/utils";
import React from "react";

type ProductPrices = {
  price: number;
  quantity?: number;
  shippingPrice?: number;
  sectionType?: string;
};

const NormalPrice: React.FC<ProductPrices> = ({
  price,
  quantity = 1,
  shippingPrice = 0,
}) => {
  let normalPrice = Math.ceil(price);
  const PriceAfterTimesQuantity = normalPrice * quantity + shippingPrice;
  const formattedTotalPrice = formatPrice(PriceAfterTimesQuantity);
  return (
    <div>
      <p>{formattedTotalPrice}</p>
    </div>
  );
};

export default NormalPrice;
