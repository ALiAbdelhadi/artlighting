import { cn, formatPrice } from "@/lib/utils";

interface DiscountPriceProps {
  price: number;
  discount: number;
  quantity?: number;
  shippingPrice?: number;
  sectionType?: string;
  className?: string
}
export default function DiscountPrice({
  price,
  discount,
  quantity = 1,
  shippingPrice = 0,
  className
}: DiscountPriceProps) {
  const priceIncreasing = Math.ceil(price);
  const discountedPrice = Math.ceil(priceIncreasing * (1 - discount));
  const formattedPrice = formatPrice(
    discountedPrice * quantity + shippingPrice,
  );
  return (
    <div>
      <p className={cn("text-destructive font-semibold",className)}>{formattedPrice}</p>
    </div>
  );
};