import Breadcrumb from '@/app/components/Breadcrumb/Breadcrumb';
import { db } from '@/db';
import { constructMetadata } from '@/lib/utils';
import { Suspense } from 'react';
import BalcomLandingPage from "./BalcomLandingPage";
import BalcomSection from "./BalcomSection";

type SectionType = 'Indoor' | 'Outdoor';

const sectionTypeImages: Record<SectionType, string> = {
  "Indoor": "/indoor/linear/jy-lnrd-001b-32w/JY-LNRD-001B-32W (1).png",
  "Outdoor": "/NewCollection/new-collection-2.jpg"
};

export async function generateStaticParams() {
  const categories = await db.product.groupBy({
    by: ['sectionType'],
    where: {
      Brand: 'Balcom'
    },
    orderBy: {
      sectionType: "desc"
    }
  });

  return categories.map(category => ({
    sectionType: category.sectionType
  }));
}

async function Page() {
  const categories = await db.product.groupBy({
    by: ['sectionType'],
    where: {
      Brand: 'Balcom'
    },
    _count: {
      _all: true
    },
    orderBy: {
      sectionType: 'desc'
    }
  });

  const categoriesWithImage = categories.map((category) => {
    const sectionType = category.sectionType as SectionType;
    return {
      ...category,
      image: sectionTypeImages[sectionType] || '/path/to/default-image.jpg'
    };
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BalcomSection categories={categoriesWithImage}>
        <BalcomLandingPage />
        <Breadcrumb />
      </BalcomSection>
    </Suspense>
  );
}

export const metadata = constructMetadata({
  title: "Our Brand Balcom has different types of lighting such as Indoor lighting and outdoor lighting",
  description: `Explore our range of Indoor And Outdoor Products with different styles and fix all lighting problem. Find the best products at affordable prices.`,
  image: "/brand/balcom.jpeg",
  icons: "/balcom.ico"
});

export default Page;