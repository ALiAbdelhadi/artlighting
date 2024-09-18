"use server"
import { db } from "@/db"
import { getAuth } from "@clerk/nextjs/server"
import { NextRequest } from "next/server"

export const getCompleteOrderStatus = async ({ orderId, req }: { orderId: string, req: NextRequest }) => {
    const { userId } = getAuth(req);
    console.log('User ID:', userId);
    if (!userId) {
        throw new Error('You need to be logged in to view this page.');
    }
    const order = await db.order.findFirst({
        where: { id: parseInt(orderId, 10), userId: userId },
        include: {
            configuration: true,
            shippingAddress: true,
            product: true,
            user: true,
        }
    });
    console.log('Order fetched:', order);
    if (!order) {
        console.log('Order not found for ID:', orderId);
        throw new Error("This order does not exist.");
    }

    console.log('Order isCompleted:', order.isCompleted);
    return order.isCompleted ? order : false;
}
