
import { constructMetadata } from "@/lib/utils"
import { prisma } from "@repo/database"
import { notFound } from "next/navigation"
import Confirm from "./confirm"

interface ConfirmProps {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

export default async function page({ searchParams }: ConfirmProps) {
  const { orderId } = await searchParams

  if (!orderId || typeof orderId !== "string") {
    return notFound()
  }

  const order = await prisma.order.findUnique({
    where: { id: Number.parseInt(orderId, 10) },
    include: {
      configuration: true,
      product: true,
    },
  })

  if (!order) {
    return notFound()
  }

  return <Confirm />
}

export const metadata = constructMetadata({
  title: "Confirm your order by typing all your info",
  description: "Review your order carefully and click 'Send data' to confirm. Once submitted",
})

