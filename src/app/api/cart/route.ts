import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from "@clerk/nextjs/server"

export async function GET(request: NextRequest) {
    const { userId } = auth()

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        })

        if (!cart) {
            return NextResponse.json([])
        }

        const cartItems = cart.items.map(item => ({
            id: item.id,
            productId: item.product.productId, // Use the custom productId
            productName: item.product.productName,
            quantity: item.quantity,
            price: item.product.price,
            totalPrice: item.product.price * item.quantity * (1 - item.product.discount),
            productImages: item.product.productImages,
            discount: item.product.discount
        }))

        return NextResponse.json(cartItems)
    } catch (error) {
        console.error('Failed to fetch cart items:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
export async function PUT(request: NextRequest) {
    const { userId } = auth()

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { itemId, quantity } = await request.json()

        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } }
        })

        if (!cart) {
            return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
        }

        const cartItem = cart.items.find(item => item.id === itemId)

        if (!cartItem) {
            return NextResponse.json({ error: 'Cart item not found' }, { status: 404 })
        }

        const updatedItem = await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
            include: { product: true }
        })

        const totalPrice = updatedItem.product.price * updatedItem.quantity * (1 - updatedItem.product.discount)

        return NextResponse.json({
            id: updatedItem.id,
            productId: updatedItem.product.productId,
            productName: updatedItem.product.productName,
            quantity: updatedItem.quantity,
            price: updatedItem.product.price,
            totalPrice,
            productImages: updatedItem.product.productImages,
            discount: updatedItem.product.discount
        })
    } catch (error) {
        console.error('Failed to update cart item:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
export async function DELETE(request: NextRequest) {
    const { userId } = auth()

    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { itemId } = await request.json()

        await prisma.cartItem.delete({
            where: { id: itemId }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to remove cart item:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}