"use client";

import { Button } from "@/components/ui/button";
import { Clock, X } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/container";
import { useTranslations } from "next-intl";

export default function WhiteFridayBanner() {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const t = useTranslations("banner");

  const handleClose = () => {
    setIsBannerVisible(false);
  };

  if (!isBannerVisible) return null;

  return (
    <div className="bg-gradient-to-r to-primary via-accent from-secondary text-primary-foreground shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" />
      <Container>
        <div className="flex flex-col sm:flex-row justify-between items-center py-6 px-4 sm:px-6 relative z-10">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0 rtl:space-x-reverse">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              {t("title")}
            </h2>
          </div>
          <div className="flex flex-col items-center sm:items-end space-y-2 rtl:sm:items-start">
            <p className="font-bold flex items-center flex-wrap justify-center sm:justify-end rtl:sm:justify-start">
              <span className="mr-2 rtl:mr-0 rtl:ml-2 inline-block animate-bounce text-lg sm:text-xl md:text-2xl lg:text-3xl text-primary-foreground">
                {t("discount")}
              </span>
              <span className="text-base sm:text-lg md:text-xl font-semibold px-2 py-1 rounded-md">
                {t("products")}
              </span>
            </p>
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm sm:text-base bg-primary-foreground/20 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground rtl:ml-2" />
              <span>{t("limitedOffer")}</span>
            </div>
          </div>
        </div>
      </Container>
      <Button
        onClick={handleClose}
        variant="ghost"
        size="icon"
        className="absolute z-50 cursor-pointer right-2 top-2 sm:right-4 rtl:right-auto rtl:left-2 rtl:sm:left-4 text-primary-foreground hover:text-black transition-colors duration-300"
        aria-label="Close banner"
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6" />
      </Button>
    </div>
  );
}