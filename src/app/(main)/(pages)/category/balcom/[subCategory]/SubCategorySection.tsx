"use client";

import Container from "@/app/components/Container";
import { Product } from "@prisma/client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface SubCategoryPageProps {
  children: React.ReactNode;
  subCategory: string;
  groupedProducts: Record<string, Product[]>;
}

const SubCategoryPage: React.FC<SubCategoryPageProps> = ({
  children,
  subCategory,
  groupedProducts,
}) => {
  const variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.3,
      },
    },
  };
  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      {children}
      <div className="py-8 sm:py-12 md:py-14 lg:py-16">
        <Container>
          <h1 className="text-3xl font-bold mb-8 capitalize">
            {subCategory} Lighting
          </h1>
          <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 ">
            {Object.entries(groupedProducts).map(
              ([spotlightType, products]) => (
                <div key={spotlightType} className="text-center">
                  <Link
                    href={`/category/balcom/${subCategory}/${spotlightType}`}
                  >
                    <div className="card">
                      <Image
                        src={products[0].productImages[0]}
                        alt={spotlightType}
                        width={475}
                        height={475}
                        className="rounded-md"
                      />
                      <h2 className="text-lg py-3 capitalize">
                        {spotlightType}
                      </h2>
                    </div>
                  </Link>
                </div>
              ),
            )}
          </div>
        </Container>
      </div>
    </motion.div>
  );
};

export default SubCategoryPage;
