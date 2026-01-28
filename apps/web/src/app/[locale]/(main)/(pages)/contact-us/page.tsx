import { constructMetadata } from "@/lib/metadata";
import ContactContent from "./contact-us-section";
import { getLocaleFromParams } from "@/lib/i18n/utils";
import { Metadata } from "next";
import { PagePropsTypes } from "@/types";

export default function page() {
  return <ContactContent />;
}


export async function generateMetadata({ params }: PagePropsTypes): Promise<Metadata> {
  const locale = getLocaleFromParams(await params);
  const titles = {
    en: "Contact Us",
    ar: "اتصل بنا"
  };
  const descriptions = {
    en: "Have a question or want to work with us? Reach out and we'll get back to you as soon as we can.",
    ar: "هل لديك سؤال أو ترغب بالعمل معنا؟ تواصل معنا وسنرد عليك في أقرب وقت ممكن."
  };
  return constructMetadata({
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
  });
}
