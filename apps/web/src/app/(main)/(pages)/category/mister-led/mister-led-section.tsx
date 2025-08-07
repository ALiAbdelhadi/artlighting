"use client";

import { Container } from "@repo/ui"
import Landing from "@/components/landing";
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

export default function MisterLedSection({
  children,
  categories,
}: MisterLedSectionProps) {
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
  const images = [
    "/misterled-landing/landing-2.png",
    "/misterled-landing/landing-1.jpg",
  ];
  return (
    <>
      <Landing images={images} />
      {children}
      <motion.div initial="hidden" animate="visible" variants={variants}>
        <section className="MisterLed py-11 md:py-15 lg:py-19">
          <Container>
            <h1 className="md:text-3xl sm:text-2xl text-xl mb-8">Mister Led</h1>
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
    </>
  );
};
