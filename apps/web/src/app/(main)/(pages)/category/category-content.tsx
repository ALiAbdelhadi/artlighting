"use client";

import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import { Container } from "@repo/ui"
import { Button } from "@repo/ui/button";
import { constructMetadata } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategoryContent() {
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const orderId = localStorage.getItem("currentOrderId");
    if (orderId) {
      setCurrentOrderId(orderId);
    }
  }, []);
  const handleContinueOrder = () => {
    if (currentOrderId) {
      router.push(`/complete?orderId=${currentOrderId}`);
    }
  };
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
      <div>
        <Breadcrumb />
        <section className="Indoor-lighting py-11 md:py-15 lg:py-19">
          <Container>
            <h1 className="md:text-3xl sm:text-2xl text-xl mb-8">Category</h1>
            {currentOrderId && (
              <div className="mb-4">
                <Button onClick={handleContinueOrder}>
                  Continue with Current Order
                </Button>
              </div>
            )}
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-4 justify-center items-center">
              <div className="text-center">
                <Link href="/category/balcom">
                  <Image
                    src={"/indoor/products500/jy-535-5w/JY-535-5W (1).png"}
                    alt={"Indoor lighting products"}
                    width={475}
                    height={475}
                  />
                  <div className="card">
                    <h2 className="text-lg py-3 capitalize">Balcom</h2>
                  </div>
                </Link>
              </div>
              <div className="text-center">
                <Link href="/category/mister-led">
                  <Image
                    src={"/chandelier/MC7023/MC7023-P5.png"}
                    alt={"Chandelier lighting"}
                    width={475}
                    height={475}
                  />
                  <div className="card">
                    <h2 className="text-lg py-3 capitalize">Mister Led</h2>
                  </div>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </motion.div>
  );
}

export const metadata = constructMetadata({
  title:
    "Explore All lighting Brands that give a solution of every lighting situation (Balcom | Mister Led | Jetra  )",
  description:
    "Elevate your space with Art Lighting. Our curated collection of lighting solutions caters to every style and need. Whether you're looking to create a cozy ambiance or illuminate a large area, we have the perfect lighting fixture for you. Shop now and discover the difference quality lighting can make.",
});

