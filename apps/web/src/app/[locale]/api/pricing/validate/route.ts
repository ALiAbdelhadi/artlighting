// apps/web/src/app/[locale]/api/pricing/validate/route.ts
import { PricingService } from "@/lib/pricing.server";
import { applyRateLimit } from "@/middleware/ratelimit";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@repo/database";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ValidatePricingSchema = z.object({
  configurationId: z.string().min(1),
  quantity: z.number().int().positive().optional(),
});

/**
 * Server-side price validation endpoint
 * CRITICAL: All pricing must be validated server-side to prevent manipulation
 */
export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = await applyRateLimit(request, "api");
  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { configurationId, quantity } = ValidatePricingSchema.parse(body);

    // Fetch configuration from database
    const configuration = await prisma.configuration.findUnique({
      where: { id: configurationId },
      include: {
        users: { where: { id: userId }, select: { id: true } },
      },
    });

    if (!configuration) {
      return NextResponse.json(
        { error: "Configuration not found" },
        { status: 404 }
      );
    }

    // Verify user owns this configuration
    if (configuration.users.length === 0) {
      return NextResponse.json(
        { error: "Unauthorized access to configuration" },
        { status: 403 }
      );
    }

    // Get product to verify discount
    const product = await prisma.product.findUnique({
      where: { id: configuration.productId },
      select: { discount: true, price: true },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Calculate pricing server-side (AUTHORITATIVE)
    const actualQuantity = quantity || configuration.quantity;
    const pricing = PricingService.calculateOrderPricing(
      configuration.configPrice,
      configuration.totalPrice,
      actualQuantity,
      product.discount || configuration.discount,
      configuration.shippingPrice
    );

    return NextResponse.json({
      validated: true,
      pricing,
      configurationId,
      productId: configuration.productId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error },
        { status: 400 }
      );
    }

    console.error("Error validating pricing:", error);
    return NextResponse.json(
      { error: "Failed to validate pricing" },
      { status: 500 }
    );
  }
}
