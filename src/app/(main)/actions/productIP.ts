"use server";
import { db } from "../../../db";
import { ProductIP } from "@prisma/client";

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