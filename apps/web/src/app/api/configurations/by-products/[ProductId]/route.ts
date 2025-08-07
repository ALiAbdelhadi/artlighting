import { prisma } from "@repo/database"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ ProductId: string }> }) {
  try {
    const { ProductId } = await params

    const configuration = await prisma.configuration.findFirst({
      where: { ProductId },
      orderBy: { updatedAt: "desc" },
    })

    if (!configuration) {
      return NextResponse.json({ error: "Configuration not found" }, { status: 404 })
    }

    return NextResponse.json(configuration)
  } catch (error) {
    console.error("Failed to fetch configuration:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
