"use server"
import { db } from "../../../db"
import { ProductColorTemp } from "@prisma/client"

export const changeProductColorTemp = async ({ productId, newColorTemp }: {
    productId: string,
    newColorTemp: ProductColorTemp
}) => {
    await db.product.update({
        where: { productId },
        data: { productColor: newColorTemp }
    })
}