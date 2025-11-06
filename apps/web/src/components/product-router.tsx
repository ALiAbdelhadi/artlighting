"use client";

import BalcomProducts from "@/app/[locale]/(main)/(pages)/category/balcom/[subCategory]/[lightingType]/[ProductId]/products";
import ChandelierProducts from "@/app/[locale]/(main)/(pages)/category/mister-led/[subCategory]/[lightingType]/[ProductId]/products";
import { LocalizedProductWithRelations, Configuration } from "@/types/products";

interface ProductRouterProps {
    product: LocalizedProductWithRelations;
    relatedProducts?: LocalizedProductWithRelations[];
    configuration?: Configuration;
    locale: string;
}

export default function ProductRouter({
    product,
    relatedProducts,
    configuration,
    locale
}: ProductRouterProps) {

    // Safeguard against undefined relatedProducts with default empty array
    const safeRelatedProducts = relatedProducts ?? [];

    // Determine which component to render based on product brand and type
    const renderProductComponent = () => {
        // Check if it's a Balcom product (technical lighting)
        if (product.brand === "balcom") {
            const balcomRelated = safeRelatedProducts.filter(p => p.brand === "balcom");

            return (
                <BalcomProducts
                    product={product}
                    relatedProducts={balcomRelated}
                    configuration={configuration}
                    locale={locale}
                />
            );
        }

        // Check if it's a Chandelier product (Mister LED)
        if (product.brand === "mister-led" && product.sectionType === "chandelier") {
            const chandelierRelated = safeRelatedProducts.filter(
                p => p.brand === "mister-led" && p.sectionType === "chandelier"
            );

            return (
                <ChandelierProducts
                    product={product}
                    relatedProducts={chandelierRelated}
                    configuration={configuration}
                    locale={locale}
                />
            );
        }

        // Default fallback - use Balcom component for unknown types
        return (
            <BalcomProducts
                product={product}
                relatedProducts={safeRelatedProducts}
                configuration={configuration}
                locale={locale}
            />
        );
    };

    return renderProductComponent();
}

// Helper function to determine product type from data
export const getProductType = (product: LocalizedProductWithRelations): 'balcom' | 'chandelier' | 'unknown' => {
    if (product.brand === "balcom") {
        return 'balcom';
    }

    if (product.brand === "mister-led" && product.sectionType === "chandelier") {
        return 'chandelier';
    }

    return 'unknown';
};

// Helper function to check if product has technical specifications (Balcom style)
export const hasTechnicalSpecs = (product: LocalizedProductWithRelations): boolean => {
    const specs = product.localizedSpecs || {};

    return !!(
        specs.brandOfLed ||
        specs.luminousFlux ||
        specs.cri ||
        specs.beamAngle ||
        specs.electrical ||
        specs.powerFactor ||
        product.brandOfLed ||
        product.luminousFlux ||
        product.cri ||
        product.beamAngle ||
        product.electrical ||
        product.powerFactor
    );
};

// Helper function to check if product is chandelier type
export const isChandelierProduct = (product: LocalizedProductWithRelations): boolean => {
    return !!(
        product.hNumber ||
        product.chandelierLightingType ||
        (product.brand === "mister-led" && product.sectionType === "chandelier")
    );
};