import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { ProductChandLamp } from "@repo/database";
import { addDays, format } from "date-fns";
import { enUS } from "date-fns/locale";
import { Metadata } from "next";
import z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

export const authFormConfirmingOrderSchema = z.object({
  fullName: z.string().min(3, {
    message: "Full Name Must be At Least 3 Characters",
  }),
  phoneNumber: z.string().min(11, {
    message: "Please enter a valid number that contains 11 numbers",
  }),
  address: z.string().max(150, {
    message: "Address Must be clear",
  }),
  state: z.string().min(2, {
    message: "State Must be at least 2 characters like: Nasr City",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters ",
  }),
  zipCode: z
    .string()
    .min(2)
    .max(10, {
      message: "Zip Code Must be clear like cairo zip code: 4461232",
    })
    .optional(),
  country: z.string().min(2, {
    message: "country must be at least 2 characters like : EG",
  }),
});

export const calculateEstimatedDeliveryDate = () => {
  const currentDate = new Date();
  const estimatedDeliveryDate = addDays(currentDate, 4); // Adding 4 days to the current date
  return format(estimatedDeliveryDate, "dd MMM, yyyy", { locale: enUS });
};

export function isProductChandLamp(value: string): value is ProductChandLamp {
  return value === "lamp9w" || value === "lamp12w";
}

