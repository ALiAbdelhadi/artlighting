import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import OrdersClient from "./orders-client";
import { prisma } from "@repo/database";

const OrdersPage = async () => {
  const { userId } = await auth();
  const user = await currentUser();
  if (!userId || !user) {
    return notFound();
  }
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (user.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
    return notFound();
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
