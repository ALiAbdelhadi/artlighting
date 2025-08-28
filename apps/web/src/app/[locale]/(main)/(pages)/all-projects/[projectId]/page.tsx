import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb"
import { getLocaleFromParams } from "@/lib/i18n/utils"
import { constructMetadata } from "@/lib/utils"
import { PagePropsTypes } from "@/types"
import type { SupportedLanguage } from "@/types/products"
import { Metadata } from "next"
import Project from "./project"

export default async function Page({ params }: PagePropsTypes) {
  const resolvedParams = await params;
  return (
    <Project locale={resolvedParams?.locale as SupportedLanguage}>
      <Breadcrumb />
    </Project>
  )
}

export async function generateMetadata({ params }: PagePropsTypes): Promise<Metadata> {
  const locale = getLocaleFromParams(await params);
  const titles = {
    en: "All Projects | Explore Our Latest Projects",
    ar: "جميع المشاريع | استكشف أحدث مشاريعنا"
  };
  const descriptions = {
    en: "Explore all the recent projects we have completed in recent years. Browse our portfolio of lighting solutions and architectural projects.",
    ar: "استكشف جميع المشاريع الحديثة التي أنجزناها خلال السنوات الأخيرة. تصفح مجموعة أعمالنا في حلول الإضاءة والمشاريع المعمارية."
  };
  return constructMetadata({
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
  });
}
