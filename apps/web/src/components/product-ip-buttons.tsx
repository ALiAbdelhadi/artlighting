"use client";

import { updateProductIP } from "@/actions/product-ip";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, formatNumber } from "@/lib/utils";
import { ProductIP } from "@repo/database";
import { Droplets } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const PRODUCT_IP_LABEL_MAP: Record<
  ProductIP,
  { label: string; description: string; increaseOnPricePercent: number }
> = {
  IP20: {
    label: "IP 20",
    description: "Protected against solid objects over 12mm",
    increaseOnPricePercent: 0,
  },
  IP44: {
    label: "IP 44",
    description: "Protected against water splashes from all directions",
    increaseOnPricePercent: 0.02,
  },
  IP54: {
    label: "IP 54",
    description: "Protected against dust and water splashes",
    increaseOnPricePercent: 0.04,
  },
  IP65: {
    label: "IP 65",
    description: "Dust tight and protected against water jets",
    increaseOnPricePercent: 0.06,
  },
  IP68: {
    label: "IP 68",
    description: "Dust tight and protected against long periods of immersion",
    increaseOnPricePercent: 0.08,
  },
};

interface ProductIPButtonsProps {
  productId: string;
  configId: string;
  productIp: ProductIP;
  maxIP: string;
  basePrice: number;
  discount: number;
  onProductIpChange: (newProductIp: ProductIP, priceIncrease: number) => void;
}

export default function ProductIPButtons({
  productId,
  configId,
  productIp,
  basePrice,
  discount,
  onProductIpChange,
}: ProductIPButtonsProps) {
  const [selectedIp, setSelectedIp] = useState<ProductIP>(productIp);
  const [isUpdating, setIsUpdating] = useState(false);
  const t = useTranslations("product-ip");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const calculatePriceIncrease = useCallback((ip: ProductIP) => {
    const { increaseOnPricePercent } = PRODUCT_IP_LABEL_MAP[ip];
    return Math.ceil(basePrice * increaseOnPricePercent);
  }, [basePrice]);

  useEffect(() => {
    const priceIncrease = calculatePriceIncrease(selectedIp);
    onProductIpChange(selectedIp, priceIncrease);
  }, [selectedIp, calculatePriceIncrease, onProductIpChange]);

  const handleIpChange = useCallback(async (newIp: ProductIP) => {
    if (newIp === selectedIp || isUpdating) return;

    setIsUpdating(true);

    try {
      const priceIncrease = calculatePriceIncrease(newIp);

      await updateProductIP({
        productId,
        configId,
        newProductIp: newIp,
        priceIncrease,
      });

      setSelectedIp(newIp);
      toast.success(t("change-success"));
    } catch (error) {
      console.error("Failed to change IP rating:", error);
      toast.error(t("change-error"));
    } finally {
      setIsUpdating(false);
    }
  }, [selectedIp, isUpdating, productId, configId, calculatePriceIncrease, t]);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold mb-2">{t("title")}</h3>
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-2">
        {Object.entries(PRODUCT_IP_LABEL_MAP).map(
          ([ip, { label, description, increaseOnPricePercent }]) => {
            const displayedIncrease = calculatePriceIncrease(ip as ProductIP);

            return (
              <TooltipProvider key={ip}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => handleIpChange(ip as ProductIP)}
                      disabled={isUpdating}
                      variant={selectedIp === ip ? "default" : "outline"}
                      className={cn(
                        "flex items-center justify-center w-full rounded-full transition-all duration-200",
                        selectedIp === ip
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-background hover:bg-secondary",
                        isUpdating && "opacity-60 cursor-not-allowed"
                      )}
                    >
                      <Droplets className="w-4 h-4 mr-1" />
                      <span className={cn("rtl:mr-1 ltr:ml-1")}>
                        {t(`ratings.${ip}.label`)}
                      </span>
                      {displayedIncrease > 0 && (
                        <span className="ml-2 text-sm opacity-70">
                          +{formatNumber(displayedIncrease, isRTL ? "ar" : "en")}
                        </span>
                      )}
                      {isUpdating && selectedIp === ip && (
                        <div className="ml-2 animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="block font-medium max-w-xs">
                    <p>{t(`ratings.${ip}.description`)}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {t("onlyAvailableRating")}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          },
        )}
      </div>
    </div>
  );
}