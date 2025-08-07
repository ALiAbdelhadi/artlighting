import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import { constructMetadata } from "@/lib/utils";
import { prisma } from "@repo/database";
import BalcomSection from "./balcom-section";
;

type SectionType = "indoor" | "outdoor";

const sectionTypeImages: Record<SectionType, string> = {
  indoor: "/indoor/linear/jy-lnrd-001b-32w/JY-LNRD-001B-32W (1).png",
  outdoor: "/new-collection/new-collection-2.jpg",
};

async function Page() {
  const categories = await prisma.product.groupBy({
    by: ["sectionType"],
    where: {
      Brand: "balcom",
    },
    _count: {
      _all: true,
    },
    orderBy: {
      sectionType: "desc",
    },
  });

  const categoriesWithImage = categories.map((category) => {
    const sectionType = category.sectionType as SectionType;
    return {
      ...category,
      image: sectionTypeImages[sectionType] || "/brand/balcom.png",
    };
  });

  return (
    <BalcomSection categories={categoriesWithImage}>
      <Breadcrumb />
    </BalcomSection>
  );
}

export const metadata = constructMetadata({
  title:
    "Our Brand Balcom has different types of lighting such as Indoor lighting and outdoor lighting",
  description: `Explore our range of Indoor And Outdoor Products with different styles and fix all lighting problem. Find the best products at affordable prices.`,
  image: "/brand/balcom.png",
  icons: "/balcom.ico",
});

export default Page;
