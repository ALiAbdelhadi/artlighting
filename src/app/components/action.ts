"use server";
import { db } from "@/db";

export type SaveConfigArgs = {
  ProductId: string;
  configPrice: number;
  priceIncrease: number;
  quantity: number;
  configId: string;
  lampPriceIncrease: number;
  discount: number;
  totalPrice: number;
};

export async function saveConfig({
  configId,
  ProductId,
  configPrice,
  priceIncrease,
  quantity,
  discount,
  lampPriceIncrease,
}: SaveConfigArgs) {
  const existingConfig = await db.configuration.findUnique({
    where: { id: configId },
  });
  const totalPrice = configPrice;
  if (existingConfig) {
    await db.configuration.update({
      where: { id: configId },
      data: {
        ProductId,
        configPrice,
        lampPriceIncrease,
        priceIncrease,
        quantity,
        shippingPrice: 69,
        discount,
        totalPrice,
      },
    });
  } else {
    await db.configuration.create({
      data: {
        ProductId,
        quantity,
        configPrice,
        priceIncrease,
        shippingPrice: 69,
        lampPriceIncrease,
        discount,
        totalPrice,
      },
    });
  }
}
