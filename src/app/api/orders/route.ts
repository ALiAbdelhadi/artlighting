import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();
interface RequestBody {
    configurationId: string;
    productId: string;
    productName: string;
    productImages: string[];
    quantity: number;
    productPrice: number;
    discount: number;
    shippingPrice?: number;
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phoneNumber: string;
    };
}
export async function POST(request: Request) {
    try {
        const { userId } = auth();
        if (!userId) {
            return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
        }
        const body: RequestBody = await request.json();
        console.log('Received order data:', body);
        if (!body.shippingAddress || !body.shippingAddress.fullName || !body.shippingAddress.address ||
            !body.shippingAddress.city || !body.shippingAddress.state ||
            !body.shippingAddress.zipCode || !body.shippingAddress.country ||
            !body.shippingAddress.phoneNumber) {
            return NextResponse.json({ error: 'Shipping address is incomplete' }, { status: 400 });
        }
        const product = await prisma.product.findUnique({
            where: { id: body.productId },
        });
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        let shippingAddress = await prisma.shippingAddress.findUnique({
            where: { userId: userId },
        });
        if (!shippingAddress) {
            shippingAddress = await prisma.shippingAddress.create({
                data: {
                    userId: userId,
                    fullName: body.shippingAddress.fullName,
                    address: body.shippingAddress.address,
                    city: body.shippingAddress.city,
                    state: body.shippingAddress.state,
                    zipCode: body.shippingAddress.zipCode,
                    country: body.shippingAddress.country,
                    phoneNumber: body.shippingAddress.phoneNumber,
                },
            });
        } else {
            shippingAddress = await prisma.shippingAddress.update({
                where: { userId: userId },
                data: {
                    fullName: body.shippingAddress.fullName,
                    address: body.shippingAddress.address,
                    city: body.shippingAddress.city,
                    state: body.shippingAddress.state,
                    zipCode: body.shippingAddress.zipCode,
                    country: body.shippingAddress.country,
                    phoneNumber: body.shippingAddress.phoneNumber,
                },
            });
        }
        const discountRate = product.discount;
        let discountedPrice = body.productPrice;
        let discountApplied = false;
        let totalPrice;
        if (discountRate > 0) {
            discountedPrice = Math.ceil(body.productPrice * (1 - discountRate));
            discountApplied = true;
        }
        if (discountRate > 0) {
            totalPrice = (discountedPrice * body.quantity) + (body.shippingPrice || 0);
        } else {
            totalPrice = (body.productPrice * body.quantity) + (body.shippingPrice || 0);
        }
        console.log('Calculated values:', { discountRate, discountedPrice, totalPrice, discountApplied });
        // Create order
        const order = await prisma.order.create({
            data: {
                user: {
                    connect: { id: userId }
                },
                configuration: {
                    connect: { id: body.configurationId }
                },
                product: {
                    connect: { id: body.productId }
                },
                quantity: body.quantity,
                productPrice: body.productPrice,
                discountRate: discountRate,
                discountedPrice: discountedPrice,
                discountApplied: discountApplied,
                totalPrice: totalPrice,
                productName: body.productName,
                productImages: body.productImages,
                shippingPrice: body.shippingPrice || 0,
                status: "awaiting_shipment",
                shippingAddress: {
                    connect: { id: shippingAddress.id }
                },
                productColorTemp: product.productColor || "",
                productIp: product.productIp || "",
                productChandLamp: product.productChandLamp || "",
                Brand: product.Brand || "",
                ChandelierLightingType: product.ChandelierLightingType
            },
        });
        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}