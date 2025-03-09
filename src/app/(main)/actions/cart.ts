"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";

export async function addToCart(productId: string, quantity: number = 1) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  try {
    let user = await db.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      user = await db.user.create({
        data: { id: userId },
      });
    }
    const product = await db.product.findUnique({
      where: { productId },
    });
    if (!product) {
      throw new Error("Product not found");
    }
    let cart = await db.cart.findUnique({
      where: { userId },
    });
    if (!cart) {
      cart = await db.cart.create({
        data: { userId },
      });
    }
    const existingCartItem = await db.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: product.id,
        },
      },
    });
    if (existingCartItem) {
      await db.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      await db.cartItem.create({
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
