"use client";

import { Container } from "@repo/ui"
import { Product } from "@repo/database";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface SubCategoryPageProps {
  children: React.ReactNode;
  subCategory: string;
  groupedProducts: Record<string, Product[]>;
}

export default function SubCategoryPage({
  children,
  groupedProducts,
  subCategory,
}: SubCategoryPageProps){
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
          <h1 className="md:text-3xl sm:text-2xl text-xl mb-8 capitalize">
            {subCategory} Lighting
          </h1>
          <div className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-3">
            {Object.entries(groupedProducts).map(
              ([spotlightType, products]) => (
                <div key={spotlightType} className="text-center">
                  <Link
                    href={`/category/mister-led/${subCategory}/${spotlightType}`}
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
