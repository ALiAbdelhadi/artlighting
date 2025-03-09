import Breadcrumb from "@/app/components/Breadcrumb/Breadcrumb";
import { db } from "@/db";
import { constructMetadata } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ProductClientComponent from "./ProductClientComponent";
export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: {
      productId: true,
      category: {
        select: {
          name: true,
        },
      },
      lightingtype: {
        select: {
          name: true,
        },
      },
    },
  });
  return products.map((product) => ({
    subCategory: product.category.name,
    lightingType: product.lightingtype.name,
    ProductId: product.productId,
  }));
}
export default async function ProductPage({
  params,
}: {
  params: { lightingType: string; ProductId: string; subCategory: string };
}) {
  const { lightingType, ProductId, subCategory } = params;
  console.log("Params:", params);
  const product = await db.product.findFirst({
    where: {
      productId: ProductId,
      sectionType: subCategory,
      spotlightType: lightingType,
    },
    include: { category: true, lightingtype: true },
  });
  console.log("Product:", product);
  if (!product) {
    console.log("Product not found");
    notFound();
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {product && (
        <ProductClientComponent product={product}>
          <Breadcrumb />
        </ProductClientComponent>
      )}
    </Suspense>
  );
}
export async function generateMetadata({
  params,
}: {
  params: { subCategory: string; ProductId: string; lightingtype: string };
}): Promise<Metadata> {
  const { lightingtype, ProductId, subCategory } = params;
  const product = await db.product.findFirst({
    where: {
      productId: ProductId,
      sectionType: subCategory,
      spotlightType: lightingtype,
    },
    include: { category: true, lightingtype: true },
  });

  if (!product) {
    return constructMetadata({
      title: "Chandelier Not Found",
      description: "The requested chandelier could not be found.",
      icons: "/chandelier.ico",
    });
  }
  const title = `${product.productName} - ${product.lightingtype.name} Chandelier | Luxury Lighting`;
  let description = `Elevate your space with the ${product.productName} ${product.lightingtype.name} chandelier. `;
  if (product.mainMaterial) {
    description += `Crafted from ${product.mainMaterial}, `;
  }
  if (product.colorTemperature) {
    description += `featuring ${product.colorTemperature} color temperature, `;
  }
  if (product.maximumWattage) {
    description += `with a maximum wattage of ${product.maximumWattage}W, `;
  }
  description += `this exquisite piece is perfect for ${product.category.name.toLowerCase()} settings. `;
  if (product.finish) {
    description += `Its ${product.finish} finish `;
  }
  description += `adds a touch of elegance to any room. `;
  if (product.ChandelierLightingType === "LED") {
    description += `This LED chandelier offers energy efficiency and long-lasting illumination. `;
  }
  if (product.lifeTime) {
    description += `With a lifespan of ${product.lifeTime} hours, it ensures enduring beauty. `;
  }
  description += `Shop now for luxury lighting at its finest!`;
  return constructMetadata({
    title,
    description,
    icons: "/misterled.ico",
    openGraph: {
      title,
      description,
      images: product.productImages[0] ? [product.productImages[0]] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.productImages[0] ? [product.productImages[0]] : undefined,
    },
  });
}
