"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@repo/database";

export const CompletingAllOrderInfo = async ({
  orderId,
}: {
  orderId: number;
}) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.log("user not authenticated");
      throw new Error("You need to be logged in to access this information");
    }
    const order = prisma.order.findFirst({
      where: { id: orderId, userId: userId },
      include: {
        shippingAddress: true,
        product: true,
        user: true,
        configuration: true
      },
    });
    if (!order) {
      console.error(
        `order id with ${orderId} not found  or does not belong to this user`,
      );
      throw new Error(
        "Order not found or don't have permission to view this order",
      );
    }
    return order;
  } catch (error) {
    console.error(
      "Error in CompletingAllOrderInfo: ",
      (error as Error).message,
    );
    return {
      error: (error as Error).message || "An unexpected error occurred.",
    };
  }
};
