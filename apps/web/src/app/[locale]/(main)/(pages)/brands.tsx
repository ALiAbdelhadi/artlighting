"use client";

import { Badge } from "@/components/ui/badge";
import { brandConfig, brands, isBrandComingSoon, isBrandFeatured } from "@/constants";
import { Container } from "@/components/container";
import { ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTheme } from "next-themes";

export default function Brand() {
  const t = useTranslations('brands');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <Container>
        <h2
          className={`font-bold text-2xl md:text-3xl tracking-tight text-center mb-12 ${isRTL ? "font-arabic" : ""
            }`}
        >
          {t('sectionTitle')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands.map((brand) => {
            const isFeatured = isBrandFeatured(brand.id);
            const isComingSoon = isBrandComingSoon(brand.id);
            if (isFeatured) {
              return (
                <Link
                  href={brand.link}
                  key={brand.id}
                  className="relative flex flex-col items-center p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg group border border-border  bg-muted/10"
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  <Image
                    src={isDarkMode ? brand.logo2 : brand.logo1}
                    alt={`${t(`items.${brand.id}.name`)} logo`}
                    width={brandConfig.defaultImage.width}
                    height={brandConfig.defaultImage.height}
                    className="md:mb-4 transition-transform group-hover:scale-105"
                  />
                  <h3 className={`text-xl font-semibold mb-2 ${isRTL ? "font-arabic" : ""
                    }`}>
                    {t(`items.${brand.id}.name`)}
                  </h3>
                  <p className={`text-muted-foreground text-center mb-4 leading-relaxed ${isRTL ? "font-arabic" : ""
                    }`}>
                    {t(`items.${brand.id}.description`)}
                  </p>
                  <span className={`inline-flex items-center text-primary font-medium hover:text-primary-dark transition-colors ${isRTL ? "flex-row-reverse font-arabic" : ""
                    }`}>
                    {t('shopButton')} {t(`items.${brand.id}.name`)}
                    <ArrowRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${isRTL ? "mr-2 rotate-180 group-hover:-translate-x-1" : "ml-2"
                      }`} />
                  </span>
                </Link>
              );
            }
            return (
              <div
                key={brand.id}
                className="relative flex flex-col items-center p-6 bg-muted/10 rounded-lg shadow-md"
                dir={isRTL ? "rtl" : "ltr"}
              >
                <Image
                  src={isDarkMode ? brand.logo2 : brand.logo1}
                  alt={`${t(`items.${brand.id}.name`)} logo`}
                  width={brandConfig.defaultImage.width}
                  height={brandConfig.defaultImage.height}
                  className="mb-4 w-[250px] h-[250px] object-contain"
                />
                <h3 className={`text-xl font-semibold mb-2 ${isRTL ? "font-arabic" : ""}`}>
                  {t(`items.${brand.id}.name`)}
                </h3>
                <p className={`text-muted-foreground text-center mb-4 leading-relaxed ${isRTL ? "font-arabic" : ""
                  }`}>
                  {t(`items.${brand.id}.description`)}
                </p>
                {isComingSoon && (
                  <Badge
                    variant="destructive"
                    className={`absolute top-0 rounded-none transition-all ${isRTL
                      ? "right-0 font-arabic"
                      : "left-0"
                      }`}
                  >
                    {t('comingSoon')}
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}