import { auth } from "@clerk/nextjs/server"
import { OrderService } from "@/lib/order.server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const orderId = parseInt((await params).orderId, 10)
  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 })
  }

  try {
    const locale = request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] || "ar"
    const order = await OrderService.getOrderWithDetails(orderId, userId, locale)
    return NextResponse.json(order)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    return NextResponse.json(
      { error: "Failed to fetch order", details: errorMessage },
      { status: 500 }
    )
  }
}