"use server";
import { ProductChandLamp } from "@repo/database";

export const changeProductChandLamp = async ({
  productId,
  newProductLamp,
}: {
  productId: string;
  newProductLamp: ProductChandLamp;
}) => {
  // Intentionally no-op: product-level mutations from end-users are not allowed.
  // Lamp selection is handled client-side for display only unless persisted in a user/config scoped model.
  return { success: true, productId, newProductLamp };
};
