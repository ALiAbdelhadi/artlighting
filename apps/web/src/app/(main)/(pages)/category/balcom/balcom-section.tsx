"use client";

import { Container } from "@repo/ui"
import Landing from "@/components/landing";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface Category {
  sectionType: string;
  _count: {
    _all: number;
  };
  image: string;
}

interface BalcomSectionProps {
  children: React.ReactNode;
  categories: Category[];
}

export default function BalcomSection({
  children,
  categories,
}: BalcomSectionProps) {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };
  const images = [
    "/balcom-landing/landing1.jpg",
    "/balcom-landing/landing2.png",
    "/balcom-landing/landing3.jpg",
  ];
  return (
    <>
      <Landing images={images} />
      {children}
      <motion.section
        className="Indoor-lighting py-11 md:py-15 lg:py-19"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <Container>
          <h1 className="md:text-3xl sm:text-2xl text-xl mb-8">Balcom</h1>
          <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-4 justify-center items-center">
            {categories.map((category) => (
              <motion.div
                key={category.sectionType}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Link
                  href={`/category/balcom/${category.sectionType}`}
                  scroll={true}
                >
                  <div className="card">
                    <Image
                      src={category.image}
                      alt={category.sectionType}
                      width={475}
                      height={475}
                      className="rounded-md w-[500px] h-[290px]"
                    />
                    <h2 className="text-lg py-3 capitalize">
                      {category.sectionType}
                    </h2>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </motion.section>
    </>
  );
};
