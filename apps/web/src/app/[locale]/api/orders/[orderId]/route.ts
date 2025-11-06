import { CompletingAllOrderInfo } from "@/app/[locale]/(main)/(configure)/complete/action"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const orderId = parseInt((await params).orderId, 10)

  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 })
  }

  try {
    const locale = request.headers.get("accept-language")?.split(",")[0]?.split("-")[0] || "ar";

    const order = await CompletingAllOrderInfo({
      orderId,
      locale,
      req: request
    })

    return order
      ? NextResponse.json(order)
      : NextResponse.json({ error: "Order not found" }, { status: 404 })
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "unknown error occurred"

    return NextResponse.json(
      {
        error: "Failed to fetch order",
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}