import { Order, Product } from "@repo/database";
import { Card, CardContent } from "@/components/ui/card";
import NormalPrice from "@/components/normal-price";

interface CurrentOrderHeaderProps {
  order: Order & { product: Product };
}

export default function CurrentOrderHeader({ order }: CurrentOrderHeaderProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2">Current Order</h2>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              {order.product.productName}
            </p>
            <p className="text-sm">Quantity: {order.quantity}</p>
          </div>
          <NormalPrice price={order.totalPrice} />
        </div>
      </CardContent>
    </Card>
  );
}
