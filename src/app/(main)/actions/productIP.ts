"use server"
import { db } from "../../../db"
import { ProductIP } from "@prisma/client"
export const changeProductIP = async ({ productId, newProductIp }: {
    productId: string,
    newProductIp: ProductIP
}) => {
    await db.product.update({
        where: { productId },
        data: { productIp: newProductIp }
    })
}