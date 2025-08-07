import { formatPrice } from "@repo/ui/lib";



interface DiscountPriceProps {
  price: number;
  discount: number;
  quantity?: number;
  shippingPrice?: number;
  sectionType?: string;
}
export default function DiscountPrice({
  price,
  discount,
  quantity = 1,
  shippingPrice = 0,
}: DiscountPriceProps) {
  const priceIncreasing = Math.ceil(price);
  const discountedPrice = Math.ceil(priceIncreasing * (1 - discount));
  const formattedPrice = formatPrice(
    discountedPrice * quantity + shippingPrice,
  );
  return (
    <div>
      <p className="text-destructive font-semibold">{formattedPrice}</p>
    </div>
  );
};