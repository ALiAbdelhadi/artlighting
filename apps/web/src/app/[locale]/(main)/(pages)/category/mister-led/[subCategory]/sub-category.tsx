"use client";

import { Link } from "@/i18n/navigation";
import { SupportedLanguage } from "@/types/products";
import { Container } from "@/components/container";
import { motion } from "framer-motion";

interface LocalizedLightingType {
  id: string;
  name: string;
  slug: string;
  localizedName: string;
  localizedSlug: string;
  spotlightType: string;
  productCount: number;
  firstProductImage?: string;
}

interface SubCategoryProps {
  subCategorySlug: string;
  subCategoryName: string;
  lightingTypes: LocalizedLightingType[];
  locale: SupportedLanguage;
}

export default function SubCategory({
  subCategorySlug,
  subCategoryName,
  lightingTypes,
  locale,
}: SubCategoryProps) {
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
  const isRTL = locale === "ar";

  const sectionTitles = subCategoryName

  const productCountLabel = {
    en: "products",
    ar: "منتجات"
  };

  return (
    <>
      <Container>
        <motion.div
          className="py-16"
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          <div className="mb-12">
            <h1 className="md:text-3xl sm:text-2xl text-xl text-foreground mb-4 capitalize">
              {sectionTitles}
            </h1>
          </div>
          <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 justify-center items-center">
            {lightingTypes.map((lightingType, index) => (
              <motion.div
                key={lightingType.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/category/mister-led/${subCategorySlug}/${lightingType.slug}`}>
                  <div className={`rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}>
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          lightingType.firstProductImage
                        }
                        alt={lightingType.localizedName}
                        className="object-cover w-full"
                      />
                      <div className="absolute top-3 right-2 bg-white bg-opacity-90 px-3 py-1 rounded-full">
                        <span className="text-sm font-semibold text-gray-700">
                          {lightingType.productCount} {productCountLabel[locale]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="py-3">
                    <h3 className="text-lg font-semibold text-foreground/90 mb-2 group-hover:text-primary transition-colors">
                      {lightingType.localizedName}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </>
  );
};
