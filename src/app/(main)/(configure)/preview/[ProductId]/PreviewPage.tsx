"use client";

import Container from "@/app/components/Container";
import LoginModal from "@/app/components/LoginModal";
import DiscountPrice from "@/app/helpers/DiscountPrice";
import NormalPrice from "@/app/helpers/NormalPrice";
import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatPrice } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Configuration, Product } from "@prisma/client";
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { createOrder } from "./action";

type PreviewPageProps = {
    configuration: Configuration;
    discount: number;
    productId: string;
};

const fetchProduct = async (productId: string): Promise<Product> => {
    const response = await fetch(`/api/products/${productId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch product");
    }
    return response.json();
};

const PreviewPage: React.FC<PreviewPageProps> = ({
    configuration: initialConfiguration,
    discount,
    productId
}) => {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const handleSlideChange = (index: number) => {
        setCurrentIndex(index);
    };
    const [configuration, setConfiguration] = useState<Configuration>(initialConfiguration);
    const { ProductId } = useParams();
    const [quantity, setQuantity] = useState<number>(1);
    const router = useRouter();
    const { toast } = useToast();
    const { isLoaded, isSignedIn, user } = useUser();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
    const { data: product, isLoading, isError } = useQuery<Product>({
        queryKey: ['product', productId],
        queryFn: () => fetchProduct(productId),
        enabled: !!productId,
    });

    useEffect(() => {
        const storedQuantity = localStorage.getItem(`quantity-${ProductId}`);
        setQuantity(storedQuantity ? parseInt(storedQuantity, 10) : 1);
    }, [ProductId]);

    useEffect(() => {
        console.log("Configuration:", configuration);
    }, [configuration]);

    useEffect(() => {
        if (configuration) {
            localStorage.setItem("configurationId", configuration.id);
        }
    }, [configuration]);

    const { mutate: CreateOrderSession, isPending } = useMutation({
        mutationKey: ["get-order-session"],
        mutationFn: createOrder,
        onSuccess: ({ userId, orderId, productId }) => {
            localStorage.removeItem("configurationId");
            localStorage.clear()
            router.push(
                `/confirm/?orderId=${orderId}&userId=${userId}&productId=${productId}`
            );
        },
        onError: (error) => {
            toast({
                title: "Something went wrong",
                description:
                    "There was an error creating your order. Please try again.",
                variant: "destructive",
                className: "rounded-lg"
            });
            console.error("Error creating order:", error);
        },
    });
    useEffect(() => {
        const fetchLatestConfiguration = async () => {
            if (ProductId) {
                const response = await fetch(`/api/configurations/${ProductId}`);
                if (response.ok) {
                    const latestConfig = await response.json();
                    setConfiguration(latestConfig);
                }
            }
        };
        fetchLatestConfiguration();
    }, [ProductId]);
    const handleConfirm = async () => {
        if (isSignedIn) {
            if (configuration) {
                CreateOrderSession({ configId: configuration.id, quantity, });
            }
        } else {
            setIsLoginModalOpen(true);
        }
    };
    if (isLoading)
        return (
            <div className="w-full mt-24 flex justify-center pb-24">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
                    <h3 className="font-semibold text-2xl">Loading your order...</h3>
                    <p>This won't take long.</p>
                </div>
            </div>
        );
    if (isError) {
        return (
            <div className="w-full mt-24 flex justify-center pb-24">
                <div className="flex flex-col items-center gap-2">
                    <h3 className="font-semibold text-2xl">Error loading product</h3>
                    <p>There was an error fetching the product details. Please try again.</p>
                </div>
            </div>
        );
    }
    if (isError || !product) {
        return <div>Error loading product</div>;
    }

    if (!product) return null;
    console.log(product.sectionType)
    return (
        <div className=" min-h-screen">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="py-12"
                >
                    <h1 className="lg:text-3xl md:text-2xl text-xl font-bold sm:mb-8">
                        Preview Your Order
                    </h1>
                    <LoginModal
                        isOpen={isLoginModalOpen}
                        setIsOpen={setIsLoginModalOpen}
                    />
                    <div className="flex flex-col lg:flex-row lg:gap-x-12 gap-x-0">
                        <div className="lg:w-[40%] md:w-[50%] mb-0">
                            {product.productImages && product.productImages.length > 0 ? (
                                <div>
                                    <Carousel
                                        showThumbs={true}
                                        showStatus={false}
                                        useKeyboardArrows={true}
                                        infiniteLoop={true}
                                        autoPlay={false}
                                        selectedItem={currentIndex}
                                        onChange={handleSlideChange}
                                        renderThumbs={() =>
                                            product.productImages.map((img, index) => (
                                                <div key={index}>
                                                    <Image
                                                        src={img}
                                                        alt={`Thumbnail ${index + 1}`}
                                                        width={64}
                                                        height={64}
                                                        className="object-cover rounded"
                                                    />
                                                </div>
                                            ))
                                        }
                                    >
                                        {product.productImages.map((img, index) => (
                                            <div key={index} className="w-full aspect-square ">
                                                <Image
                                                    src={img}
                                                    alt={`Product image ${index + 1}`}
                                                    width={500}
                                                    height={500}
                                                    priority
                                                    quality={100}
                                                    className="object-cover rounded-lg w-[550px]"
                                                />
                                            </div>
                                        ))}
                                    </Carousel>
                                </div>
                            ) : (
                                <div className="w-full h-[450px] flex items-center justify-center bg-gray-100 rounded-lg">
                                    <p>No images available</p>
                                </div>
                            )}
                        </div>
                        <div>
                            <div className="h-[37.5rem] w-full col-span-full lg:col-span-1 flex flex-col ">
                                <ScrollArea className="relative flex-1 overflow-auto">
                                    <div
                                        aria-hidden="true"
                                        className="absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent  dark:from-[#252525] dark:to-transparent pointer-events-none"
                                    />
                                    <div className="p-[18px]">
                                        <div className="-ml-4">
                                            <h2 className="md:text-2xl text-xl mt-6 font-bold text-primary">
                                                {product.productName}
                                            </h2>
                                            <div className="mt-3 flex items-center gap-1.5 text-base">
                                                <Check className="h-4 w-4 text-green-500" />
                                                In stock and ready to ship
                                            </div>
                                        </div>
                                        <div className="sm:col-span-12 md:col-span-9 text-base mb-6">
                                            <div className="grid grid-cols-1 border-b border-gray-200 py-4 sm:py-2 md:py-4">
                                                <div>
                                                    <p className="font-bold md:text-xl text-lg -ml-4">Highlights</p>
                                                    <ol className="mt-3 list-disc space-y-1">
                                                        <li className="md:text-lg text-base">
                                                            <p className={"inline tracking-wide "}>
                                                                <strong>Bright and long-lasting LEDs:</strong>{" "}
                                                                Epistar LEDs deliver high luminous flux{" "}
                                                                {product.luminousFlux} for excellent Indoor
                                                                lighting.
                                                            </p>
                                                        </li>
                                                        <li className="md:text-lg text-base">
                                                            <p className={"inline tracking-wide"}>
                                                                <strong>Durable build: </strong> The{" "}
                                                                {product.mainMaterial} housing ensures longevity
                                                                in various Indoor environments.
                                                            </p>
                                                        </li>
                                                        <li className="md:text-lg text-base">
                                                            <p className={"inline tracking-wide"}>
                                                                <strong>Adaptable lighting:</strong> With a
                                                                choice of color temperatures and wide beam
                                                                angle, this product suits various Indoor spaces.
                                                            </p>
                                                        </li>
                                                        <li className="md:text-lg text-base">
                                                            <p className={"inline tracking-wide"}>
                                                                <strong>Dimmable:</strong> While the product
                                                                itself is not dimmable, it comes with an
                                                                internal Balcom driver that ensures consistent
                                                                and reliable operation.
                                                            </p>
                                                        </li>
                                                    </ol>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 border-b border-gray-200 py-4 sm:py-2 md:py-4">
                                                <div>
                                                    <p className="font-bold md:text-xl text-lg -ml-4">Features</p>
                                                    <ol className="mt-3 list-disc space-y-1">
                                                        <li className="md:text-lg text-base">
                                                            <p className={"inline tracking-wide"}>
                                                                <strong>
                                                                    3-year warranty: Ensures long-lasting quality
                                                                    and peace of mind.{" "}
                                                                </strong>
                                                            </p>
                                                        </li>
                                                    </ol>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-8">
                                            <div className="py-4 sm:py-6 sm:rounded-lg">
                                                <div className="flow-root text-lg">
                                                    {discount > 0 ? (
                                                        <>
                                                            <div className="flex items-center justify-between py-1 mt-2">
                                                                <p className="md:text-lg text-base">Price Per item</p>
                                                                <s className="text-gray-500 md:text-lg text-base">
                                                                    <NormalPrice price={configuration.configPrice} />
                                                                </s>
                                                            </div>
                                                            {/* products quantity */}
                                                            <div className="flex items-center justify-between py-1 mt-2">
                                                                <p className="md:text-lg text-base">Quantity</p>
                                                                <p className="md:text-lg text-base">{quantity}</p>
                                                            </div>
                                                            {/* discount value */}
                                                            <div className="flex items-center justify-between py-1 mt-2">
                                                                <p className="md:text-lg text-base">Discount amount</p>
                                                                <span className="text-green-600 font-semibold md:text-lg text-base ml-5 ">
                                                                    {`${product.discount * 100}%`}
                                                                </span>
                                                            </div>
                                                            {/* price after discount */}
                                                            <div className="flex items-center justify-between py-1 mt-2">
                                                                <p className="md:text-lg text-base">Price after Discount</p>
                                                                <span className="md:text-lg text-base text-destructive font-semibold">
                                                                    <DiscountPrice
                                                                        price={configuration.configPrice}
                                                                        discount={product.discount}
                                                                        quantity={quantity}

                                                                    />
                                                                </span>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="flex items-center justify-between py-1 mt-2">
                                                                <p>Price Per item</p>
                                                                <p><NormalPrice price={configuration.configPrice} /></p>
                                                            </div>
                                                            <div className="flex items-center justify-between py-1 mt-2">
                                                                <p>Quantity</p>
                                                                <p>{quantity}</p>
                                                            </div>
                                                            <div className="flex items-center justify-between py-1 mt-2">
                                                                <p>Total Price</p>
                                                                <p>
                                                                    <NormalPrice
                                                                        price={configuration.configPrice}
                                                                        quantity={quantity}
                                                                    />
                                                                </p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ScrollArea>
                            </div>
                            <div className="mt-8 flex md:justify-end justify-center pb-12">
                                <Button
                                    onClick={handleConfirm}
                                    isLoading={isPending}
                                    disabled={isPending || !isLoaded}
                                    loadingText="Confirming your order"
                                    className="sm:h-[52px] h-[40px] sm:px-10 px-8 bg-primary text-primary-foreground sm:text-lg text-base"
                                >
                                    Confirm your order
                                    <ArrowRight className="sm:h-[18px] sm:w-[18px] h-[16px] w-[16px] ml-1.5 inline" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </Container>
        </div>
    );
};

export default PreviewPage;
