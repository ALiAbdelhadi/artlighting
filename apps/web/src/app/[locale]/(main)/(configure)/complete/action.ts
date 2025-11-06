"use server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@repo/database";
import { NextRequest } from "next/server";

export const CompletingAllOrderInfo = async ({
  orderId,
  locale,
  req,
}: {
  orderId: number;
  locale?: string;
  req?: NextRequest; 
}) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.log("user not authenticated");
      throw new Error("You need to be logged in to access this information");
    }

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: userId },
      include: {
        shippingAddress: true,
        product: {
          include: {
            specifications: {
              where: {
                language: locale,
              },
            },
            translations: {
              where: {
                language: locale,
              },
            },
          }
        },
        user: true,
        configuration: true,
      },
    });

    if (!order) {
      console.error(
        `order id with ${orderId} not found or does not belong to this user`,
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
    throw error;
  }
};