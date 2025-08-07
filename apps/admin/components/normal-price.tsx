import { formatPrice } from "@repo/ui/lib";


type ProductPrices = {
  price: number;
  quantity?: number;
  shippingPrice?: number;
  sectionType?: string;
};

export default function NormalPrice({
  price,
  quantity = 1,
  shippingPrice = 0,
}: ProductPrices) {
  const normalPrice = Math.ceil(price);
  const PriceAfterTimesQuantity = normalPrice * quantity + shippingPrice;
  const formattedTotalPrice = formatPrice(PriceAfterTimesQuantity);
  return (
    <div>
      <p>{formattedTotalPrice}</p>
    </div>
  );
};