
import { OrderService } from "@/lib/order.server";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const CompleteOrderSchema = z.object({
  orderId: z.string().transform((val) => parseInt(val, 10)),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId } = CompleteOrderSchema.parse(body);

    const order = await OrderService.completeOrder(orderId);

    return NextResponse.json(
      { success: true, order },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to complete order", details: errorMessage },
      { status: 500 }
    );
  }
}