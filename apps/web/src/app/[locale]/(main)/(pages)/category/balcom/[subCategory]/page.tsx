import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import { getLocaleFromParams, getServerI18n } from "@/lib/i18n/utils";
import { constructMetadata } from "@/lib/utils";
import { notFound } from "next/navigation";
import SubCategory from "./sub-category";
import { PagePropsTypes } from "@/types";
import { getTranslations } from "next-intl/server";

export default async function Page({ params }: PagePropsTypes) {
  const { subCategory } = await params;
  const locale = getLocaleFromParams(await params);
  const { service } = await getServerI18n(locale);
  const t = await getTranslations('error')
  if (!subCategory) {
    notFound();
  }
  try {
    const localizedLightingTypes = await service.getLocalizedLightingTypes(
      "balcom",
      subCategory,
      locale
    );

    if (!localizedLightingTypes.length) {
      notFound();
    }

    return (
      <>
        <Breadcrumb />
        <SubCategory
          subCategorySlug={subCategory}
          subCategoryName={localizedLightingTypes[0]?.localizedCategoryName ?? subCategory}
          lightingTypes={localizedLightingTypes}
          locale={locale}
        />
      </>
    );
  } catch (error) {
    console.error(`Failed to load ${subCategory} lighting types:`, error);
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

export async function generateMetadata({ params }: PagePropsTypes) {
  const { subCategory } = await params;
  const locale = getLocaleFromParams(await params);
  const { service } = await getServerI18n(locale);
  if (!subCategory) {
    notFound();
  }
  try {
    const localizedLightingTypes = await service.getLocalizedLightingTypes(
      "balcom",
      subCategory,
      locale
    );

    if (!localizedLightingTypes.length) {
      notFound();
    }


    const titles = {
      en: `Explore ${localizedLightingTypes[0]?.localizedCategoryName} - Balcom Products`,
      ar: `استكشف ${localizedLightingTypes[0]?.localizedCategoryName} - منتجات بالكوم`
    };

    const descriptions = {
      en: `Discover the best ${localizedLightingTypes[0]?.localizedCategoryName} products in our Balcom collection. Check out our range of high-quality products at affordable prices.`,
      ar: `اكتشف أفضل منتجات ${localizedLightingTypes[0]?.localizedCategoryName} في مجموعة بالكوم. تحقق من مجموعتنا من المنتجات عالية الجودة بأسعار معقولة.`
    };

    return constructMetadata({
      title: titles[locale],
      description: descriptions[locale],
      image: "/brand/balcom.png",
      icons: "/balcom.ico",
    });
  } catch (error) {
    console.error("Error generating metadata:", error);
    return constructMetadata({
      title: "Balcom Products",
      description: "Explore our Balcom product range.",
      image: "/brand/balcom.png",
      icons: "/balcom.ico",
    });
  }
}