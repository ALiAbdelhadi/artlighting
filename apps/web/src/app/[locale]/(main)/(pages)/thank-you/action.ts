"use server";

import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@repo/database";
import { NextRequest } from "next/server";

export const getCompleteOrderStatus = async ({
  orderId,
  req,
  locale = "ar", 
}: {
  orderId: string;
  req: NextRequest;
  locale?: string;
}) => {
  const { userId } = await getAuth(req);
  console.log("User ID:", userId);

  if (!userId) {
    throw new Error("You need to be logged in to view this page.");
  }

  const order = await prisma.order.findFirst({
    where: { id: parseInt(orderId, 10), userId: userId },
    include: {
      configuration: true,
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
    },
  });

  if (!order) {
    throw new Error("This order does not exist.");
  }

  return order.isCompleted ? order : false;
};