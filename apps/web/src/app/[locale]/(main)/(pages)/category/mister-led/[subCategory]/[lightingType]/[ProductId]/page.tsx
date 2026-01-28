import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import ProductRouter from "@/components/product-router";
import { getLocaleFromParams, getServerI18n } from "@/lib/i18n/utils";
import { constructMetadata } from "@/lib/metadata";
import { PagePropsTypes } from "@/types";
import { prisma } from "@repo/database";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
    select: {
      productId: true,
      sectionType: true,
      spotlightType: true,
      brand: true,
    },
    where: {
      isActive: true,
      brand: "mister-led",
    },
  });

  const paths = [];
  for (const product of products) {
    for (const locale of ['ar', 'en']) {
      paths.push({
        locale,
        subCategory: product.sectionType,
        lightingType: product.spotlightType,
        ProductId: product.productId,
      });
    }
  }

  return paths;
}

export default async function Page({ params }: PagePropsTypes) {
  const { subCategory, lightingType, ProductId } = await params;
  const locale = getLocaleFromParams(await params);
  const { service } = await getServerI18n(locale);

  try {
    const product = await prisma.product.findUnique({
      where: {
        productId: ProductId,
        sectionType: subCategory,
        spotlightType: lightingType,
        brand: "mister-led",
        isActive: true,
      },
      include: {
        category: {
          include: {
            translations: {
              where: {
                language: locale,
              },
            },
          },
        },
        lightingtype: {
          include: {
            translations: {
              where: {
                language: locale,
              },
            },
          },
        },
        translations: {
          where: {
            language: locale,
          },
        },
        specifications: {
          where: {
            language: locale,
          },
        },
      },
    });

    console.log("Found product:", product ? "Yes" : "No");

    if (!product) {
      console.log("Product not found");
      notFound();
    }

    const localizedName = product.translations?.[0]?.name || product.productName;
    const localizedSpecs = product.specifications?.[0] || {};
    const localizedProduct = {
      ...product,
      productName: localizedName,
      localizedSpecs,
      chandelierLightingType: product.chandelierLightingType || undefined,
      category: product.category,
      lightingType: product.lightingtype,
      productChandelierLamp: (product.productChandLamp as any) || "lamp9w",
      input: localizedSpecs.input || undefined,
      maximumWattage: localizedSpecs.maximumWattage ? parseInt(localizedSpecs.maximumWattage) : undefined,
      brandOfLed: localizedSpecs.brandOfLed || undefined,
      luminousFlux: localizedSpecs.luminousFlux || undefined,
      mainMaterial: localizedSpecs.mainMaterial || undefined,
      cri: localizedSpecs.cri || undefined,
      beamAngle: localizedSpecs.beamAngle || undefined,
      workingTemperature: localizedSpecs.workingTemperature || undefined,
      fixtureDimmable: localizedSpecs.fixtureDimmable || undefined,
      electrical: localizedSpecs.electrical || undefined,
      powerFactor: localizedSpecs.powerFactor || undefined,
      colorTemperature: localizedSpecs.colorTemperature || undefined,
      energySaving: localizedSpecs.energySaving || undefined,
      lifeTime: localizedSpecs.lifeTime || undefined,
      finish: localizedSpecs.finish || undefined,
      lampBase: localizedSpecs.lampBase || undefined,
      ip: localizedSpecs.ip ? parseInt(localizedSpecs.ip) : product.maxIP || undefined,
    };

    let configuration = await prisma.configuration.findFirst({
      where: { productId: product.productId },
    });

    if (!configuration) {
      console.log(`Configuration not found for ProductId: ${product.productId}. Creating new configuration.`);
      configuration = await prisma.configuration.create({
        data: {
          productId: product.productId,
          configPrice: product.price,
          priceIncrease: 0,
          shippingPrice: 0,
          discount: product.discount,
          quantity: 1,
          totalPrice: product.price,
        },
      });
      console.log(`New configuration created with ID: ${configuration.id}`);
    }

    const normalizedConfiguration = configuration ? {
      ...configuration,
      lampPriceIncrease: configuration.lampPriceIncrease ?? undefined,
      productIp: configuration.productIp ?? undefined,
      currency: configuration.currency as any,
    } : undefined;
    let relatedProducts = undefined;
    if (!subCategory || !lightingType || !ProductId) {
      notFound();
    }
    if (product.brand === "mister-led") {
      relatedProducts = await getRelatedMisterLedProducts(localizedProduct, subCategory, locale);
    }
    // related products for chandeliers in the future.
    // else if (product.brand === "mister-led" && product.sectionType === "chandelier") {
    //   relatedProducts = await getRelatedChandelierProducts(localizedProduct, subCategory, locale);
    // }

    return (
      <>
        <Breadcrumb />
        <ProductRouter
          product={localizedProduct as any}
          relatedProducts={relatedProducts as any}
          configuration={normalizedConfiguration as any}
          locale={locale}
        />
      </>
    );
  } catch (error) {
    console.error(`Failed to load product ${ProductId}:`, error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground/90 mb-4">
            {locale === 'ar' ? 'خطأ في تحميل المنتج' : 'Error loading product'}
          </h2>
          <p className="text-muted-foreground">
            {locale === 'ar' ? 'يرجى المحاولة مرة أخرى لاحقاً.' : 'Please try again later.'}
          </p>
        </div>
      </div>
    );
  }
}

export async function generateMetadata({ params }: PagePropsTypes): Promise<Metadata> {
  const { subCategory, ProductId, lightingType } = await params;
  const locale = getLocaleFromParams(await params);

  const product = await prisma.product.findUnique({
    where: {
      productId: ProductId,
      sectionType: subCategory,
      spotlightType: lightingType,
    },
    include: {
      category: {
        include: {
          translations: {
            where: { language: locale },
          },
        },
      },
      lightingtype: {
        include: {
          translations: {
            where: { language: locale },
          },
        },
      },
      translations: {
        where: { language: locale },
      },
      specifications: {
        where: { language: locale },
      },
    },
  });

  if (!product) {
    return constructMetadata({
      title: locale === 'ar' ? "المنتج غير موجود" : "Product Not Found",
      description: locale === 'ar'
        ? "لم يتم العثور على المنتج المطلوب."
        : "The requested product could not be found.",
      icons: "/misterled.ico",
    });
  }

  const localizedName = product.translations?.[0]?.name || product.productName;
  const localizedCategory = product.category?.translations?.[0]?.name || product.category?.name || '';
  const localizedLightingType = product.lightingtype?.translations?.[0]?.name || product.lightingtype?.name || '';
  const specs = product.specifications?.[0];

  const wattage = specs?.maximumWattage || '15';
  const isOutdoor = product.maxIP && product.maxIP >= 65;
  const brandName = product.brand === "mister-led" ? "Balcom" : "Mister LED";

  const titles = {
    en: `${localizedName} - ${wattage}W ${subCategory} ${localizedLightingType} | ${brandName} Lighting`,
    ar: `${localizedName} - ${wattage} وات ${subCategory} ${localizedLightingType} | إضاءة ${brandName}`
  };

  const descriptions = {
    en: `Discover the ${localizedName}, a professional ${wattage}W ${subCategory} ${localizedLightingType.toLowerCase()} perfect for ${localizedCategory.toLowerCase()} applications. ${isOutdoor ? `With an IP rating of IP${product.maxIP}, it's ideal for outdoor use. ` : ""
      }Featuring ${specs?.colorTemperature || 'adjustable color temperature'} and ${specs?.cri ? `CRI of ${specs.cri}, ` : ""
      }this ${specs?.brandOfLed || 'LED'} light offers ${specs?.luminousFlux || 'high brightness'
      } lumens. Professional lighting solutions by ${brandName}!`,
    ar: `اكتشف ${localizedName}، مصباح احترافي ${wattage} وات ${subCategory} ${localizedLightingType.toLowerCase()} مثالي لتطبيقات ${localizedCategory.toLowerCase()}. ${isOutdoor ? `بتصنيف IP${product.maxIP}، مثالي للاستخدام الخارجي. ` : ""
      }يتميز بـ${specs?.colorTemperature || 'درجة حرارة لون قابلة للتعديل'} و${specs?.cri ? `CRI ${specs.cri}، ` : ""
      }هذا المصباح ${specs?.brandOfLed || 'LED'} يوفر ${specs?.luminousFlux || 'سطوع عالي'
      } لومن. حلول إضاءة احترافية من ${brandName}!`
  };

  return constructMetadata({
    title: titles[locale as keyof typeof titles],
    description: descriptions[locale as keyof typeof descriptions],
    icons: "/misterled.ico",
    image: product.productImages[0] || undefined,
  });
}

const getRelatedMisterLedProducts = async (product: any, subCategory: string, locale: string) => {
  const relatedProducts = await prisma.product.findMany({
    where: {
      brand: "mister-led",
      sectionType: subCategory,
      productId: {
        not: product.productId,
      },
      isActive: true,
      OR: [
        {
          spotlightType: product.spotlightType,
        },
        {
          maxIP: {
            gte: Math.max(20, (product.maxIP || 20) - 20),
            lte: (product.maxIP || 65) + 20,
          },
        },
      ],
    },
    include: {
      category: true,
      lightingtype: true,
      translations: {
        where: {
          language: locale,
        },
      },
      specifications: {
        where: {
          language: locale,
        },
      },
    },
    take: 8, 
  });

  return relatedProducts.map((relatedProduct) => ({
    ...relatedProduct,
    productName: relatedProduct.translations?.[0]?.name || relatedProduct.productName,
    localizedSpecs: relatedProduct.specifications?.[0] || {},
    chandelierLightingType: relatedProduct.chandelierLightingType || undefined,
    lightingType: relatedProduct.lightingtype,
    productChandelierLamp: (relatedProduct.productChandLamp as any) || "lamp9w",
    input: relatedProduct.specifications?.[0]?.input || undefined,
    maximumWattage: relatedProduct.specifications?.[0]?.maximumWattage ?
      parseInt(relatedProduct.specifications[0].maximumWattage) : undefined,
    brandOfLed: relatedProduct.specifications?.[0]?.brandOfLed || undefined,
    luminousFlux: relatedProduct.specifications?.[0]?.luminousFlux || undefined,
    mainMaterial: relatedProduct.specifications?.[0]?.mainMaterial || undefined,
    cri: relatedProduct.specifications?.[0]?.cri || undefined,
    beamAngle: relatedProduct.specifications?.[0]?.beamAngle || undefined,
    workingTemperature: relatedProduct.specifications?.[0]?.workingTemperature || undefined,
    fixtureDimmable: relatedProduct.specifications?.[0]?.fixtureDimmable || undefined,
    electrical: relatedProduct.specifications?.[0]?.electrical || undefined,
    powerFactor: relatedProduct.specifications?.[0]?.powerFactor || undefined,
    colorTemperature: relatedProduct.specifications?.[0]?.colorTemperature || undefined,
    energySaving: relatedProduct.specifications?.[0]?.energySaving || undefined,
    lifeTime: relatedProduct.specifications?.[0]?.lifeTime || undefined,
    finish: relatedProduct.specifications?.[0]?.finish || undefined,
    lampBase: relatedProduct.specifications?.[0]?.lampBase || undefined,
    ip: relatedProduct.specifications?.[0]?.ip ?
      parseInt(relatedProduct.specifications[0].ip) : relatedProduct.maxIP || undefined,
  }));
};