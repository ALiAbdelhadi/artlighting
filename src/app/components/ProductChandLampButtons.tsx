'use client'

import { Button } from "@/components/ui/button"
import { ProductChandLamp } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { changeProductChandLamp } from "@/app/(main)/actions/productChandLamp"
import { cn } from "../utils/utils"

const PRODUCT_CHAND_LAMP_LABEL_MAP: Record<ProductChandLamp, { label: string; }> = {
    lamp12w: { label: "Lamp 12w" },
    lamp9w: { label: "Lamp 9W" }
}

interface ProductChandLampButtonsProps {
    productId: string
    productChandLamp: ProductChandLamp
    onProductLampChange: (newProductLamp: ProductChandLamp) => void
}

export default function ProductChandLampButtons({
    productId,
    productChandLamp,
    onProductLampChange,
}: ProductChandLampButtonsProps) {
    const router = useRouter()
    const [activeProductLamp, setActiveProductLamp] = useState<ProductChandLamp>(productChandLamp)

    const { mutate } = useMutation({
        mutationKey: ["change-product-chand-lamp"],
        mutationFn: changeProductChandLamp,
        onSuccess: () => router.refresh(),
    })

    const handleColorTempChange = (productLamp: ProductChandLamp) => {
        setActiveProductLamp(productLamp)
        onProductLampChange(productLamp)
        mutate({ productId, newProductLamp: productLamp })
    }

    return (
        <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-2">Choose Lamp Wattage</h3>
            <div className="grid grid-cols-2 gap-2">
                {Object.entries(PRODUCT_CHAND_LAMP_LABEL_MAP).map(([ProductLamp, { label }]) => (
                    <Button
                        key={ProductLamp}
                        onClick={() => handleColorTempChange(ProductLamp as ProductChandLamp)}
                        variant={activeProductLamp === ProductLamp ? "default" : "outline"}
                        className={cn(
                            "flex items-center justify-center rounded-full transition-all duration-200",
                            activeProductLamp === ProductLamp
                                ? "bg-primary text-primary-foreground shadow-lg"
                                : "bg-background hover:bg-secondary"
                        )}
                    >
                        {label}
                    </Button>
                ))}
            </div>
        </div>
    )
}