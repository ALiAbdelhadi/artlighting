"use client";

import { cn } from "@repo/ui"
import { motion } from "framer-motion";
import { CheckCircle, Circle } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const Steps = () => {
  const pathname = usePathname();
  const [productId, setProductId] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();
        setProductId(data.productId);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [productId]);

  const STEPS = [
    {
      name: "Preview",
      description: "Review your product before confirming your order.",
      url: `/preview/${productId}`,
    },
    {
      name: "Confirm",
      description: "Enter your shipping address and information.",
      url: "/confirm",
    },
    {
      name: "Complete",
      description: "Review your order, shipping price, and all information.",
      url: "/complete",
    },
  ];

  const getCurrentStepIndex = () => {
    return STEPS.findIndex((step) => pathname.includes(step.url));
  };

  return (
    <div className="bg-gradient-to-r from-neutral-50-50 to-background dark:from-[#1c1a17] dark:to-[#1d1d1d] rounded-lg shadow-md px-4 sm:px-6 pb-8 pt-10 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-8 gap-4 relative">
        {STEPS.map((step, i) => {
          const currentStepIndex = getCurrentStepIndex();
          const isCurrent = i === currentStepIndex;
          const isCompleted = i < currentStepIndex;
          return (
            <React.Fragment key={step.name}>
              <motion.div
                className="flex flex-col items-center relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div
                  className={cn(
                    "flex items-center justify-center md:w-16 md:h-16 w-12 h-12 rounded-full font-medium md:text-xl text-lg transition-colors duration-300",
                    {
                      "bg-primary text-primary-foreground shadow-lg": isCurrent,
                      "bg-white dark:bg-gray-950 text-primary border-2 border-green-500":
                        isCompleted,
                      "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400":
                        !isCurrent && !isCompleted,
                    },
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="md:w-8 md:h-8 w-6 h-6 text-green-500 dark:text-green-400" />
                  ) : (
                    <Circle className="md:w-8 md:h-8 w-6 h-6" />
                  )}
                </div>
                <div className="mt-4 text-center">
                  <span
                    className={cn("block md:text-lg text-base font-semibold", {
                      "text-primary dark:text-primary": isCurrent,
                      "text-gray-900 dark:text-gray-200": !isCurrent,
                    })}
                  >
                    {step.name}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 mt-2 block max-w-xs mx-auto">
                    {step.description}
                  </span>
                </div>
              </motion.div>
              {i === 0 && (
                <div className="hidden md:block absolute top-8 left-1/3 w-1/3 h-0.5 bg-gray-300 dark:bg-gray-700 -translate-y-1/2" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Steps;
