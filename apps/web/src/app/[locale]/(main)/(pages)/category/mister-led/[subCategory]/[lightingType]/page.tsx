import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import { getLocaleFromParams, getServerI18n } from "@/lib/i18n/utils";
import { constructMetadata } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import LightingType from "./lighting-type";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: {
    locale: string;
    subCategory: string;
    lightingType: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { locale: localeParam, subCategory, lightingType } = params;
  const locale = getLocaleFromParams(params);
  const { service } = await getServerI18n(locale);
  const t = await getTranslations('error')
  try {
    const lightingTypes = await service.getLocalizedLightingTypes("mister-led", subCategory, locale);

    const currentLightingType = lightingTypes.find(
      (lt: any) => lt.slug === lightingType || lt.localizedSlug === lightingType || lt.spotlightType === lightingType
    );

    if (!currentLightingType) {
      console.warn(`Lighting type not found: ${lightingType} in ${subCategory}`);
      notFound();
    }
    const { products, total } = await service.getLocalizedProducts(
      {
        brand: "mister-led",
        sectionType: subCategory,
        spotlightType: currentLightingType.spotlightType,
      },
      locale,
      {
        page: 1,
        limit: 50,
      },
      {
        includeSpecifications: true,
        includeTranslations: true,
        includeImages: true
      }
    );
    const productsWithHNumber = products.filter(p => p.hNumber !== undefined && p.hNumber !== null);
    const productsWithChandelierType = products.filter(p => p.chandelierLightingType);

    console.log('[Page] Data validation:', {
      totalProducts: products.length,
      productsWithHNumber: productsWithHNumber.length,
      productsWithChandelierType: productsWithChandelierType.length,
      allProductsHaveSpecifications: products.every(p => p.specifications || p.specificationsArray?.length > 0),
    });

    const displayName = currentLightingType.localizedName;
    return (
      <>
        <Breadcrumb />
        <LightingType
          products={products}
          subCategory={subCategory}
          lightingType={displayName}
          locale={locale}
          total={total}
        />
      </>
    );
  } catch (error) {
    console.error(`[Page] Failed to load products for ${subCategory}/${lightingType}:`, error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground/90 mb-4">
            {t('title')}
          </h2>
          <p className="text-muted-foreground">
            {t('message')}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {error instanceof Error ? error.message : t('unknown_error')}
          </p>
        </div>
      </div>
    );
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { subCategory, lightingType, locale: localeParam } = params;
  const locale = getLocaleFromParams(params);

  const titles = {
    en: `Mister led ${subCategory} - ${lightingType}`,
    ar: `مستر ليد ${subCategory} - ${lightingType}`
  };

  const descriptions = {
    en: `Discover Mister led's ${subCategory} lighting solutions offering ${lightingType}`,
    ar: `اكتشف حلول الإضاءة ${subCategory} من مستر ليد مع مجموعة ${lightingType} الأنيقة والعملية`
  };

  return constructMetadata({
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    image: "/brand/mrled.png",
    icons: "/misterled.ico",
  });
}