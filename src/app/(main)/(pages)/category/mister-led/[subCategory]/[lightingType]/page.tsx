import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { db } from "@/db";
import { constructMetadata } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import LightingTypePage from "./LightingTypePage";

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
  }));
}
export async function generateMetadata({
  params,
}: {
  params: { subCategory: string; lightingType: string };
}): Promise<Metadata> {
  const { subCategory, lightingType } = params;

  const products = await db.product.findMany({
    where: {
      Brand: "mister-led",
      sectionType: subCategory,
      spotlightType: lightingType,
    },
  });
  if (!products.length) {
    notFound();
  }
  let title;
  let description;
  title = `Discover Balcom's ${subCategory} lighting solutions by offering ${lightingType}`;
  description = `Illuminate your interior spaces with our stylish and functional ${subCategory} lights. Explore our collection of ${lightingType} fixtures designed to enhance your home or office ambiance.`;
  return constructMetadata({
    title,
    description,
    image: "/brand/mrled.png",
    icons: "/misterled.ico",
  });
}
async function ProductPage({
  params,
}: {
  params: { subCategory: string; lightingType: string };
}) {
  const { subCategory, lightingType } = params;

  const products = await db.product.findMany({
    where: {
      Brand: "mister-led",
      sectionType: subCategory,
      spotlightType: lightingType,
    },
  });
  if (!products.length) {
    notFound();
  }
  return (
    <Suspense fallback={<div className="text-center text-lg">Loading...</div>}>
      <LightingTypePage
        products={products}
        subCategory={subCategory}
        lightingType={lightingType}
      >
        <Breadcrumb />
      </LightingTypePage>
    </Suspense>
  );
}
export default ProductPage;
