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
  const { subCategory, lightingType } = await params;
  const products = await prisma.product.findMany({
    where: {
      Brand: "balcom",
      sectionType: subCategory,
      spotlightType: lightingType,
    },
  });
  if (!products.length) {
    notFound();
  }
  let title;
  let description;
  if (subCategory === "indoor") {
    title = `Discover Balcom's ${subCategory} lighting solutions by offering ${lightingType}`;
    description = `Illuminate your interior spaces with our stylish and functional ${subCategory} lights. Explore our collection of ${lightingType} fixtures designed to enhance your home or office ambiance.`;
  } else if (subCategory === "outdoor") {
    title = `Enhance Your Outdoor Living with Balcom's ${subCategory} Lighting by offering ${lightingType}`;
    description = `Create a captivating outdoor atmosphere with our durable and weather-resistant ${subCategory} lighting options. Explore our range of ${lightingType} fixtures perfect for patios, gardens, and more.`;
  }

  return constructMetadata({
    title,
    description,
    image: "/brand/balcom.png",
    icons: "/balcom.ico",
  });
}
async function ProductPage({
  params,
}: {
  params: { subCategory: string; lightingType: string };
}) {
  if (!params || !params.subCategory || !params.lightingType) {
    return <div>Loading...</div>;
  }
  const { subCategory, lightingType } = await params;
  const products = await prisma.product.findMany({
    where: {
      Brand: "balcom",
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
