
"use client"
import { addToCart } from "@/actions/cart";
import NormalPrice from "@/components/normal-price";
import { useAuth } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@repo/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { toast } from "sonner";
import AddToCardIcon from "../add-to-card";
import DiscountPrice from "../discount-price";
import styles from "./product-card.module.css";
import { cn } from "@repo/ui/lib/utils";

interface Product {
  productId: string;
  productName: string;
  Brand: string;
  price: number;
  productImages: string[];
  sectionType: string;
  spotlightType: string;
  discount: number;
  ProductId: string;
  ChandelierLightingType: string;
  hNumber: number;
  maximumWattage: string;
  lampBase: string;
  mainMaterial: string;
  beamAngle: string;
}

export default function ProductCard({ product }: { product: Product }) {
  const [isPending, startTransition] = useTransition();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const handleSlideChange = (index: number) => {
    setCurrentIndex(index);
  };
  const [isClicked, setIsClicked] = useState(false);
  const HandleClickedButtons = () => {
    setIsClicked(true);
  };
  const { isSignedIn } = useAuth();
  const handleAddToCart = () => {
    if (!isSignedIn) {
      toast("Please sign in to add items to your cart.");
      return;
    }

    startTransition(async () => {
      try {
        await addToCart(product.productId);
        toast.success(`${product.productName} has been added to your cart successfully.`);
      } catch (error) {
        console.error("Failed to add item to cart:", error)
        toast("Failed to add item to cart. Please try again.")
      }
    });
  };
  function createProductDescription() {
    if (
      product.Brand === "mister-led" &&
      product.ChandelierLightingType === "lamp"
    ) {
      return `${product.mainMaterial} LED chandelier with with ${product.lampBase} base & ${product.hNumber * 12}W. Adjustable color temperature for versatile lighting.`;
    } else if (product.Brand === "balcom" && product.sectionType === "indoor") {
      return `Sleek ${product.mainMaterial} LED spotlight for indoor use. ${product.beamAngle} beam angle with adjustable color temperature.`;
    } else if (
      product.Brand === "balcom" &&
      product.sectionType === "outdoor"
    ) {
      return `Durable ${product.spotlightType} for outdoor spaces. Bright, energy-efficient LEDs with weatherproof design.`;
    } else if (
      product.Brand === "mister-led" &&
      product.ChandelierLightingType === "LED"
    ) {
      return `Elegant ${product.mainMaterial} LED chandelier with wattage of ${product.maximumWattage} . Brushed nickel finish for a modern look.`;
    }
  }
  return (
    <div className={`${styles.productItem} select-none `}>
      <div>
        <div className="absolute top-[5%] left-0 z-10 px-[5px] py-[7px] flex items-center justify-center text-background  text-xs rounded-tl-[0] rounded-br-[5px] rounded-tr-[5px] rounded-bl-[0] bg-[#676769] dark:bg-[#dad4d4]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 640 512"
          >
            <path d="M112 0C85.5 0 64 21.5 64 48V96H16c-8.8 0-16 7.2-16 16s7.2 16 16 16H64 272c8.8 0 16 7.2 16 16s-7.2 16-16 16H64 48c-8.8 0-16 7.2-16 16s7.2 16 16 16H64 240c8.8 0 16 7.2 16 16s-7.2 16-16 16H64 16c-8.8 0-16 7.2-16 16s7.2 16 16 16H64 208c8.8 0 16 7.2 16 16s-7.2 16-16 16H64V416c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V288 256 237.3c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H112zM544 237.3V256H416V160h50.7L544 237.3zM160 368a48 48 0 1 1 0 96 48 48 0 1 1 0-96zm272 48a48 48 0 1 1 96 0 48 48 0 1 1 -96 0z" />
          </svg>
          <span className="ml-1.5">Fast shipping</span>
        </div>
        <div className="absolute top-[3px] right-[5px] z-10 px-[5px] py-[7px] flex items-center justify-center text-background text-xs">
          <Badge className="rounded-none text-sm" variant={"destructive"}>
            {product.discount * 100}%
          </Badge>
        </div>
        <div></div>
      </div>
      <div className={styles.productContent}>
        <div className={styles.imageContainer}>
          {product?.productImages && (
            <Carousel
              className={styles.imageCarousel}
              showThumbs={false}
              showStatus={false}
              useKeyboardArrows={true}
              infiniteLoop={false}
              autoPlay={false}
              selectedItem={currentIndex}
              onChange={handleSlideChange}
              renderArrowPrev={(onClickHandlerLeft, hasPrev, label) =>
                hasPrev && (
                  <button
                    type="button"
                    onClick={onClickHandlerLeft}
                    title={label}
                    className={styles.controlPrev}
                  >
                    <span className={styles.arrowPrev}>
                      <svg
                        className="w-6 h-6 text-foreground "
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="26"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path stroke="currentColor" d="m15 19-7-7 7-7" />
                      </svg>
                    </span>
                  </button>
                )
              }
              renderArrowNext={(onClickHandlerRight, hasNext, label) =>
                hasNext && (
                  <button
                    type="button"
                    onClick={onClickHandlerRight}
                    title={label}
                    className={styles.controlNext}
                  >
                    <span className={styles.arrowNext}>
                      <svg
                        className="w-6 h-6 text-foreground"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path stroke="currentColor" d="m9 5 7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                )
              }
            >
              {product.productImages.map((image, index) => (
                <div key={index} className="w-full h-full">
                  <Image
                    className={`w-full overflow-x-hidden`}
                    src={image}
                    alt={product.productId}
                    width={500}
                    height={400}
                    quality={100}
                  />
                </div>
              ))}
            </Carousel>
          )}
        </div>
        <div className={styles.textContainer}>
          <h2 className={`${styles.productTitle} text-foreground`}>
            {product.productId || product.ProductId}
          </h2>
          <p
            className={`${styles.textParagraph} text-muted-foreground  font-normal capitalize`}
          >
            {createProductDescription()}
          </p>
          <div>
            <div className="font-medium text-lg mt-[5] mx-[0] mb-[0] ">
              {product.discount > 0 ? (
                <div className="flex items-center">
                  <span className="text-lg text-destructive font-semibold">
                    <DiscountPrice
                      price={product.price}
                      discount={product.discount}
                      sectionType={product.sectionType}
                    />
                  </span>
                  <s className="text-gray-500 italic ml-1.5 text-base">
                    <NormalPrice
                      price={product.price}
                      sectionType={product.sectionType}
                    />
                  </s>
                </div>
              ) : (
                <div className="flex items-center">
                  <span className="italic text-base ">
                    <NormalPrice
                      price={product.price}
                      sectionType={product.sectionType}
                    />
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={`${styles.buttons} flex justify-end pt-[10px] w-full`}>
          <span className={styles.DetailsContainer}>
            <Link
              prefetch={true}
              href={`/category/${product.Brand}/${product.sectionType}/${product.spotlightType}/${product.productId || product.ProductId}`}
              aria-label="More details"
              className={cn(
                `px-[25px] py-[10px] rounded-[3px] cursor-pointer h-10 flex justify-center items-center border border-black dark:border-gray-50 text-gray-950 dark:hover:text-gray-950 dark:text-gray-50  w-full hover:bg-gray-950 hover:text-gray-50 dark:hover:bg-gray-50 transition-colors`,
                {
                  "dark:bg-gray-50 dark:text-primary-foreground bg-black text-gray-50":
                    isClicked,
                },
              )}
              onClick={HandleClickedButtons}
            >
              More details
            </Link>
          </span>
          <span className={styles.AddToCardContainer}>
            <Button
              onClick={handleAddToCart}
              disabled={isPending}
              className="flex rounded-[3px] justify-center items-center px-[9px] w-10 h-10 mx-0 bg-gray-950 hover:bg-gray-950 text-gray-50 dark:bg-gray-50 dark:text-gray-950 dark:hover:bg-gary-50/90"
            >
              <AddToCardIcon Fill="currentColor" width={24} height={24} />
            </Button>
          </span>
        </div>
      </div>
    </div>
  );
};