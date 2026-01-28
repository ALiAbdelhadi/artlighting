"use client"

import BalcomProducts from "@/app/[locale]/(main)/(pages)/category/balcom/[subCategory]/[lightingType]/[ProductId]/products"
import ChandelierProducts from "@/app/[locale]/(main)/(pages)/category/mister-led/[subCategory]/[lightingType]/[ProductId]/products"
import type { Configuration, LocalizedProductWithRelations } from "@/types/products"

interface ProductRouterProps {
    product: LocalizedProductWithRelations
    relatedProducts?: LocalizedProductWithRelations[]
    configuration?: Configuration
    locale: string
}

export default function ProductRouter({
    product,
    relatedProducts,
    configuration,
    locale
}: ProductRouterProps) {
    const safeRelatedProducts = relatedProducts ?? []

    const renderProductComponent = () => {
        if (product.brand === "balcom") {
            const balcomRelated = safeRelatedProducts.filter(p => p.brand === "balcom")

            return (
                <BalcomProducts
                    product={product}
                    relatedProducts={balcomRelated}
                    configuration={configuration}
                    locale={locale}
                />
            )
        }

        if (product.brand === "mister-led" && product.sectionType === "chandelier") {
            const chandelierRelated = safeRelatedProducts.filter(
                p => p.brand === "mister-led" && p.sectionType === "chandelier"
            )

            return (
                <ChandelierProducts
                    product={product}
                    relatedProducts={chandelierRelated}
                    configuration={configuration}
                    locale={locale}
                />
            )
        }

        return (
            <BalcomProducts
                product={product}
                relatedProducts={safeRelatedProducts}
                configuration={configuration}
                locale={locale}
            />
        )
    }

    return renderProductComponent()
}