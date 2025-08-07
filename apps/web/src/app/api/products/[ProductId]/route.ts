import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@repo/database"

const ParamsSchema = z.object({
  ProductId: z.string(),
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ ProductId: string }> }) {
  try {
    const awaitedParams = await params
    const validatedParams = ParamsSchema.parse(awaitedParams)
    const { ProductId } = validatedParams

    console.log(`Fetching product with ID: ${ProductId}`)

    const product = await prisma.product.findUnique({
      where: {
        productId: ProductId,
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
        beamAngle: true,
        sectionType: true,
      },
    })

    if (!product) {
      console.log(`Product not found: ${ProductId}`)
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    console.log(`Successfully fetched product: ${ProductId}`)
    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Invalid ProductId:", error.message)
      return NextResponse.json({ error: "Invalid ProductId" }, { status: 400 })
    }

    console.error("Failed to fetch product:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
