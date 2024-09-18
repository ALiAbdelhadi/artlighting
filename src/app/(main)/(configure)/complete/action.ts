"use server"
import { db } from "@/db"
import { auth } from "@clerk/nextjs/server"
import { NextRequest } from "next/server"

export const CompletingAllOrderInfo = async ({ orderId, req }: { orderId: number, req?: NextRequest }) => {
    try {
        const { userId } = auth()
        if (!userId) {
            console.log("user not authenticated")
            throw new Error("You need to be logged in to access this information")
        }
        const order = db.order.findFirst({
            where: { id: orderId, userId: userId },
            include: {
                shippingAddress: true,
                product: true,
                user: true
            }
        })
        if(!order){
            console.error(`order id with ${orderId} not found  or does not belong to this user`)
            throw new Error("Order not found or don't have permission to view this order")
        }
        return order
    } catch(error) {
        console.error("Error in CompletingAllOrderInfo: ", (error as Error).message)
        return {error: (error as Error).message || 'An unexpected error occurred.'}
    }
}