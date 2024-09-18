"use server"
import { db } from "../../../db"
import { ProductChandLamp } from "@prisma/client"
export const changeProductChandLamp = async ({ productId, newProductLamp }: {
    productId: string,
    newProductLamp: ProductChandLamp
}) => {
    await db.product.update({
        where: { productId },
        data: { productChandLamp: newProductLamp }
    })
}