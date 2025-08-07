
import { prisma } from "@repo/database";
import OrderPage from "./order-page";
const OrderIdPage = async ({ params }: { params: { orderId: string } }) => {
  const order = await prisma.order.findFirst({
    where: {
      isCompleted: true,
    },
    include: {
      shippingAddress: true,
      product: true,
      user: true,
      configuration: true
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Order not found.
      </div>
    );
  }
  return <OrderPage order={order} />;
};

export default OrderIdPage;
