import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import { getLocaleFromParams, getServerI18n } from "@/lib/i18n/utils";
import { constructMetadata } from "@/lib/utils";
import Balcom from "./balcom";
import { PagePropsTypes } from "@/types";
import { getTranslations } from "next-intl/server";

export default async function Page({ params }: PagePropsTypes) {
  const locale = getLocaleFromParams(await params);
  const { service } = await getServerI18n(locale);
  const t = await getTranslations("error");
  try {
    const localizedCategories = await service.getLocalizedCategories("balcom", locale);

    return (
      <>
        <Balcom
          categories={localizedCategories}
          locale={locale}
        />
        <Breadcrumb />
      </>
    );
  } catch (error) {
    console.error("Failed to load Balcom categories:", error);
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
  const locale = getLocaleFromParams(await params);

  const titles = {
    en: "Our Brand Balcom has different types of lighting such as Indoor lighting and outdoor lighting",
    ar: "علامة بالكوم التجارية لديها أنواع مختلفة من الإضاءة مثل الإضاءة الداخلية والخارجية"
  };

  const descriptions = {
    en: "Explore our range of Indoor And Outdoor Products with different styles and fix all lighting problem. Find the best products at affordable prices.",
    ar: "استكشف مجموعتنا من المنتجات الداخلية والخارجية بأساليب مختلفة وحل جميع مشاكل الإضاءة. اعثر على أفضل المنتجات بأسعار معقولة."
  };

  return constructMetadata({
    title: titles[locale],
    description: descriptions[locale],
    image: "/brand/balcom.png",
    icons: "/balcom.ico",
  });
}