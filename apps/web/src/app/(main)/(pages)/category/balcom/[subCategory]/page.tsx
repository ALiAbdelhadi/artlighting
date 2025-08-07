import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import { constructMetadata } from "@/lib/utils";
import { prisma } from "@repo/database";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import SubCategoryPage from "./sub-category-section";

export async function generateStaticParams() {
  const products = await prisma.product.findMany({
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
  const products = await prisma.product.findMany({
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
    <SubCategoryPage
      subCategory={subCategory}
      groupedProducts={groupedProducts}
    >
      <Breadcrumb />
    </SubCategoryPage>
  );
}
export async function generateMetadata({
  params,
}: {
  params: { subCategory: string };
}): Promise<Metadata> {
  const { subCategory } = params;
  const products = await prisma.product.findMany({
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
    image: "/brand/balcom.png",
    icons: "/balcom.ico",
  });
}
export default Page;
