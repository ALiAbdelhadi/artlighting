import { prisma } from "@repo/database";
import ProductsClient from "./products-client";
import { notFound } from "next/navigation";

interface ProductTranslationData {
  productId: string;
  productName: string;
  brand: string;
  price: number;
  productImages: string[];
  sectionType: string;
  spotlightType: string;
  discount: number;
  chandelierLightingType?: string;
  hNumber?: number;
  maximumWattage?: string;
  mainMaterial?: string;
  beamAngle?: string;
  lampBase?: string;
  translations?: {
    name?: string;
    description?: string;
  };
  specifications?: Array<{
    maximumWattage?: string;
    mainMaterial?: string;
    beamAngle?: string;
    lampBase?: string;
  }>;
}

interface ProductsSectionProps {
  params: Promise<{
    locale: string;
  }>;
}

const ProductsSection = async ({ params }: ProductsSectionProps) => {
  const { locale } = await params;
  const supportedLocales = ['ar', 'en'];
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  const featuredProductIds = [
    "jy-202-15w",
    "jy-540-7w",
    "jy-810-30w",
    "jy-922-30w",
    "jy-lnrd-001b-32w",
    "mc15c001",
    "mc15p400",
    "mc15f001",
    "mc15g001",
    "mc15e004",
    "mc6014-h5",
    "mc6015-h3",
    "mc1608-h6",
    "mc6031-h5d",
    "mc6038-p1",
    "mc6041-p8",
    "mc6051-3",
    "mc6091-h8",
    "mc6094-p1",
    "mc6097-w1",
    "mc7021-h8",
    "mc7091-rod",
    "mc7104-2",
    "mc7105-c1",
    "oh0109-h5",
    "oh1109-h5",
    "oh1203-h5",
    "oh1207-s2",
    "oh1309-h6",
    "oh1601-h6",
    "jy-5050-12v-3000k",
    "jy-un-002-3w",
    "jy-un-009-3w",
    "jy-316-5w",
    "jy-5053-200w",
    "jy-309-36w",
  ]



  try {
    const selectedProducts = await prisma.product.findMany({
      where: {
        productId: { in: featuredProductIds },
        isActive: true,
      },
      include: {
        specifications: {
          where: {
            language: locale
          }
        },
        translations: {
          where: {
            language: locale
          }
        },
        category: {
          include: {
            translations: {
              where: {
                language: locale
              }
            }
          }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ],
    });

    const formattedProducts: ProductTranslationData[] = selectedProducts.map(product => {
      const primaryTranslation = product.translations?.[0];
      const primarySpec = product.specifications?.[0];
      const getLocalizedName = () => {
        if (primaryTranslation?.name) return primaryTranslation.name;
        if (locale === 'ar') return product.productName;
        return product.productName;
      };

      return {
        productId: product.productId,
        productName: getLocalizedName(),
        brand: product.brand,
        price: product.price,
        productImages: product.productImages,
        sectionType: product.sectionType,
        spotlightType: product.spotlightType,
        discount: product.discount,
        chandelierLightingType: product.chandelierLightingType || undefined,
        hNumber: product.hNumber || undefined,
        maximumWattage: primarySpec?.maximumWattage || undefined,
        mainMaterial: primarySpec?.mainMaterial || undefined,
        beamAngle: primarySpec?.beamAngle || undefined,
        lampBase: primarySpec?.lampBase || undefined,
        translations: {
          name: primaryTranslation?.name,
          description: primaryTranslation?.description,
        },
        specifications: product.specifications,
      };
    });
    console.log(`[ProductsSection] Loading ${formattedProducts.length} products for locale: ${locale}`);

    return <ProductsClient products={formattedProducts} locale={locale} />;
  } catch (error) {
    console.error('Products section data fetching error:', error);
    // Graceful degradation with error boundary
    return <ProductsClient products={[]} locale={locale} />;
  }
};

export default ProductsSection;