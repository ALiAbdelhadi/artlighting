import { requireAdmin, AdminAuthError } from "@/lib/auth";
import { notFound } from "next/navigation";
import OrdersClient from "./orders-client";
import { prisma } from "@repo/database";

const OrdersPage = async () => {
  try {
    await requireAdmin();
  } catch (err) {
    if (err instanceof AdminAuthError) return notFound();
    throw err;
  }
  const orders = await prisma.order.findMany({
    where: { isCompleted: true },
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      shippingAddress: true,
      product: true,
      configuration: true,
    },
  });
  const discountData = await prisma.configuration.findFirst({
    select: { discount: true },
  });
  const discount = discountData?.discount || 0;
  return <OrdersClient orders={orders} />;
};

export default OrdersPage;
