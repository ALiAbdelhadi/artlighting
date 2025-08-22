"use server"

import { prisma } from "@repo/database"
import { z } from "zod"

// Enhanced validation schema
const SaveConfigSchema = z.object({
    configId: z.string().min(1, "Configuration ID is required"),
    productId: z.string().min(1, "Product ID is required"),
    configPrice: z.number().positive("Config price must be positive"),
    priceIncrease: z.number().min(0, "Price increase cannot be negative"),
    lampPriceIncrease: z.number().min(0, "Lamp price increase cannot be negative"),
    quantity: z.number().int().positive("Quantity must be a positive integer"),
    discount: z.number().min(0).max(1, "Discount must be between 0 and 1"),
    totalPrice: z.number().min(0, "Total price cannot be negative")
})

export type SaveConfigArgs = z.infer<typeof SaveConfigSchema>

interface SaveConfigResponse {
    success: boolean
    configId?: string
    error?: string
    data?: any
}

export async function saveConfig(args: SaveConfigArgs): Promise<SaveConfigResponse> {
    console.log("Save config started with args:", args)

    try {
        // Validate input data
        const validatedData = SaveConfigSchema.parse(args)
        console.log("Data validation passed:", validatedData)

        const {
            configId,
            productId,
            configPrice,
            priceIncrease,
            lampPriceIncrease,
            quantity,
            discount,
            totalPrice
        } = validatedData

        // Verify that the configuration exists
        const existingConfig = await prisma.configuration.findUnique({
            where: { id: configId },
            include: {
                orders: {
                    select: { id: true }
                }
            }
        })

        if (!existingConfig) {
            console.error(`Configuration not found: ${configId}`)
            return {
                success: false,
                error: "Configuration not found"
            }
        }

        // Verify that the product exists
        const product = await prisma.product.findUnique({
            where: { productId },
            select: {
                id: true,
                productId: true,
                productName: true,
                price: true,
                isActive: true
            }
        })

        if (!product) {
            console.error(`Product not found: ${productId}`)
            return {
                success: false,
                error: "Product not found"
            }
        }

        if (!product.isActive) {
            console.error(`Product is not active: ${productId}`)
            return {
                success: false,
                error: "Product is not available"
            }
        }

        // Calculate final total price
        const calculatedTotalPrice = (configPrice + priceIncrease + lampPriceIncrease) * quantity

        console.log("Price calculations:", {
            configPrice,
            priceIncrease,
            lampPriceIncrease,
            quantity,
            calculatedTotalPrice,
            providedTotalPrice: totalPrice
        })

        // Update configuration with comprehensive data
        const updatedConfig = await prisma.configuration.update({
            where: { id: configId },
            data: {
                productId,
                configPrice,
                priceIncrease,
                lampPriceIncrease,
                quantity,
                discount,
                totalPrice: calculatedTotalPrice, // Use calculated value for consistency
                shippingPrice: existingConfig.shippingPrice || 69, // Maintain existing shipping or default
                updatedAt: new Date(),
            }
        })

        console.log("Configuration updated successfully:", {
            configId: updatedConfig.id,
            productId: updatedConfig.productId,
            totalPrice: updatedConfig.totalPrice,
            quantity: updatedConfig.quantity
        })

        // Cache the configuration ID for the preview page
        console.log("Configuration saved and ready for preview")

        return {
            success: true,
            configId: updatedConfig.id,
            data: {
                configuration: updatedConfig,
                product: {
                    id: product.id,
                    productId: product.productId,
                    productName: product.productName
                }
            }
        }

    } catch (error) {
        console.error("Error saving configuration:", error)

        if (error instanceof z.ZodError) {
            const errorMessage = error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
            console.error("Validation errors:", errorMessage)
            return {
                success: false,
                error: `Validation failed: ${errorMessage}`
            }
        }

        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        }
    }
}