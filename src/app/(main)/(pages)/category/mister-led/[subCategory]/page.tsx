import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { db } from "@/db";
import { constructMetadata } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import SubCategoryPage from "./SubCategorySection";

export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: {
      sectionType: true,
    },
  });
  const uniqueSubCategory = Array.from(
    new Set(products.map((product) => product.sectionType)),
  );
  return uniqueSubCategory.map((subCategory) => ({
    subCategory,
  }));
}
async function Page({ params }: { params: { subCategory: string } }) {
  const { subCategory } = params;
  const products = await db.product.findMany({
    where: {
      Brand: "mister-led",
      sectionType: subCategory,
    },
    include: {
      category: true,
    },
  });
  if (!products.length) {
    notFound();
  }
  const groupedProducts = products.reduce(
    (acc, product) => {
      const group = product.spotlightType;
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(product);
      return acc;
    },
    {} as Record<string, typeof products>,
  );
  return (
    <Suspense fallback={<div className="text-center">Loading...</div>}>
      <SubCategoryPage
        subCategory={subCategory}
        groupedProducts={groupedProducts}
      >
        <Breadcrumb />
      </SubCategoryPage>
    </Suspense>
  );
}
export async function generateMetadata({
  params,
}: {
  params: { subCategory: string };
}): Promise<Metadata> {
  const { subCategory } = params;
  const products = await db.product.findMany({
    where: {
      Brand: "mister-led",
      sectionType: subCategory,
    },
  });
  if (!products.length) {
    notFound();
  }
  const title = `Explore ${subCategory} - Mister Led Products`;
  const description = `Discover the best ${subCategory} products in our Mister Led collection. Check out our range of high-quality products at affordable prices.`;
  return constructMetadata({
    title,
    description,
    image: "/brand/mrled.png",
    icons: "/misterled.ico",
  });
}

export default Page;
