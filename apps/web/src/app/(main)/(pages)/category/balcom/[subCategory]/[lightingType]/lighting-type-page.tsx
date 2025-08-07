"use client";
import { Container } from "@repo/ui"
import ProductCard from "@/components/product-card/product-card";
import { Product } from "@repo/database";
import { motion } from "framer-motion"; 

interface LightingTypePageProps {
  children: React.ReactNode;
  products: Product[];
  subCategory: string;
  lightingType: string;
}
export default function LightingTypePage({
  children,
  products,
  subCategory,
  lightingType,
}: LightingTypePageProps){
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
          <h1 className="capitalize md:text-3xl sm:text-2xl text-xl mb-8">
            Balcom {subCategory} - {lightingType}
          </h1>
          <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-[8px] justify-center items-center">
            {products.map((product) => (
              <ProductCard
                key={product.productId}
                product={{
                  ...product,
                  ProductId: product.productId,
                  ChandelierLightingType: product.ChandelierLightingType || "",
                  maximumWattage: product.maximumWattage?.toString() || "",
                  lampBase: product.lampBase || "",
                  mainMaterial: product.mainMaterial || "",
                  beamAngle: product.beamAngle || "",
                  hNumber: product.hNumber || 0,
                }}
              />
            ))}
          </div>
        </Container>
      </div>
    </motion.div>
  );
};