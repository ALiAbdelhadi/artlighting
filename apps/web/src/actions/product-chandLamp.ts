"use server";
import { prisma, ProductChandLamp } from "@repo/database";

export const changeProductChandLamp = async ({
  productId,
  newProductLamp,
}: {
  productId: string;
  newProductLamp: ProductChandLamp;
}) => {
  await prisma.product.update({
    where: { productId },
    data: { productChandLamp: newProductLamp },
  });
};
