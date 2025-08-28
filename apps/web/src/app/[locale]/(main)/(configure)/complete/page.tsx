import { getLocaleFromParams } from "@/lib/i18n/utils"
import { constructMetadata } from "@/lib/utils"
import { PagePropsTypes } from "@/types"
import { prisma } from "@repo/database"
import { Metadata } from "next"
import { getLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import Complete from "./complete"

const Page = async ({ searchParams }: PagePropsTypes) => {
  const orderId = searchParams?.orderId

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

  const localizedProductName =
    order.product.translations[0]?.name || order.product.productName

  const localizedOrder = {
    ...order,
    productName: localizedProductName,
    product: {
      ...order.product,
      translations: order.product.translations,
      specifications: order.product.specifications,
    },
  }

  return (
    <Complete
      discount={order.configuration?.discount || 0}
      brand={order.brand || ""}
      order={localizedOrder}
    />
  )
}

export async function generateMetadata({ params, searchParams }: PagePropsTypes): Promise<Metadata> {
  const orderId = searchParams?.orderId
  const { locale: localeParam } = await params
  const locale = getLocaleFromParams(await params)

  const titles: Record<string, string> = {
    en: "Order Confirmed!",
    ar: "تم تأكيد الطلب!",
  }

  const descriptions: Record<string, string> = {
    en: "Please review your order before it is completed.",
    ar: "يرجى مراجعة طلبك قبل إتمامه.",
  }

  let productImage: string = locale === 'ar' ? "/logo-ar.png" : "/logo-en.png"

  if (orderId && typeof orderId === "string") {
    const order = await prisma.order.findUnique({
      where: { id: Number.parseInt(orderId, 10) },
      include: {
        product: true,
      },
    })

    if (order?.product?.productImages?.[0]) {
      productImage = order.product.productImages[0]
    }
  }

  return constructMetadata({
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    image: productImage,
  })
}

export default Page
