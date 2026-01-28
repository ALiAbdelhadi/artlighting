import { getLocaleFromParams, getServerI18n } from "@/lib/i18n/utils";
import { constructMetadata } from "@/lib/metadata";
import { PagePropsTypes } from "@/types";
import Balcom from "./balcom";

export default async function Page({ params }: PagePropsTypes) {
  const locale = getLocaleFromParams(await params);
  const { service } = await getServerI18n(locale);

  try {
    const localizedCategories = await service.getLocalizedCategories("balcom", locale);

    return (
      <>
        <Balcom
          categories={localizedCategories}
          locale={locale}
        />
      </>
    );
  } catch (error) {
    console.error("Failed to load Balcom categories:", error);
    return (
      <div className="container mx-auto py-8">
        <h1>Error loading categories</h1>
        <p>Please try again later.</p>
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