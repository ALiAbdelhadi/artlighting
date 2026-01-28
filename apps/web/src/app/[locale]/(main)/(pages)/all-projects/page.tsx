import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import { getLocaleFromParams } from "@/lib/i18n/utils";
import { constructMetadata } from "@/lib/metadata";
import { PagePropsTypes } from "@/types";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import AllProjectPage from "./all-projects";

export default async function Page({ params }: PagePropsTypes) {
  const { locale } = await params;
  const supportedLocales = ['ar', 'en'];

  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  const t = await getTranslations("allProjects");

  return (
    <AllProjectPage
      locale={locale}
      allProjectsTitle={t("title")}
      noProjectsText={t("noProjects")}
    >
      <Breadcrumb />
    </AllProjectPage>
  );
}

export async function generateMetadata({ params }: PagePropsTypes): Promise<Metadata> {
  const locale = getLocaleFromParams(await params);
  const titles = {
    en: "All Projects | Explore our recent projects",
    ar: "جميع المشاريع | استكشف أحدث مشاريعنا"
  };
  const descriptions = {
    en: "Explore all recent projects that we have completed in the last years. Browse our portfolio of lighting solutions and architectural projects.",
    ar: "استكشف جميع المشاريع الحديثة التي أنجزناها خلال السنوات الأخيرة. تصفح مجموعة أعمالنا في حلول الإضاءة والمشاريع المعمارية."
  };
  return constructMetadata({
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
  });
}
