"use server";

import { prisma, ProductIP } from "@repo/database";

export const updateProductIP = async ({
  productId,
  configId,
  newProductIp,
  priceIncrease,
}: {
  productId: string
  configId: string;
  newProductIp: ProductIP;
  priceIncrease: number;
}) => {
  try {
    console.log(`Updating configuration with ID: ${configId}`);
    const configuration = await prisma.configuration.findUnique({
      where: { id: configId },
    });

    if (!configuration) {
      console.error(`Configuration not found for ID: ${configId}`);
      return { success: false, error: "Configuration not found" };
    }

    const updatedTotalPrice = configuration.configPrice + priceIncrease;

    const updatedConfig = await prisma.configuration.update({
      where: { id: configId },
      data: {
        productIp: newProductIp,
        priceIncrease: priceIncrease,
        totalPrice: updatedTotalPrice,
      },
    });

    console.log(
      `Configuration updated successfully: ${JSON.stringify(updatedConfig)}`,
    );
    return { success: true, updatedConfig };
  } catch (error) {
    console.error("Error updating product IP:", error);
    return { success: false, error: "Failed to update configuration" };
  }
};
