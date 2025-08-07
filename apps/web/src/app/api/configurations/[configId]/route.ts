
import { auth } from "@clerk/nextjs/server"
import { prisma } from "@repo/database"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ configId: string }> }) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { configId } = await params
        const body = await request.json()

        const existingConfig = await prisma.configuration.findUnique({
            where: { id: configId },
        })

        if (!existingConfig) {
            console.log(`Configuration not found for ID: ${configId}`)
            return NextResponse.json({ error: "Configuration not found" }, { status: 404 })
        }

        const updatedConfig = await prisma.configuration.update({
            where: { id: configId },
            data: {
                ...body,
                updatedAt: new Date(),
            },
        })

        console.log(`Configuration updated successfully: ${configId}`)
        return NextResponse.json(updatedConfig)
    } catch (error) {
        console.error("Error updating configuration:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ configId: string }> }) {
    try {
        const { configId } = await params

        const configuration = await prisma.configuration.findUnique({
            where: { id: configId },
        })

        if (!configuration) {
            return NextResponse.json({ error: "Configuration not found" }, { status: 404 })
        }

        return NextResponse.json(configuration)
    } catch (error) {
        console.error("Error fetching configuration:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
