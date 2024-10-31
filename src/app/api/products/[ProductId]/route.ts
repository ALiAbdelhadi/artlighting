import { db } from '@/db'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const ParamsSchema = z.object({
    ProductId: z.string()
})

export async function GET(
    request: NextRequest,
    { params }: { params: { ProductId: string } }
) {
    try {
        // Await the params before using them
        const validatedParams = await ParamsSchema.parse(await params)
        const { ProductId } = validatedParams

        console.log(`Fetching product with ID: ${ProductId}`)
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
            console.log(`Product not found: ${ProductId}`)
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        console.log(`Successfully fetched product: ${ProductId}`)
        return NextResponse.json(product)
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Use string interpolation instead of direct access
            console.error('Invalid ProductId:', error.message)
            return NextResponse.json({ error: 'Invalid ProductId' }, { status: 400 })
        }
        console.error('Failed to fetch product:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}