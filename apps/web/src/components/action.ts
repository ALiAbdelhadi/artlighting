"use server"

import { prisma } from "@repo/database"

export interface SaveConfigArgs {
  configId: string
  productId: string
  configPrice: number
  priceIncrease: number
  lampPriceIncrease: number
  quantity: number
  discount: number
  totalPrice: number
}

export async function saveConfig({
  configId,
  productId,
  configPrice,
  priceIncrease,
  lampPriceIncrease,
  quantity,
  discount,
  totalPrice,
}: SaveConfigArgs) {
  try {
    console.log("Saving configuration:", {
      configId,
      productId,
      configPrice,
      priceIncrease,
      lampPriceIncrease,
      quantity,
      discount,
      totalPrice,
    })

    // Verify the configuration exists
    const existingConfig = await prisma.configuration.findUnique({
      where: { id: configId },
    })

    if (!existingConfig) {
      throw new Error(`Configuration with ID ${configId} not found`)
    }

    // Update the configuration
    const updatedConfiguration = await prisma.configuration.update({
      where: { id: configId },
      data: {
        configPrice,
        priceIncrease,
        lampPriceIncrease: lampPriceIncrease || 0,
        quantity,
        discount,
        totalPrice,
        updatedAt: new Date(),
      },
    })

    console.log("Configuration updated successfully:", updatedConfiguration.id)
    return { success: true, configuration: updatedConfiguration }
  } catch (error) {
    console.error("Error saving configuration:", error)
    throw error
  }
}