"use server";
import { db } from '@/db';

export type SaveConfigArgs = {
    ProductId: string;
    price: number;
    quantity: number;
    configId: string;
    productImages: string[];
    discount: number;
    
};

export async function saveConfig({ configId, ProductId, price, quantity, productImages, discount , }: SaveConfigArgs) {
    const existingConfig = await db.configuration.findUnique({
        where: { id: configId }
    });

    if (existingConfig) {
        await db.configuration.update({
            where: { id: configId },
            data: {
                ProductId,
                price,
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
                price,
                category: "YourCategoryHere",
                lightingtype: "YourLightingTypeHere",
                productImages,
                shippingPrice: 69,
                discount,
            },
        });
    }
}
