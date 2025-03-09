"use server";
import { ProductChandLamp } from "@prisma/client";
import { db } from "@/db";
export const changeProductChandLamp = async ({
  productId,
  newProductLamp,
}: {
  productId: string;
  newProductLamp: ProductChandLamp;
}) => {
  await db.product.update({
    where: { productId },
    data: { productChandLamp: newProductLamp },
  });
};
