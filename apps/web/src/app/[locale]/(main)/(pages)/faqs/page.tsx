import { constructMetadata } from "@/lib/utils";
import FAQs from "./faq-section";
import { Metadata } from "next";

interface PageProps {
  params: {
    locale: string
  }
}
export default function FAQsPage() {
  return <FAQs />;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = params;

  const titles: Record<string, string> = {
    en: "FAQs",
    ar: "الأسئلة الشائعة",
  };

  const descriptions: Record<string, string> = {
    en: "Most asked questions about our lighting products.",
    ar: "أكثر الأسئلة شيوعًا حول منتجات الإضاءة الخاصة بنا.",
  };

  return constructMetadata({
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
  });
}
