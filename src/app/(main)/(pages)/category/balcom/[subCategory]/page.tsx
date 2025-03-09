import Breadcrumb from "@/app/components/Breadcrumb/Breadcrumb";
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
  const uniqueSubCategories = Array.from(
    new Set(products.map((product) => product.sectionType)),
  );
  return uniqueSubCategories.map((subCategory) => ({
    subCategory,
  }));
}
async function Page({ params }: { params: { subCategory: string } }) {
  const { subCategory } = params;
  const products = await db.product.findMany({
    where: {
      Brand: "balcom",
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
    <Suspense fallback={<div>Loading...</div>}>
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
      Brand: "balcom",
      sectionType: subCategory,
    },
  });
  if (!products.length) {
    notFound();
  }
  const title = `Explore ${subCategory} - Balcom Products`;
  const description = `Discover the best ${subCategory} products in our Balcom collection. Check out our range of high-quality products at affordable prices.`;
  return constructMetadata({
    title,
    description,
    image: "/brand/balcom.jpeg",
    icons: "/balcom.ico",
  });
}
export default Page;
