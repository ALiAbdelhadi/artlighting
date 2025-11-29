import { getLocaleFromParams, getServerI18n } from "@/lib/i18n/utils";
import { constructMetadata } from "@/lib/utils";
import { PagePropsTypes } from "@/types";
import { prisma } from "@repo/database";
import { getTranslations } from "next-intl/server";
import MisterLed from "./mister-led";

export async function generateStaticParams() {
  const categories = await prisma.product.groupBy({
    by: ["sectionType"],
    where: {
      brand: "mister-led",
    },
    orderBy: {
      sectionType: "desc",
    },
  });

  return categories.map((category) => ({
    sectionType: category.sectionType,
  }));
}

export default async function Page({ params }: PagePropsTypes) {
  const locale = getLocaleFromParams(await params);
  const { service } = await getServerI18n(locale);
  const t = await getTranslations('error')
  try {
    const localizedCategories = await service.getLocalizedCategories("mister-led", locale);

    return (
      <>
        <MisterLed categories={localizedCategories} locale={locale} />
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
    en: "Elegant Chandeliers from Mister Led - Elevate Your Home Lighting",
    ar: "نجف أنيق من مستر ليد - ارتقِ بإضاءة منزلك",
  };

  const descriptions = {
    en: `Discover our exquisite collection of chandeliers that bring elegance and style to any room. Find the perfect chandelier to illuminate and enhance your home's décor at affordable prices.`,
    ar: `اكتشف مجموعتنا الفاخرة من النجف التي تضيف لمسة من الأناقة والفخامة لأي غرفة. ابحث عن النجف المثالي لإضاءة منزلك وإبراز جمال ديكورك بأسعار مناسبة.`,
  };

  return constructMetadata({
    title: titles[locale],
    description: descriptions[locale],
    image: "/brand/mrled.png",
    icons: "/misterled.ico",
  });
}