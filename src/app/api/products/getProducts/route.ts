// src/app/api/products/getProducts/route.ts
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const requiredLumens = searchParams.get("requiredLumens");
    if (!requiredLumens) {
        return new NextResponse(JSON.stringify({ error: "requiredLumens parameter is missing" }), { status: 400 });
    }
    try {
        const products = await prisma.product.findMany({
            where: {
                luminousFlux: {
                    gte: String(requiredLumens),
                },
            },
            select: {
                productId: true,
                productName: true,
                luminousFlux: true,
                colorTemperature: true,
                productImages: true,
                price: true,
                Brand: true,
                spotlightType: true,
                sectionType: true
            },
        });
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Failed to fetch products' }), { status: 500 });
    }
}
