import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'

export async function GET(
    request: NextRequest,
    { params }: { params: { ProductId: string } }
) {
    try {
        const { ProductId } = params

        const product = await db.product.findUnique({
            where: {
                productId: ProductId
            },
            select: {
                productId: true,
                productName: true,
                price: true,
                productImages: true,
                discount: true,
                luminousFlux: true,
                mainMaterial: true,
                cri: true,
                beamAngle: true
            }
        })

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        return NextResponse.json(product)
    } catch (error) {
        console.error('Failed to fetch product:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}