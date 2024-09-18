'use server'

import { prisma } from '../../../lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function addToCart(productId: string, quantity: number = 1) {
    const { userId } = auth()

    if (!userId) {
        throw new Error('User not authenticated')
    }

    try {
        // Check if the user exists in the database
        let user = await prisma.user.findUnique({
            where: { id: userId },
        })

        // If the user doesn't exist, create them
        if (!user) {
            user = await prisma.user.create({
                data: { id: userId },
            })
        }

        const product = await prisma.product.findUnique({
            where: { productId },
        })

        if (!product) {
            throw new Error('Product not found')
        }

        let cart = await prisma.cart.findUnique({
            where: { userId },
        })

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
            })
        }

        const existingCartItem = await prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: product.id, // Use the Prisma-generated ID here
                },
            },
        })

        if (existingCartItem) {
            await prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + quantity },
            })
        } else {
            await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: product.id, // Use the Prisma-generated ID here
                    quantity,
                },
            })
        }

        return { success: true, message: 'Product added to cart' }
    } catch (error) {
        console.error('Failed to add item to cart:', error)
        throw error
    }
}