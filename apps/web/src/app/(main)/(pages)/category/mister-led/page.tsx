import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import { constructMetadata } from "@/lib/utils";
import { prisma } from "@repo/database";
import MisterLedSection from "./mister-led-section";

type SectionType = "chandelier";

const sectionTypeImages: Record<SectionType, string> = {
  chandelier: "/chandelier/MC6031/MC6031-H3.png",
};

export async function generateStaticParams() {
  const categories = await prisma.product.groupBy({
    by: ["sectionType"],
    where: {
      Brand: "mister-led",
    },
    orderBy: {
      sectionType: "desc",
    },
  });

  return categories.map((category) => ({
    sectionType: category.sectionType,
  }));
}

async function Page() {
  const categories = await prisma.product.groupBy({
    by: ["sectionType"],
    where: {
      Brand: "mister-led",
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
      image:
        sectionTypeImages[sectionType] || "/chandelier/MC6031/MC6031-H3.png",
    };
  });

  return (
    <MisterLedSection categories={categoriesWithImage}>
      <Breadcrumb />
    </MisterLedSection>
  );
}

export const metadata = constructMetadata({
  title: "Elegant Chandeliers from Mister Led - Elevate Your Home Lighting",
  description: `Discover our exquisite collection of chandeliers that bring elegance and style to any room. Find the perfect chandelier to illuminate and enhance your home's décor at affordable prices.`,
  image: "/brand/mrled.png",
  icons: "/misterled.ico",
});

export default Page;
