"use client";
import Container from "@/components/Container";
import ProductCard from "@/components/ProductCard/ProductCard";
import { Product } from "@prisma/client";
import { motion } from "framer-motion";

interface LightingTypePageProps {
  children: React.ReactNode;
  products: Product[];
  subCategory: string;
  lightingType: string;
}
const LightingTypePage: React.FC<LightingTypePageProps> = ({
  children,
  products,
  subCategory,
  lightingType,
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
      <div className="py-11 md:py-15 lg:py-19">
        <Container>
          <h1 className="capitalize font-bold md:text-3xl sm:text-2xl text-xl">
            Mister Led {subCategory} - {lightingType}
          </h1>
          <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[8px] justify-center items-center">
            {products.map((product) => (
              <ProductCard
                key={product.productId}
                product={{
                  ...product,
                  ProductId: product.productId,
                }}
              />
            ))}
          </div>
        </Container>
      </div>
    </motion.div>
  );
};

export default LightingTypePage;
