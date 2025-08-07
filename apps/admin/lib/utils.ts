
import { Metadata } from "next";

export function constructMetadata({
  title = "Art Lighting Company - Professional lighting: Shop Spotlights, Light Poles, and LED Lights",
  description = "Art Lighting Company: Elevate your spaces with exquisite Indoor and outdoor lighting solutions. Explore our curated selection of spotlights, light poles, LED fixtures, chandeliers, linear lighting, and bollards, meticulously crafted for enduring brilliance and energy efficiency. Experience the Art Lighting difference – exceptional illumination at exceptional value.",
  image = "/Logo.png",
  icons = "/favicon.ico",
  openGraph,
  twitter,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  openGraph?: Metadata["openGraph"];
  twitter?: Metadata["twitter"];
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: openGraph ?? {
      type: "website",
      locale: "ar_EG",
      url: "https://eg-artlighting.vercel.app/",
      siteName: "Art Lighting Company",
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Art Lighting Company Logo",
        },
      ],
    },
    twitter: twitter ?? {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@ArtLightingEG",
      site: "@ArtLightingEG",
    },
    icons,
    keywords: [
      "Lighting",
      "LED",
      "Spotlight",
      "Flood Light",
      "Spikes",
      "Balcom",
      "Jetra",
      "mister-led",
      "Bollard",
      "Poles",
      "إضاءة عامة",
      "إضاءة وظيفية",
      "إضاءة زخرفية",
      "إضاءة طوارئ",
      "إضاءة غرفة نوم",
      "إضاءة معيشة",
      "إضاءة مطبخ",
      "إضاءة حمام",
      "إضاءة مدخل",
      "إضاءة متاجر",
      "إضاءة مكاتب",
      "إضاءة مطاعم",
      "إضاءة فنادق",
      "إضاءة مصانع",
      "إضاءة مخازن",
      "إضاءة ورش عمل",
      "إضاءة حدائق",
      "إضاءة واجهات",
      "إضاءة ملاعب",
      "إضاءة شوارع",
      "لمبات LED",
      "لمبات فلورسنت",
      "لمبات هالوجين",
      "لمبات زئبق",
      "لمبات صوديوم",
      "إضاءة مباشرة",
      "إضاءة غير مباشرة",
      "إضاءة موجهة",
      "ثريات حديد",
      "ثريات نحاس",
      "ديمر",
      "فلتر",
      "رفلكتور",
      "تصميم الإضاءة",
      "تركيب الإضاءة",
    ],
    metadataBase: new URL("https://eg-artlighting.vercel.app/"),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: "https://eg-artlighting.vercel.app/",
    },
    other: {
      "application-name": "Art Lighting Company",
    },
  };
}
