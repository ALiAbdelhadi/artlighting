import { db } from '@/db';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

async function getOrCreateConfiguration(productId: string, configPrice: number) {
    let config = await db.configuration.findFirst({
        where: { ProductId: productId }
    });

    if (!config) {
        config = await db.configuration.create({
            data: {
                ProductId: productId,
                configPrice: configPrice,
                priceIncrease: 0,
                shippingPrice: 0,
                discount: 0,
                quantity: 1,
                totalPrice: configPrice
            }
        });
    }

    return config;
}

export async function POST(request: Request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        }
        const body = await request.json();
        const { orderId, productId, quantity, configPrice } = body;

        // Check if the order exists
        const existingOrder = await db.order.findUnique({
            where: { id: parseInt(orderId, 10) },
            include: { product: true },
        });
        if (!existingOrder) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Check if the product exists
        const existingProduct = await db.product.findUnique({
            where: { id: productId },
        });
        if (!existingProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Get or create configuration
        const config = await getOrCreateConfiguration(productId, configPrice);

        // Create a new order item for the additional product
        const newOrderItem = await db.orderItem.create({
            data: {
                orderId: existingOrder.id,
                productId,
                quantity,
                configPrice,
                configurationId: config.id,
            },
        });

        // Update the total price of the order
        const updatedOrder = await db.order.update({
            where: { id: existingOrder.id },
            data: {
                totalPrice: {
                    increment: configPrice * quantity
                },
            },
            include: { orderItems: true },
        });

        return NextResponse.json(updatedOrder, { status: 200 });
    } catch (error) {
        console.error('Error adding product to order:', error);
        return NextResponse.json({ error: 'Failed to add product to order' }, { status: 500 });
    }
}