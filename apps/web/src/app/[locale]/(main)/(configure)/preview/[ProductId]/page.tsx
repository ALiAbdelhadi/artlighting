import { getLocaleFromParams, getServerI18n } from "@/lib/i18n/utils"
import { PagePropsTypes } from "@/types"
import { prisma } from "@repo/database"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Preview from "./preview"

const Page = async ({ params, searchParams }: PagePropsTypes) => {
  const resolvedParams = await params
  const locale = getLocaleFromParams(resolvedParams)
  const { ProductId } = resolvedParams // Changed to match parameter name
  const resolvedSearchParams = await searchParams
  const id = resolvedSearchParams?.id

  console.log("Preview page - Resolved parameters:", {
    locale,
    ProductId,
    searchParamsId: id,
    timestamp: new Date().toISOString()
  })

  // Initialize i18n service for this locale
  const { service } = await getServerI18n(locale)

  if (!ProductId && (!id || typeof id !== "string")) {
    console.error("Missing required parameters:", { ProductId, id })
    return notFound()
  }

  let configuration = null
  let product = null
  let productSpecification = null

  try {
    if (ProductId) {
      console.log(`Fetching configuration for ProductId: ${ProductId}`)
      configuration = await prisma.configuration.findFirst({
        where: { productId: ProductId },
        orderBy: { updatedAt: 'desc' }
      })

      if (configuration) {
        console.log(`Found configuration: ${configuration.id}`)
      } else {
        console.log(`No configuration found for ProductId: ${ProductId}, creating default`)
        const productExists = await prisma.product.findUnique({
          where: { productId: ProductId },
          select: { productId: true, price: true, discount: true }
        })

        if (productExists) {
          configuration = await prisma.configuration.create({
            data: {
              productId: ProductId,
              configPrice: productExists.price,
              priceIncrease: 0,
              shippingPrice: 69,
              discount: productExists.discount,
              quantity: 1,
              totalPrice: productExists.price,
            },
          })
          console.log(`Created default configuration: ${configuration.id}`)
        }
      }
      product = await prisma.product.findUnique({
        where: { productId: ProductId },
        include: {
          category: {
            include: {
              translations: {
                where: { language: locale }
              }
            }
          },
          lightingtype: {
            include: {
              translations: {
                where: { language: locale }
              }
            }
          },
          translations: {
            where: { language: locale }
          },
          specifications: {
            where: { language: locale }
          }
        }
      })
      productSpecification = await prisma.productSpecification.findUnique({
        where: {
          productId_language: {
            productId: ProductId,
            language: locale
          }
        }
      })
      console.log("Product fetch result:", {
        found: !!product,
        hasTranslations: product?.translations?.length ?? 0,
        hasSpecifications: product?.specifications?.length ?? 0,
      })
    }
    if (!configuration && id && typeof id === "string") {
      console.log(`Fallback: Fetching configuration by ID: ${id}`)

      configuration = await prisma.configuration.findUnique({
        where: { id },
      })

      if (configuration) {
        console.log(`Found configuration by ID: ${configuration.id}, productId: ${configuration.productId}`)

        product = await prisma.product.findUnique({
          where: { productId: configuration.productId },
          include: {
            category: {
              include: {
                translations: {
                  where: { language: locale }
                }
              }
            },
            lightingtype: {
              include: {
                translations: {
                  where: { language: locale }
                }
              }
            },
            translations: {
              where: { language: locale }
            },
            specifications: {
              where: { language: locale }
            }
          }
        })

        productSpecification = await prisma.productSpecification.findUnique({
          where: {
            productId_language: {
              productId: configuration.productId,
              language: locale
            }
          }
        })
      }
    }

    if (!configuration) {
      console.error("Configuration not found after all attempts")
      return notFound()
    }

    if (!product) {
      console.error("Product not found after all attempts")
      return notFound()
    }
    const localizedProduct = {
      ...product,
      productName: product.translations?.[0]?.name || product.productName,
      description: product.translations?.[0]?.description || null,
      localizedSpecs: product.specifications?.[0] || {},
      categoryName: product.category?.translations?.[0]?.name || product.category?.name,
      lightingTypeName: product.lightingtype?.translations?.[0]?.name || product.lightingtype?.name
    }

    console.log("Final data for preview:", {
      configurationId: configuration.id,
      productId: localizedProduct.productId,
      productName: localizedProduct.productName,
      hasLocalizedSpecs: !!localizedProduct.localizedSpecs,
      locale
    })

    return (
      <Preview
        configuration={configuration}
        discount={configuration.discount}
        productId={configuration.productId}
        product={localizedProduct}
        locale={locale}
      />
    )
  } catch (error) {
    console.error("Error loading preview data:", error)
    console.error("Stack trace:", error instanceof Error ? error.stack : "Unknown error")
    return notFound()
  }
}

export const generateMetadata = async ({ params }: PagePropsTypes): Promise<Metadata> => {
  const resolvedParams = await params
  const locale = getLocaleFromParams(resolvedParams)
  const { ProductId } = resolvedParams

  try {
    const product = await prisma.product.findFirst({
      where: { productId: ProductId },
      include: {
        translations: {
          where: { language: locale }
        },
        specifications: {
          where: { language: locale }
        }
      }
    })

    if (!product) {
      const fallbackTitles = {
        en: "Unknown Product",
        ar: "منتج غير معروف"
      } as const

      const fallbackDescriptions = {
        en: "Product not found",
        ar: "المنتج غير موجود"
      } as const

      return {
        title: fallbackTitles[locale as keyof typeof fallbackTitles] || fallbackTitles.en,
        description: fallbackDescriptions[locale as keyof typeof fallbackDescriptions] || fallbackDescriptions.en,
      }
    }

    const localizedName = product.translations?.[0]?.name || product.productName
    const specification = product.specifications?.[0]

    let titleToSectionType = product.sectionType
    let typeOfSpotlight = ""

    const sectionTypeTranslations = {
      indoor: {
        en: { title: "Indoor lighting", description: "Ideal for homes and offices" },
        ar: { title: "الإضاءة الداخلية", description: "مثالية للمنازل والمكاتب" }
      },
      outdoor: {
        en: { title: "Outdoor lighting", description: "Create the perfect ambiance for outdoor entertaining" },
        ar: { title: "الإضاءة الخارجية", description: "اخلق الأجواء المثالية للترفيه في الهواء الطلق" }
      },
      chandelier: {
        en: { title: "Chandelier", description: "A chandelier is a branched, decorative lighting fixture designed to be hung from the ceiling." },
        ar: { title: "ثريا", description: "الثريا هي تركيبة إضاءة زخرفية متفرعة مصممة للتعليق من السقف." }
      }
    } as const

    const sectionData = sectionTypeTranslations[product.sectionType as keyof typeof sectionTypeTranslations]
    if (sectionData) {
      const localeData = sectionData[locale as keyof typeof sectionData] || sectionData.en
      titleToSectionType = localeData.title
      typeOfSpotlight = localeData.description
    }

    const titleTemplates = {
      en: `Preview ${localizedName} LED Spotlight | ${product.brand} | Energy Efficient ${titleToSectionType}`,
      ar: `معاينة ${localizedName} كشاف LED | ${product.brand} | ${titleToSectionType} موفر للطاقة`
    } as const

    const descriptionTemplates = {
      en: `Preview of ${localizedName} With a high CRI ${specification?.cri || 'N/A'}, and high beam angle of ${specification?.beamAngle || 'N/A'} this spotlight provides bright, ${typeOfSpotlight}`,
      ar: `معاينة ${localizedName} بمؤشر إضاءة عالي ${specification?.cri || 'غير متاح'}، وزاوية شعاع عالية ${specification?.beamAngle || 'غير متاح'} يوفر هذا الكشاف إضاءة ساطعة، ${typeOfSpotlight}`
    } as const
    const imageUrl = product.productImages?.[0]

    return {
      title: titleTemplates[locale as keyof typeof titleTemplates] || titleTemplates.en,
      description: descriptionTemplates[locale as keyof typeof descriptionTemplates] || descriptionTemplates.en,
      openGraph: {
        images: [imageUrl]
      },
      twitter: {
        card: "summary_large_image",
        images: [imageUrl]
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return {
      title: "Preview Product",
      description: "Product preview page",
    }
  }
}

export default Page