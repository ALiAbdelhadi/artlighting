"use client";

import { updateProductIP } from "@/actions/product-ip";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProductIP } from "@repo/database";
import { cn } from "@repo/ui";
import { Button } from "@repo/ui/button";
import { Droplets } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

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
  maxIP: string
  basePrice: number;
  onProductIpChange: (newProductIp: ProductIP, priceIncrease: number) => void;
}

export default function ProductIPButtons({
  productId,
  configId,
  productIp,
  basePrice,
  onProductIpChange,
}: ProductIPButtonsProps) {
  const [selectedIp, setSelectedIp] = useState<ProductIP>(productIp);

  useEffect(() => {
    const { increaseOnPricePercent } = PRODUCT_IP_LABEL_MAP[selectedIp];
    const priceIncrease = basePrice * increaseOnPricePercent;
    onProductIpChange(selectedIp, priceIncrease);
  }, [selectedIp, basePrice, onProductIpChange]);

  const handleIpChange = async (newIp: ProductIP) => {
    setSelectedIp(newIp);
    const { increaseOnPricePercent } = PRODUCT_IP_LABEL_MAP[newIp];
    const priceIncrease = basePrice * increaseOnPricePercent;
    await updateProductIP({
      productId,
      configId,
      newProductIp: newIp,
      priceIncrease,
    });
  };
  const t = useTranslations("product-ip");
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold mb-2">
        {t("title")}
      </h3>
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-2">
        {Object.entries(PRODUCT_IP_LABEL_MAP).map(
          ([ip, { label, description }]) => (
            <TooltipProvider key={ip}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => handleIpChange(ip as ProductIP)}
                    variant={selectedIp === ip ? "default" : "outline"}
                    className={cn(
                      "flex items-center justify-center w-full rounded-full",
                      selectedIp === ip
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-secondary",
                    )}
                  >
                    <Droplets className="w-4 h-4 mr-1" />
                    <span className={cn("rtl:mr-1 ltr:ml-1")}>
                      {t(`ratings.${ip}.label`)}
                    </span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="sm:block hidden font-medium max-w-xs">
                  <p>{t(`ratings.${ip}.description`)}</p>
                  <p className="text-xs mt-1 opacity-75">{t("onlyAvailableRating")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ),
        )}
      </div>
    </div>
  );
}
