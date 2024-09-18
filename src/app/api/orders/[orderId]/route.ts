import { CompletingAllOrderInfo } from '@/app/(main)/(configure)/complete/action';
import { NextResponse, NextRequest } from 'next/server';
export async function GET(request:Request, {params}: {params: {orderId : string}}) {
    const orderId = parseInt(params.orderId, 10)
    if(isNaN(orderId)) {
        return NextResponse.json({error: "Invalid order ID"}, {status: 400})
    }
    try {
        const nextRequest = request as NextRequest
        const order = await CompletingAllOrderInfo({ orderId, req: nextRequest });
        return order ? NextResponse.json(order) : NextResponse.json({error : "Order not found"}, {status: 404})
    } catch(error) {
        const errorMessage = error instanceof Error ? error.message : "unknown error occurred"
        return NextResponse.json({error : "Failed to fetch order ", details: errorMessage})
    }
}