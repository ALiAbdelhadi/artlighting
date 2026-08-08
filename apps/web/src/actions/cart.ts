"use server";

import { auth } from "@/lib/auth-server";
import { prisma } from "@repo/database";

export async function addToCart(productId: string, quantity: number = 1) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    // The User row already exists once `userId` is a valid session's user id
    // — Better Auth writes it directly to this table at sign-up.
    const product = await prisma.product.findUnique({
      where: { productId },
    });
    if (!product) {
      throw new Error("Product not found");
    }
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });
    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id,
        },
      },
    });
    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: product.id,
          quantity,
        },
      });
    }
    return { success: true, message: "Product added to cart" };
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    throw error;
  }
}
