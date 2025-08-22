import { constructMetadata } from "@/lib/utils"
import { notFound } from "next/navigation"
import Complete from "./complete"
import { prisma } from "@repo/database"
import { getLocale } from "next-intl/server"

interface CompleteProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const page = async ({ searchParams }: CompleteProps) => {
  const { orderId } = await searchParams
  if (!orderId || typeof orderId !== "string") {
    return notFound()
  }

  const locale = await getLocale()

  const order = await prisma.order.findUnique({
    where: { id: Number.parseInt(orderId, 10) },
    include: {
      shippingAddress: true,
      product: {
        include: {
          specifications: {
            where: {
              language: locale,
            },
          },
          translations: {
            where: {
              language: locale,
            },
          },
        },
      },
      user: true,
      configuration: true,
    },
  })

  if (!order) {
    return notFound()
  }

  const localizedProductName = order.product.translations[0]?.name || order.product.productName

  const localizedOrder = {
    ...order,
    productName: localizedProductName,
    product: {
      ...order.product,
      translations: order.product.translations,
      specifications: order.product.specifications,
    },
  }

  return <Complete discount={order.configuration?.discount || 0} brand={order.brand || ""} order={localizedOrder} />
}

export const metadata = constructMetadata({
  title: "Order Confirmed!",
  description: "Please Review you order before completed",
})

export default page
