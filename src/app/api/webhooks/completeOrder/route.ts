import { CompletingAllOrderInfo } from '@/app/(main)/(configure)/complete/action';
import { NextResponse } from 'next/server';
import { db } from '@/db';
export async function GET(request: Request, { params }: { params: { orderId: string } }) {
    const orderId = parseInt(params.orderId, 10);
    if (isNaN(orderId)) {
        return NextResponse.json({ error: 'Invalid order ID' }, { status: 400 });
    }
    try {
        const order = await CompletingAllOrderInfo({ orderId });
        return order
            ? NextResponse.json(order)
            : NextResponse.json({ error: 'Order not found' }, { status: 404 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: 'Failed to fetch order', details: errorMessage }, { status: 500 });
    }
}
export async function POST(request: Request) {
    try {
        const { orderId } = await request.json();
        console.log('Order ID received:', orderId)
        const order = await CompletingAllOrderInfo({ orderId: parseInt(orderId) });
        if (!order) {
            throw new Error('Order not found or unauthorized');
        }
        const updatedOrder = await db.order.update({
            where: { id: parseInt(orderId,10 ) },
            data: { isCompleted: true },
            include: { user: true, shippingAddress: true },
        });
        console.log('Order after update:', updatedOrder);
        return NextResponse.json({ success: true, order: updatedOrder }, { status: 200 });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ error: 'Failed to fetch order', details: errorMessage }, { status: 500 });
    }
}
