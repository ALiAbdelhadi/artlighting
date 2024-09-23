"use server";
import { ProductIP } from "@prisma/client";
import { db } from "../../../db";

export const changeProductIP = async ({
    productId,
    newProductIp,
    priceIncrease,
}: {
    productId: string;
    newProductIp: ProductIP;
    priceIncrease: number;
}) => {
    await db.product.update({
        where: { productId },
        data: {
            productIp: newProductIp,
            priceIncrease: priceIncrease,
        },
    });
};