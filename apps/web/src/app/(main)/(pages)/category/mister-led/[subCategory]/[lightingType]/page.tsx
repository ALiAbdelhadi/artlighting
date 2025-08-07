import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import { constructMetadata } from "@/lib/utils";
import { prisma } from "@repo/database";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import LightingTypePage from "./lighting-type-page";

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
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

  const products = await prisma.product.findMany({
    where: {
      Brand: "mister-led",
      sectionType: subCategory,
      spotlightType: lightingType,
    },
  });
  if (!products.length) {
    notFound();
  }
  const title = `Discover Balcom's ${subCategory} lighting solutions by offering ${lightingType}`;
  const description = `Illuminate your interior spaces with our stylish and functional ${subCategory} lights. Explore our collection of ${lightingType} fixtures designed to enhance your home or office ambiance.`;
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

  const products = await prisma.product.findMany({
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
    <LightingTypePage
      products={products}
      subCategory={subCategory}
      lightingType={lightingType}
    >
      <Breadcrumb />
    </LightingTypePage>
  );
}
export default ProductPage;
