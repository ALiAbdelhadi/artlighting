
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Preview from "./preview"
import { prisma } from "@repo/database"

interface PageProps {
  params: Promise<{
    ProductId: string
  }>
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { ProductId } = await params
  const { id } = await searchParams

  if (!ProductId && (!id || typeof id !== "string")) {
    return notFound()
  }

  let configuration = null
  let product = null

  if (ProductId) {
    configuration = await prisma.configuration.findFirst({
      where: { ProductId },
    })
    product = await prisma.product.findUnique({
      where: { productId: ProductId },
    })
  }

  if (!configuration && id && typeof id === "string") {
    configuration = await prisma.configuration.findUnique({
      where: { id },
    })
    if (configuration) {
      product = await prisma.product.findUnique({
        where: { productId: configuration.ProductId },
      })
    }
  }

  if (!configuration || !product) {
    return notFound()
  }

  return <Preview configuration={configuration} discount={configuration.discount} productId={configuration.ProductId} />
}

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { ProductId } = await params

  const product = await prisma.product.findFirst({
    where: { productId: ProductId },
  })

  if (!product) {
    return {
      title: "Unknown Product",
      description: "Product not found",
    }
  }

  let titleToSectionType = product.sectionType
  let typeOfSpotlight = ""

  switch (product.sectionType) {
    case "indoor":
      titleToSectionType = "Indoor lighting"
      typeOfSpotlight = "Ideal for homes and offices"
      break
    case "outdoor":
      titleToSectionType = "Outdoor lighting"
      typeOfSpotlight = "Create the perfect ambiance for outdoor entertaining"
      break
    case "chandelier":
      titleToSectionType = "Chandelier"
      typeOfSpotlight = "A chandelier is a branched, decorative lighting fixture designed to be hung from the ceiling."
      break
  }

  return {
    title: `Preview ${product.productName} LED Spotlight | ${product.Brand} | Energy Efficient ${titleToSectionType}`,
    description: `Preview of ${product.productName} With a high CRI ${product.cri}, and high beam angle of ${product.beamAngle} this spotlight provides bright, ${typeOfSpotlight}`,
  }
}

export default Page
