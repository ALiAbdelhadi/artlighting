import { prisma } from "@repo/database"
import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const SaveConfigSchema = z.object({
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

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ configId: string }> }
) {
    try {
        const { configId } = await params
        const body = await request.json()
        
        console.log("Save config started with args:", { configId, ...body })

        // Validate input data
        const validatedData = SaveConfigSchema.parse(body)
        console.log("Data validation passed:", validatedData)

        const {
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
            return NextResponse.json(
                {
                    success: false,
                    error: "Configuration not found"
                },
                { status: 404 }
            )
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
            return NextResponse.json(
                {
                    success: false,
                    error: "Product not found"
                },
                { status: 404 }
            )
        }

        if (!product.isActive) {
            console.error(`Product is not active: ${productId}`)
            return NextResponse.json(
                {
                    success: false,
                    error: "Product is not available"
                },
                { status: 400 }
            )
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

        const updatedConfig = await prisma.configuration.update({
            where: { id: configId },
            data: {
                productId,
                configPrice,
                priceIncrease,
                lampPriceIncrease,
                quantity,
                discount,
                totalPrice: calculatedTotalPrice,
                shippingPrice: existingConfig.shippingPrice || 69, 
                updatedAt: new Date(),
            }
        })

        console.log("Configuration updated successfully:", {
            configId: updatedConfig.id,
            productId: updatedConfig.productId,
            totalPrice: updatedConfig.totalPrice,
            quantity: updatedConfig.quantity
        })
        console.log("Configuration saved and ready for preview")

        return NextResponse.json({
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
        })

    } catch (error) {
        console.error("Error saving configuration:", error)

        if (error instanceof z.ZodError) {
            const errorMessage = error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
            console.error("Validation errors:", errorMessage)
            return NextResponse.json(
                {
                    success: false,
                    error: `Validation failed: ${errorMessage}`
                },
                { status: 400 }
            )
        }

        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred"
            },
            { status: 500 }
        )
    }
}