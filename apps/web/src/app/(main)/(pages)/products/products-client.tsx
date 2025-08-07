"use client";

import { Container } from "@repo/ui";
import ProductCard from "@/components/product-card/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@repo/ui/lib/utils";
import Link from "next/link";
import { useState } from "react";

interface Product {
  productId: string;
  ProductId: string;
  productName: string;
  Brand: string;
  price: number;
  productImages: string[];
  sectionType: string;
  spotlightType: string;
  discount: number;
}

interface ProductsClientProps {
  products: Product[];
}

export default function ProductsClient({ products }: ProductsClientProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClickedButtons = () => {
    setIsClicked(true);
  };

  return (
    <section className="py-12 md:py-14 lg:py-16">
      <Container>
        <div className="mb-10 md:mb-12 text-center">
          <h2 className="font-bold text-2xl md:text-3xl tracking-tight mb-2">
            Best-Selling Products
          </h2>
          <p className="text-muted-foreground">
            Check out our top-selling items across all categories.
          </p>
        </div>
        <div className="flex items-center justify-center flex-col">
          <Carousel className="w-full">
            <CarouselContent className="pl-4">
              {products.map((product) => (
                <CarouselItem
                  key={product.productId}
                  className="pl-1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 m-0"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="ml-9 h-10 w-10 bg-slate-50 text-gray-950" />
            <CarouselNext className="mr-9 h-10 w-10 bg-slate-50 text-gray-950" />
          </Carousel>
          <div className="flex items-center justify-center mt-10">
            <Link
              className={cn(
                "flex items-center justify-center transition-colors border-[1.5px] font-medium h-14 md:px-10 px-7 md:text-lg text-sm w-full rounded",
                "bg-background text-foreground border-border hover:bg-gray-950 hover:text-muted hover:border-gray-950",
                "dark:bg-background dark:text-foreground dark:border-border dark:hover:bg-accent dark:hover:text-accent-foreground",
                {
                  "bg-accent text-accent-foreground dark:bg-accent dark:text-accent-foreground border-gray-950":
                    isClicked,
                }
              )}
              href="/category"
              onClick={handleClickedButtons}
            >
              Explore All Products
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};
