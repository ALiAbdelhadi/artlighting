"use server";

import { db } from "@/db";
export async function searchProducts(searchItem: string) {
  const products = await db.product.findMany({
    where: {
      OR: [
        { productName: { contains: searchItem, mode: "insensitive" } },
        { Brand: { contains: searchItem, mode: "insensitive" } },
        { sectionType: { contains: searchItem, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      productId: true,
      productName: true,
      price: true,
      Brand: true,
      sectionType: true,
      spotlightType: true,
      productImages: true,
      discount: true,
    },
    take: 10,
  });
  return products;
}
