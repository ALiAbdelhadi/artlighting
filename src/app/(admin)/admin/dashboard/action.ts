"use server";
import { db } from "@/db";
import { OrderStatus } from "@prisma/client";
export const changeOrderStatus = async ({
  id,
  newStatus,
}: {
  id: number;
  newStatus: OrderStatus;
}) => {
  await db.order.update({
    where: { id },
    data: { status: newStatus },
  });
};
