"use server"
import { db } from '@/db';

export type SaveConfigArgs = {
    ProductId: string;
    configPrice: number;
    priceIncrease: number;
    quantity: number;
    configId: string;
    productImages: string[];
    lampPriceIncrease: number
    discount: number;
};

export async function saveConfig({ configId, ProductId, configPrice, priceIncrease, quantity, productImages, discount, lampPriceIncrease }: SaveConfigArgs) {
    const existingConfig = await db.configuration.findUnique({
        where: { id: configId }
    });
    if (existingConfig) {
        await db.configuration.update({
            where: { id: configId },
            data: {
                ProductId,
                configPrice,
                lampPriceIncrease,
                priceIncrease,
                quantity,
                productImages,
                shippingPrice: 69,
                discount
            }
        });
    } else {
        await db.configuration.create({
            data: {
                ProductId,
                quantity,
                configPrice,
                priceIncrease,
                category: "YourCategoryHere",
                lightingtype: "YourLightingTypeHere",
                productImages,
                shippingPrice: 69,
                lampPriceIncrease,
                discount,
            },
        });
    }
}