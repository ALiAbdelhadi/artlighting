"use client";

import { changeProductChandLamp } from "@/actions/product-chandLamp";
import { Button } from "@repo/ui/button";
import { ProductChandLamp } from "@repo/database";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { cn } from "@repo/ui";
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation";

const PRODUCT_CHAND_LAMP_LABEL_MAP: Record<ProductChandLamp, { priceIncrease: number }> = {
  lamp9w: { priceIncrease: 0 },
  lamp12w: { priceIncrease: 20 },
};

interface ProductChandLampButtonsProps {
  productId: string;
  productChandLamp: ProductChandLamp;
  hNumber: number;
  onProductLampChange: (
    newProductLamp: ProductChandLamp,
    priceIncrease: number,
  ) => void;
}

export default function ProductChandLampButtons({
  productId,
  productChandLamp,
  hNumber,
  onProductLampChange,
}: ProductChandLampButtonsProps) {
  const t = useTranslations('ProductChandLampButtons');
  const router = useRouter();
  const [activeProductLamp, setActiveProductLamp] =
    useState<ProductChandLamp>(productChandLamp);

  const { mutate } = useMutation({
    mutationKey: ["change-product-chand-lamp"],
    mutationFn: changeProductChandLamp,
    onSuccess: () => router.refresh(),
  });

  useEffect(() => {
    const { priceIncrease } = PRODUCT_CHAND_LAMP_LABEL_MAP[activeProductLamp];
    const calculatedPriceIncrease = priceIncrease * hNumber;
    onProductLampChange(activeProductLamp, calculatedPriceIncrease);
  }, [activeProductLamp, onProductLampChange, hNumber]);

  const handleColorTempChange = (productLamp: ProductChandLamp) => {
    setActiveProductLamp(productLamp);
    mutate({ productId, newProductLamp: productLamp });
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold mb-2">
        {t("chooseLampWattage")}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(PRODUCT_CHAND_LAMP_LABEL_MAP).map(
          ([productLamp, { priceIncrease }]) => (
            <Button
              key={productLamp}
              onClick={() =>
                handleColorTempChange(productLamp as ProductChandLamp)
              }
              variant={
                activeProductLamp === productLamp ? "default" : "outline"
              }
              className={cn(
                "flex items-center justify-center rounded-full transition-all duration-200",
                activeProductLamp === productLamp
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-background hover:bg-secondary",
              )}
            >
              {t(productLamp)}
              {priceIncrease > 0 && (
                <span className="font-normal text-sm opacity-70">
                  {t("priceIncrease", { price: priceIncrease })} × {hNumber}
                </span>
              )}
            </Button>
          ),
        )}
      </div>
    </div>
  );
}
