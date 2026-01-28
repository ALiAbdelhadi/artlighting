"use server"

import { auth, clerkClient } from "@clerk/nextjs/server"
import { prisma } from "@repo/database"

export async function createOrder({
  configId,
  quantity,
}: {
  configId: string
  quantity: number
}) {
  console.log("Starting createOrder function")

  try {
    const { userId } = await auth()
    if (!userId) {
      console.error("User not authenticated")
      throw new Error("You need to be logged in")
    }

    const configuration = await prisma.configuration.findUnique({
      where: { id: configId },
    })

    if (!configuration) {
      console.error("Configuration not found")
      throw new Error("Configuration not found")
    }

    const product = await prisma.product.findUnique({
      where: { productId: configuration.productId },
    })

    if (!product) {
      console.error("Product not found")
      throw new Error("Product not found")
    }

    let dbUser = await prisma.user.findUnique({ where: { id: userId } })

    if (!dbUser) {
      const clerk = await clerkClient()
      const clerkUser = await clerk.users.getUser(userId)

      dbUser = await prisma.user.create({
        data: {
          id: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
          phoneNumber: clerkUser.phoneNumbers[0]?.phoneNumber ?? "",
        },
      })
    }

    let shippingAddress = await prisma.shippingAddress.findFirst({
      where: { userId: userId },
    })

    if (!shippingAddress) {
      const clerk = await clerkClient()
      const clerkUser = await clerk.users.getUser(userId)

      shippingAddress = await prisma.shippingAddress.create({
        data: {
          userId: userId,
          fullName: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`,
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
          phoneNumber: clerkUser.phoneNumbers[0]?.phoneNumber ?? "",
        },
      })
    }

    const priceIncrease = configuration.priceIncrease ?? product.priceIncrease ?? 0
    const lampPriceIncrease = configuration.lampPriceIncrease ?? 0
    const discount = configuration.discount ?? product.discount ?? 0
    const shippingPrice = configuration.shippingPrice ?? 69
    const validQuantity = Math.max(1, Math.floor(quantity))

    const unitConfigPrice = product.price + priceIncrease + lampPriceIncrease

    const subtotal = unitConfigPrice * validQuantity

    const discountAmount = discount > 0 
        ? subtotal * (discount > 1 ? discount / 100 : discount) 
        : 0

    const finalTotal = subtotal - discountAmount + shippingPrice
    const unitPriceAfterDiscount = (subtotal - discountAmount) / validQuantity

    const order = await prisma.order.create({
      data: {
        userId: userId,
        configurationId: configId,
        productId: product.id,
        quantity: validQuantity,
        productPrice: product.price,
        discountRate: discount,
        discountedPrice: unitPriceAfterDiscount,
        totalPrice: finalTotal,
        configPrice: subtotal,
        priceIncrease: priceIncrease,
        productName: product.productName,
        productImages: product.productImages,
        status: "awaiting_shipment",
        shippingPrice: shippingPrice,
        shippingAddressId: shippingAddress.id,
        productColorTemp: product.productColor || "",
        productIp: configuration.productIp?.toString() || product.productIp?.toString() || "IP20",
        productChandLamp: product.productChandLamp || "",
        brand: product.brand,
        chandelierLightingType: product.chandelierLightingType,
      },
    })

    console.log("Order created successfully", {
      userId: userId,
      orderId: order.id,
      productId: product.id,
    })

    return { userId: userId, orderId: order.id, productId: product.id }
  } catch (error) {
    console.error("Error in createOrder:", error)
    throw error
  }
}