import { CompletingAllOrderInfo } from "@/app/[locale]/(main)/(configure)/complete/action";
import { prisma } from "@repo/database";

import { type NextRequest, NextResponse } from "next/server";
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params;
  // Note: orderId should come from query params or body, not route params
  const { searchParams } = new URL(request.url);
  const orderIdParam = searchParams.get("orderId");
  if (!orderIdParam) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
  }
  const orderId = parseInt(orderIdParam, 10);
  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  }
  try {
    const order = await CompletingAllOrderInfo({ orderId });
    return order
      ? NextResponse.json(order)
      : NextResponse.json({ error: "Order not found" }, { status: 404 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to fetch order", details: errorMessage },
      { status: 500 },
    );
  }
}
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  try {
    const body = await request.json();
    const orderId = parseInt(body.orderId, 10);
    if (isNaN(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }
    console.log("Order ID received:", orderId);
    const order = await CompletingAllOrderInfo({ orderId });
    if (!order) {
      return NextResponse.json(
        { error: "Order not found or unauthorized" },
        { status: 404 },
      );
    }
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { isCompleted: true },
      include: { user: true, shippingAddress: true },
    });
    console.log("Order after update:", updatedOrder);
    return NextResponse.json(
      { success: true, order: updatedOrder },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error completing order:", errorMessage);
    return NextResponse.json(
      { error: "Failed to complete order", details: errorMessage },
      { status: 500 },
    );
  }
}
