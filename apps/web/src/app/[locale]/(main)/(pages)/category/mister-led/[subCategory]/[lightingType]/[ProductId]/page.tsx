import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import ProductRouter from "@/components/product-router";
import { getLocaleFromParams, getServerI18n } from "@/lib/i18n/utils";
import { constructMetadata } from "@/lib/utils";
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

  console.log("Fetching product with params:", { ProductId, subCategory, lightingType, locale });

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

    // Create product with localized data and proper type conversion
    const localizedProduct = {
      ...product,
      productName: localizedName,
      localizedSpecs,
      // Convert null to undefined for chandelierLightingType
      chandelierLightingType: product.chandelierLightingType || undefined,
      category: product.category,
      lightingtype: product.lightingtype,
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

    // Conditionally fetch related products based on product type
    let relatedProducts = undefined;
    if (!subCategory || !lightingType || !ProductId) {
      notFound();
    }

    return (
      <>
        <Breadcrumb />
        <ProductRouter
          product={localizedProduct}
          relatedProducts={undefined}
          configuration={configuration}
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
      locale,
      pathname: `/${locale}/category/mister-led/${subCategory}/${lightingType}/${ProductId}`,
    });
  }

  const localizedName = product.translations?.[0]?.name || product.productName;
  
  // Get properly localized category and lighting type names
  const localizedCategory = product.category?.translations?.[0]?.name || product.category?.name || '';
  const localizedLightingType = product.lightingtype?.translations?.[0]?.name || product.lightingtype?.name || '';
  
  // Use fallback translations if not found in database
  const fallbackTranslations = {
    chandelier: {
      ar: 'نجفة',
      en: 'chandelier'
    },
    // Add other categories as needed
  };
  
  const categoryName = localizedCategory || fallbackTranslations[subCategory as keyof typeof fallbackTranslations]?.[locale as 'ar' | 'en'] || subCategory;
  const lightingTypeName = localizedLightingType || lightingType;
  
  const specs = product.specifications?.[0];

  const computeMetaWattage = () => {
    if (product.brand === 'mister-led' && product.sectionType === 'chandelier') {
      if (product.chandelierLightingType === 'lamp') {
        const total = (product.hNumber ?? 0) * 12;
        if (total > 0) return String(total);
      }
      
      if (product.chandelierLightingType === 'LED') {
        // First check localized specs
        const localizedMaxWattage = specs?.maximumWattage;
        if (localizedMaxWattage && Number(localizedMaxWattage) > 0) {
          return localizedMaxWattage;
        }
        
        // Then check product direct property
        if (product?.maximumWattage && Number(product?.maximumWattage) > 0) {
          return String(product?.maximumWattage);
        }
        
        // Extract from name as fallback
        const name = product.translations?.[0]?.name || product.productName || '';
        const match = /([0-9]{1,4})\s*W/i.exec(name);
        if (match) {
          const parsed = Number(match[1]);
          if (parsed > 0) return String(parsed);
        }
      }
    }
    
    // For non-chandelier products or fallback
    const localizedMaxWattage = specs?.maximumWattage;
    if (localizedMaxWattage && Number(localizedMaxWattage) > 0) {
      return localizedMaxWattage;
    }
    
    if (product?.maximumWattage && Number(product.maximumWattage) > 0) {
      return String(product?.maximumWattage);
    }
    
    return '15'; // Default fallback
  };

  const wattage = computeMetaWattage();
  const isOutdoor = product.maxIP && product.maxIP >= 65;
  const brandName = product.brand === "mister-led" ? "Mister LED" : "Balcom";

  const titles = {
    en: `${localizedName} - ${wattage}W ${categoryName} ${lightingTypeName} | ${brandName} Lighting`,
    ar: `${localizedName} - ${wattage} وات ${categoryName} ${lightingTypeName} | إضاءة ${brandName}`
  };

  const descriptions = {
    en: `Discover the ${localizedName}, a professional ${wattage}W ${categoryName} ${lightingTypeName?.toLowerCase()} perfect for ${categoryName?.toLowerCase()} applications. ${isOutdoor ? `With an IP rating of IP${product.maxIP}, it's ideal for outdoor use. ` : ""
      }Featuring ${specs?.colorTemperature || 'adjustable color temperature'} and ${specs?.cri ? `CRI of ${specs.cri}, ` : ""
      }this ${specs?.brandOfLed || 'LED'} light offers ${specs?.luminousFlux || 'high brightness'
      } lumens. Professional lighting solutions by ${brandName}!`,
    ar: `اكتشف ${localizedName}، مصباح احترافي ${wattage} وات ${categoryName} ${lightingTypeName?.toLowerCase()} مثالي لتطبيقات ${categoryName?.toLowerCase()}. ${isOutdoor ? `بتصنيف IP${product.maxIP}، مثالي للاستخدام الخارجي. ` : ""
      }يتميز بـ${specs?.colorTemperature || 'درجة حرارة لون قابلة للتعديل'} و${specs?.cri ? `CRI ${specs.cri}، ` : ""
      }هذا المصباح ${specs?.brandOfLed || 'LED'} يوفر ${specs?.luminousFlux || 'سطوع عالي'
      } لومن. حلول إضاءة احترافية من ${brandName}!`
  };

  return constructMetadata({
    title: titles[locale as keyof typeof titles],
    description: descriptions[locale as keyof typeof descriptions],
    icons: "/misterled.ico",
    image: product.productImages[0] || undefined,
    locale,
    pathname: `/${locale}/category/mister-led/${subCategory}/${lightingType}/${ProductId}`,
  });
}