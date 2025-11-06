"use server"

import { prisma } from "@repo/database"

export interface SaveConfigArgs {
  configId: string
  productId: string
  basePrice: number // السعر الأساسي للمنتج (بدون زيادات)
  priceIncrease: number // زيادة IP
  lampPriceIncrease: number // زيادة المصابيح
  shippingPrice?: number // سعر الشحن
  quantity: number // الكمية
  discount: number // نسبة الخصم
}

export async function saveConfig({
  configId,
  productId,
  basePrice,
  priceIncrease,
  lampPriceIncrease,
  shippingPrice = 0,
  quantity,
  discount,
}: SaveConfigArgs) {
  try {
    const normalizedDiscount = discount > 1 ? discount / 100 : discount

    // 1. السعر بعد الخصم (قبل أي زيادات)
    const discountedBase = basePrice * (1 - normalizedDiscount)

    // 2. إضافة الزيادات بعد الخصم
    const finalUnitPrice =
      discountedBase + priceIncrease + (lampPriceIncrease || 0) + shippingPrice

    // 3. ضرب في الكمية
    const totalPrice = Math.ceil(finalUnitPrice * Math.max(1, quantity))

    // 4. configPrice = السعر الأساسي + كل الزيادات (بدون خصم)
    const configPrice =
      basePrice + priceIncrease + (lampPriceIncrease || 0) + shippingPrice

    console.log("Saving configuration with new discount logic:", {
      configId,
      productId,
      basePrice,
      discountedBase,
      priceIncrease,
      lampPriceIncrease,
      shippingPrice,
      quantity,
      discount,
      configPrice,
      totalPrice,
    })

    const existingConfig = await prisma.configuration.findUnique({
      where: { id: configId },
      select: { id: true },
    })

    if (!existingConfig) {
      throw new Error(`Configuration with ID ${configId} not found`)
    }

    const updatedConfiguration = await prisma.configuration.update({
      where: { id: configId },
      data: {
        configPrice: Math.ceil(configPrice), 
        priceIncrease: Math.ceil(priceIncrease),
        lampPriceIncrease: Math.ceil(lampPriceIncrease || 0),
        shippingPrice: Math.ceil(shippingPrice),
        quantity,
        discount: normalizedDiscount,
        totalPrice,
      },
    })

    return {
      success: true,
      configuration: updatedConfiguration,
      message: "Configuration saved successfully",
    }
  } catch (error) {
    console.error("Error saving configuration:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      configuration: null,
    }
  }
}
