"use client";

import Landing from "@/components/landing";
import { LocalizedCategory, SupportedLanguage } from "@/types/products";
import { Container } from "@/components/container";
import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";

interface BalcomProps {
  categories: LocalizedCategory[];
  locale: SupportedLanguage;
}

export default function Balcom({
  categories,
  locale,
}: BalcomProps) {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  const images = [
    "/balcom-landing/landing1.jpg",
    "/balcom-landing/landing2.png",
    "/balcom-landing/landing3.jpg",
    "/balcom-landing/landing4.jpg",
  ];

  const isRTL = locale === "ar";

  const brandNames = {
    en: "Balcom",
    ar: "بالكوم"
  };

  return (
    <>
      <Landing images={images} />
      <Breadcrumb />
      <motion.section
        className={`py-11 md:py-15 lg:py-19 ${isRTL ? 'rtl' : 'ltr'}`}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Container>
          <h1 className="md:text-3xl sm:text-2xl text-xl mb-8  rtl:text-right rtl:font-arabic text-left">
            {brandNames[locale]}
          </h1>
          <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 justify-center items-center">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1
                }}
              >
                <Link
                  href={`/category/balcom/${category.sectionType}`}
                  scroll={true}
                  className="block hover:scale-[101%] transition-transform duration-300"
                >
                  <div className="card group">
                    <div className="relative overflow-hidden rounded-md">
                      <Image
                        src={category.image}
                        alt={category.localizedName}
                        width={475}
                        height={475}
                        className="rounded-md w-[500px] h-[290px] object-cover group-hover:scale-110 transition-transform duration-500"
                        loading={index < 2 ? "eager" : "lazy"}
                      />
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-sm">
                        {category.productCount} {locale === "ar" ? "منتج" : "products"}
                      </div>
                    </div>
                    <h2 className={`text-lg py-3 capitalize font-semibold ${isRTL ? 'font-arabic' : ''
                      }`}>
                      {category.localizedName}
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
}