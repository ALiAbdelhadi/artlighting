import { constructMetadata } from "@/lib/utils";
import { Metadata } from "next";
import { getLocaleFromParams } from "@/lib/i18n/utils";
import PrivacySection from "./privacy-section";
import { PagePropsTypes } from "@/types";

export default function page() {
  return <PrivacySection />;
}


export async function generateMetadata({ params }: PagePropsTypes): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = getLocaleFromParams(await params);

  const titles: Record<string, string> = {
    en: "Privacy Policy | Art Lighting",
    ar: "سياسة الخصوصية | أرت لايتنج",
  };

  const descriptions: Record<string, string> = {
    en: "Learn about how Art Lighting collects, uses, and protects your personal information.",
    ar: "تعرف على كيفية قيام أرت لايتنج بجمع واستخدام وحماية معلوماتك الشخصية.",
  };

  return constructMetadata({
    title: titles[currentLocale] || titles.en,
    description: descriptions[currentLocale] || descriptions.en,
    twitter: {
      card: "summary_large_image",
      title: titles[currentLocale] || titles.en,
      description: descriptions[currentLocale] || descriptions.en,
    },
  });
}