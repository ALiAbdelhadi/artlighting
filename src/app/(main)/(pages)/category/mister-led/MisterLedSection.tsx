"use client";

import Container from "@/app/components/Container";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
interface Category {
  sectionType: string;
  _count: {
    _all: number;
  };
  image: string;
}

interface MisterLedSectionProps {
  children: React.ReactNode;
  categories: Category[];
}

const MisterLedSection: React.FC<MisterLedSectionProps> = ({
  children,
  categories,
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
      <section className="MisterLed py-11 md:py-15 lg:py-19">
        <Container>
          <h1 className="text-center text-3xl">Mister Led</h1>
          <div className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-4 justify-center items-center">
            {categories.map((category) => (
              <div key={category.sectionType} className="text-center">
                <Link
                  href={`/category/mister-led/${category.sectionType}`}
                  scroll={true}
                >
                  <div className="card">
                    <Image
                      src={category.image}
                      alt={category.sectionType}
                      width={475}
                      height={475}
                      className="rounded-md"
                    />
                    <h2 className="text-lg py-3 capitalize">
                      {category.sectionType}
                    </h2>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </motion.div>
  );
};

export default MisterLedSection;
