"use client";

import { Button } from "@repo/ui/button";
import { Clock, X } from "lucide-react";
import { useState } from "react";
import { Container } from "@repo/ui";

export default function WhiteFridayBanner() {
  const [isBannerVisible, setIsBannerVisible] = useState(true);
  const handleClose = () => {
    setIsBannerVisible(false);
  };
  if (!isBannerVisible) return null;
  return (
    <div className="bg-gradient-to-r to-primary via-accent from-secondary text-primary-foreground shadow-lg relative overflow-hidden">
      <div className="absolute inset-0 opacity-10"></div>
      <Container>
        <div className="flex flex-col sm:flex-row justify-between items-center py-6 px-4 sm:px-6 relative z-10">
          <div className="flex items-center space-x-3 mb-4 sm:mb-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              Chandelier decor!
            </h2>
          </div>
          <div className="flex flex-col items-center sm:items-end space-y-2">
            <p className="font-bold flex items-center flex-wrap justify-center sm:justify-end">
              <span className="mr-2 inline-block animate-bounce text-lg sm:text-xl md:text-2xl lg:text-3xl text-primary-foreground">
                Up to 20% OFF
              </span>
              <span className="text-base sm:text-lg md:text-xl font-semibold px-2 py-1 rounded-md">
                All Chandelier Products
              </span>
            </p>
            <div className="flex items-center space-x-2 text-sm sm:text-base bg-primary-foreground/20 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              <span>Limited Time Offer | Online & In-Store</span>
            </div>
          </div>
        </div>
      </Container>
      <Button
        onClick={handleClose}
        variant="ghost"
        size="icon"
        className="absolute z-50 cursor-pointer right-2 top-2 sm:right-4 text-primary-foreground hover:text-black transition-colors duration-300"
        aria-label="Close banner"
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6" />
      </Button>
    </div>
  );
}
