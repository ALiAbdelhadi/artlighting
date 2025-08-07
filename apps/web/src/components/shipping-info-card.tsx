import NormalPrice from "@/components/normal-price";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ShippingInfoCardProps {
  shippingAddress: {
    city: string;
    fullName: string;
    address: string;
    state: string;
    zipCode: string;
    country: string;
    phoneNumber: string;
  };
  shippingPrice: number;
}

export default function ShippingInfoCard({
  shippingAddress,
  shippingPrice,
}: ShippingInfoCardProps) {
  const isCairo = shippingAddress.city.toLowerCase() === "cairo";

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">
          Shipping Information
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto custom-scrollbar">
          <div className="p-6 pt-0 min-w-[300px]">
            <div className="grid gap-4">
              <div>
                <h3 className="font-medium text-base sm:text-lg">
                  Delivery Details
                </h3>
                <p className="text-muted-foreground tracking-wide sm:text-base text-sm leading-5 -my-1">
                  {isCairo
                    ? "Standard shipping to Cairo"
                    : "Shipping to locations outside Cairo"}
                </p>
                <p className="tracking-wide leading-6">
                  {isCairo
                    ? `Your order will be delivered to Cairo. The shipping price is ${shippingPrice} EGP.`
                    : "We will contact you within 48 hours to provide the shipping price for your location."}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-base sm:text-lg">
                  Shipping Address
                </h3>
                <p className="text-muted-foreground tracking-wide sm:text-base text-sm leading-5 -my-1">
                  {shippingAddress.fullName}
                </p>
                <p className="tracking-wide leading-6">
                  {shippingAddress.address}, {shippingAddress.city},{" "}
                  {shippingAddress.state} {shippingAddress.zipCode},{" "}
                  {shippingAddress.country}
                </p>
                <p className="tracking-wide leading-6">
                  Phone: {shippingAddress.phoneNumber}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-base sm:text-lg">
                  Shipping Cost
                </h3>
                <p className="text-muted-foreground tracking-wide sm:text-base text-sm leading-5 -my-1">
                  {isCairo ? "Fixed rate for Cairo" : "To be determined"}
                </p>
                <p className="tracking-wide leading-6 font-semibold">
                  {isCairo ? (
                    <NormalPrice price={shippingPrice} />
                  ) : (
                    "We will contact you with the shipping price."
                  )}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-base sm:text-lg">
                  Estimated Delivery Time
                </h3>
                <p className="text-muted-foreground tracking-wide sm:text-base text-sm leading-5 -my-1">
                  {isCairo ? "3-5 business days" : "To be determined"}
                </p>
                <p className="tracking-wide leading-6">
                  {isCairo
                    ? "We strive to deliver your order as quickly as possible."
                    : "Delivery time will be provided when we contact you with the shipping price."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
