"use client";

import { changeProductChandLamp } from "@/actions/product-chandLamp";
import { saveConfig, type SaveConfigArgs } from "@/components/action";
import { ProductChandLamp } from "@repo/database";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { formatNumber } from "@/lib/numbers";

const PRODUCT_CHAND_LAMP_LABEL_MAP: Record<ProductChandLamp, { priceIncreasePerLamp: number }> = {
  lamp9w: { priceIncreasePerLamp: 0 },
  lamp12w: { priceIncreasePerLamp: 20 },
};

interface ProductChandelierLampButtonsProps {
  productId: string;
  configId?: string;
  productChandLamp: ProductChandLamp;
  hNumber: number;
  basePrice: number;
  discount?: number;
  priceIncrease?: number;
  onProductLampChange: (
    newProductLamp: ProductChandLamp,
    lampPriceIncrease: number,
  ) => void;
}

export default function ProductChandelierLampButtons({
  productId,
  configId,
  productChandLamp,
  hNumber,
  basePrice,
  discount = 0,
  priceIncrease = 0,
  onProductLampChange,
}: ProductChandelierLampButtonsProps) {
  const t = useTranslations('ProductChandLampButtons');
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [activeProductLamp, setActiveProductLamp] = useState<ProductChandLamp>(productChandLamp);
  const [isUpdating, setIsUpdating] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculateLampPriceIncrease = useCallback((lampType: ProductChandLamp) => {
    const { priceIncreasePerLamp } = PRODUCT_CHAND_LAMP_LABEL_MAP[lampType];
    return priceIncreasePerLamp * hNumber;
  }, [hNumber]);

  const { mutate: changeLampMutation } = useMutation({
    mutationKey: ["change-product-chand-lamp"],
    mutationFn: changeProductChandLamp,
    onSuccess: () => {
      console.log("Lamp type changed successfully");
      toast.success(t("change-success"));
    },
    onError: (error) => {
      console.error("Failed to change lamp type:", error);
      toast.error(t("change-error"));
      setIsUpdating(false);
    }
  });

  const { mutate: saveConfigMutation, isPending: isSavingConfig } = useMutation({
    mutationKey: ["save-config-lamp", configId],
    mutationFn: saveConfig,
    onSuccess: (data) => {
      console.log("Lamp configuration saved successfully:", data);
      setIsUpdating(false);
    },
    onError: (error) => {
      console.error("Configuration save error:", error);
      toast.error(t("saving-error"));
      setIsUpdating(false);
    },
  });

  const saveConfigurationAsync = useCallback(async (lampType: ProductChandLamp) => {
    if (!configId) return;

    const lampPriceIncrease = calculateLampPriceIncrease(lampType);
    const totalConfigPrice = basePrice + priceIncrease + lampPriceIncrease;

    const configData: SaveConfigArgs = {
      configId,
      productId,
      quantity: 1,
    };

    console.log("Saving lamp configuration:", {
      ...configData,
      basePrice,
      hNumber,
      lampType,
      calculatedLampIncrease: lampPriceIncrease,
    });

    saveConfigMutation(configData);
  }, [configId, productId, calculateLampPriceIncrease, saveConfigMutation, hNumber]);

  useEffect(() => {
    const lampPriceIncrease = calculateLampPriceIncrease(activeProductLamp);
    onProductLampChange(activeProductLamp, lampPriceIncrease);
  }, [activeProductLamp, calculateLampPriceIncrease, onProductLampChange]);

  const handleLampChange = useCallback((productLamp: ProductChandLamp) => {
    if (productLamp === activeProductLamp || isUpdating) return;

    setActiveProductLamp(productLamp);
    setIsUpdating(true);

    changeLampMutation({ productId, newProductLamp: productLamp });

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveConfigurationAsync(productLamp);
    }, 500);
  }, [activeProductLamp, isUpdating, productId, changeLampMutation, saveConfigurationAsync]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold mb-2">
        {t("chooseLampWattage")}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(PRODUCT_CHAND_LAMP_LABEL_MAP).map(
          ([productLamp, { priceIncreasePerLamp }]) => {
            const totalLampIncrease = priceIncreasePerLamp * hNumber;
            const totalPrice = basePrice + priceIncrease + totalLampIncrease;

            return (
              <Button
                key={productLamp}
                onClick={() => handleLampChange(productLamp as ProductChandLamp)}
                disabled={isUpdating || isSavingConfig}
                variant={activeProductLamp === productLamp ? "default" : "outline"}
                className={cn(
                  "flex items-center justify-center rounded-full transition-all duration-200",
                  activeProductLamp === productLamp
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-background hover:bg-secondary",
                  (isUpdating || isSavingConfig) && "opacity-60 cursor-not-allowed"
                )}
              >
                <div className="flex flex-row gap-2 justify-center items-end text-center">
                  <span className="font-medium">
                    {t(productLamp)}
                  </span>
                  {totalLampIncrease > 0 && (
                    <span className="opacity-70 whitespace-nowrap block font-medium max-w-xs">
                      +{formatNumber(Math.ceil(totalLampIncrease), isRTL ? "ar" : "en")}
                      {" "}({priceIncreasePerLamp} × {hNumber})
                    </span>
                  )}
                </div>
                {(isUpdating || isSavingConfig) && activeProductLamp === productLamp && (
                  <div className="ml-2 animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
                )}
              </Button>
            );
          },
        )}
      </div>
    </div>
  );
}