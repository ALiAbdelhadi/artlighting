import { getLocaleFromParams } from "@/lib/i18n/utils"
import { constructMetadata } from "@/lib/utils"
import { PagePropsTypes } from "@/types"
import { prisma } from "@repo/database"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import Confirm from "./confirm"  

export default async function Page({ searchParams }: PagePropsTypes) {
  const resolvedSearchParams = await searchParams;
  const orderId = resolvedSearchParams?.orderId;

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

export async function generateMetadata({ params, searchParams }: PagePropsTypes): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const orderId = resolvedSearchParams?.orderId
  const { locale: localeParam } = await params
  const locale = getLocaleFromParams(await params)

  const titles: Record<string, string> = {
    en: "Confirm your order by typing all your info",
    ar: "أكد طلبك عن طريق كتابة جميع معلوماتك",
  }

  const descriptions: Record<string, string> = {
    en: "Review your order carefully and click 'Send data' to confirm. Once submitted",
    ar: "راجع طلبك بعناية واضغط على زر 'إرسال البيانات' للتأكيد. بمجرد الإرسال...",
  }

  let productImage: string = locale === 'ar' ? "/logo-ar.png" : "/logo-en.png"

  if (orderId && typeof orderId === "string") {
    const order = await prisma.order.findUnique({
      where: { id: Number.parseInt(orderId, 10) },
      include: {
        configuration: true,
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
