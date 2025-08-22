import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import { getLocaleFromParams, getServerI18n } from "@/lib/i18n/utils";
import { constructMetadata } from "@/lib/utils";
import { notFound } from "next/navigation";
import SubCategory from "./sub-category";

interface PageProps {
  params: {
    locale: string;
    subCategory: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { subCategory } = params;
  const locale = getLocaleFromParams(params);
  const { service } = await getServerI18n(locale);

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
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Error loading lighting types
          </h2>
          <p className="text-muted-foreground">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { subCategory } = params;
  const locale = getLocaleFromParams(params);
  const { service } = await getServerI18n(locale);

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