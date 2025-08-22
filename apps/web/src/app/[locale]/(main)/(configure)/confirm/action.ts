"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@repo/database";

export const getUserStatus = async ({ orderId }: { orderId: number }) => {
  try {
    const { userId } =  await auth();
    if (!userId) {
      console.log("User Not authenticated");
      throw new Error("You need to be logged in");
    }
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        shippingAddress: true,
        configuration: true,
      },
    });
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.userId !== userId) {
      throw new Error("You do not have permission to view this order");
    }
    return order;
  } catch (error) {
    console.log("Error in getUserStatus", error);
    throw error;
  }
};