'use client'

import { Button } from "@/components/ui/button"
import { ProductColorTemp } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { changeProductColorTemp } from "@/app/(main)/actions/productColorTemp"
import { cn } from "../utils/utils"

const PRODUCT_TEMP_LABEL_MAP: Record<ProductColorTemp, { label: string;}> = {
    warm: { label: "Warm" },
    cool: { label: "Cool"},
    white: { label: "White" },
}

interface ProductColorTempButtonsProps {
    productId: string
    productColorTemp: ProductColorTemp
    onColorTempChange: (newColorTemp: ProductColorTemp) => void
}

export default function ProductColorTempButtons({
    productId,
    productColorTemp,
    onColorTempChange,
}: ProductColorTempButtonsProps) {
    const router = useRouter()
    const [activeTemp, setActiveTemp] = useState<ProductColorTemp>(productColorTemp)

    const { mutate } = useMutation({
        mutationKey: ["change-product-color-temp"],
        mutationFn: changeProductColorTemp,
        onSuccess: () => router.refresh(),
    })

    const handleColorTempChange = (colorTemp: ProductColorTemp) => {
        setActiveTemp(colorTemp)
        onColorTempChange(colorTemp)
        mutate({ productId, newColorTemp: colorTemp })
    }

    return (
        <div className="space-y-2">
            <h3 className="text-lg font-semibold mb-2">Color Temperature</h3>
            <div className="grid grid-cols-3 gap-2">
                {Object.entries(PRODUCT_TEMP_LABEL_MAP).map(([temp, { label }]) => (
                    <Button
                        key={temp}
                        onClick={() => handleColorTempChange(temp as ProductColorTemp)}
                        variant={activeTemp === temp ? "default" : "outline"}
                        className={cn(
                            "flex items-center justify-center p-0 m-0 rounded-full transition-all duration-200",
                            activeTemp === temp
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