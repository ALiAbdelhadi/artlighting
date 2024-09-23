"use client";
import { addToCart } from "@/app/(main)/actions/cart";
import {
    saveConfig as _saveConfig,
    SaveConfigArgs,
} from "@/app/components/action";
import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Configuration,
    Order,
    ProductChandLamp,
    ProductColorTemp,
    ProductIP
} from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import DiscountPrice from "../helpers/DiscountPrice";
import NormalPrice from "../helpers/NormalPrice";
import AddToCardIcon from "./AddToCardIcon";
import ProductChandLampButtons from "./ProductChandLampButtons";
import ProductColorTempStatus from "./ProductColorTempButtons";
import ProductIPButtons from "./ProductIPButtons";

type ProductDetailsProps = {
    productName: string;
    price: number;
    quantity: number;
    increaseQuantity: () => void;
    decreaseQuantity: () => void;
    specificationsTable: { [key: string]: string };
    ProductId: string;
    configId: string;
    discount: number;
    colorTemperature: string;
    order: Order;
    ChandelierLightingType: string;
    Brand: string;
    hNumber: number
    configuration: Configuration
};

const ProductMainInfo: React.FC<ProductDetailsProps> = ({
    productName,
    price,
    quantity = 1,
    increaseQuantity,
    decreaseQuantity,
    specificationsTable,
    ProductId,
    configId,
    discount,
    order,
    ChandelierLightingType,
    Brand,
    hNumber,
    configuration
}) => {
    const [showPopup, setShowPopup] = useState(false);
    const [currentQuantity, setCurrentQuantity] = useState(quantity);
    const [isClicked, setIsClicked] = useState(false);
    const [selectedColorTemp, setSelectedColorTemp] = useState<ProductColorTemp>(
        (order?.productColorTemp as ProductColorTemp) || ProductColorTemp.warm
    );
    const [selectedProductIp, setSelectProductIp] = useState<ProductIP>(
        (order?.productIp as ProductIP) || ProductIP.IP20
    );
    const [selectedProductChandLamp, setSelectedProductChandLamp] =
        useState<ProductChandLamp>(
            (order?.productChandLamp as ProductChandLamp) || ProductChandLamp.lamp9w
        );
    const { toast } = useToast();
    const router = useRouter();
    useEffect(() => {
        localStorage.setItem(`quantity-${ProductId}`, currentQuantity.toString());
    }, [currentQuantity, ProductId]);

    const handleIncreaseQuantity = () => {
        setCurrentQuantity(currentQuantity + 1);
        increaseQuantity();
    };

    const handleDecreaseQuantity = () => {
        if (currentQuantity > 0) {
            setCurrentQuantity(currentQuantity - 1);
            decreaseQuantity();
        }
    };
    const { mutate: saveConfig } = useMutation({
        mutationKey: ["save-config"],
        mutationFn: async (args: SaveConfigArgs) => {
            await _saveConfig(args);
        },
        onError: () => {
            toast({
                title: "Something went wrong",
                description:
                    "There was an error on our order. please refresh the page and try again.",
                variant: "destructive",
            });
        },
        onSuccess: () => {
            router.push(`/preview/${ProductId}`);
        },
    });
    const [ipPriceIncrease, setIpPriceIncrease] = useState(0);
    const [priceIncrease, setPriceIncrease] = useState(0);
    const [lampPriceIncrease, setLampPriceIncrease] = useState(0)
    const handleProductChandLampChange = (newProductLamp: ProductChandLamp, newPriceIncrease: number) => {
        setSelectedProductChandLamp(newProductLamp);
        setLampPriceIncrease(newPriceIncrease);
    };
    const handleProductIPChange = (
        newProductIp: ProductIP,
        newPriceIncrease: number
    ) => {
        setSelectProductIp(newProductIp);
        setPriceIncrease(newPriceIncrease);
    };
    const totalPrice = price + priceIncrease  + lampPriceIncrease;
    const handleClick = () => {
        saveConfig({
            configId,
            ProductId,
            configPrice: totalPrice,
            priceIncrease,
            lampPriceIncrease,
            quantity: currentQuantity,
            discount,
            totalPrice
        });
        setIsClicked(true);
    };
    const handleColorTempChange = (newColorTemp: ProductColorTemp) => {
        setSelectedColorTemp(newColorTemp);
    };

    const handleAddToBag = async () => {
        if (currentQuantity >= 10) {
            setShowPopup(true);
        } else {
            await addToCart(ProductId);
            toast({
                title: "Product Add To Card",
                description: `${productName} has been added to your card`,
            });
        }
    };

    console.log('Price:', price, 'Price Increase:', priceIncrease, 'Lamp Price Increase:', lampPriceIncrease, 'Total Price:',totalPrice);

    return (
        <div className="md:ml-16">
            <h1 className="md:text-4xl sm:text-3xl text-2xl mt-5 mb-2 font-bold uppercase">
                {productName}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-3 ">
                Elevate your Indoor ambiance with the {productName}, a sleek,
                energy-efficient downlight that offers adjustable color temperature,
                wide beam angle, and long-lasting performance.
            </p>
            <div className="flex flex-col mb-1 ">
                <div
                    className={cn(
                        "grid gap-x-12 gap-y-4",
                        ChandelierLightingType === "lamp" &&
                        Brand === "MisterLed" &&
                        "sm:grid-cols-2",
                        Brand === "Balcom" && "sm:grid-cols-2"
                    )}
                >
                    <div className="space-x-2">
                        {ChandelierLightingType === "lamp" && Brand === "MisterLed" ? (
                            <ProductChandLampButtons
                                productId={ProductId}
                                productChandLamp={selectedProductChandLamp}
                                onProductLampChange={handleProductChandLampChange}
                                basePrice={price}
                                hNumber={hNumber}
                            />
                        ) : null}
                        {Brand === "Balcom" && (
                            <ProductIPButtons
                                productId={ProductId}
                                productIp={selectedProductIp}
                                onProductIpChange={handleProductIPChange}
                                basePrice={price}
                            />
                        )}
                    </div>
                    <div className="space-x-2 mt-4 sm:mt-0">
                        <ProductColorTempStatus
                            productId={ProductId}
                            productColorTemp={selectedColorTemp}
                            onColorTempChange={handleColorTempChange}
                        />
                    </div>
                </div>
            </div>
            <div className="my-4 flex items-center space-x-3">
                {discount > 0 ? (
                    <>
                        <span className="text-lg">
                            <DiscountPrice
                                price={totalPrice}
                                discount={discount}
                                quantity={currentQuantity}
                            />
                        </span>
                        <s className="text-gray-500 font-semibold ml-1.5 text-base">
                            <NormalPrice
                                price={totalPrice}
                                quantity={currentQuantity}
                            />
                        </s>
                        <span className="text-green-500 font-medium">
                            {discount * 100}%
                        </span>
                    </>
                ) : (
                    <span className="text-lg font-semibold">
                        <NormalPrice
                            price={totalPrice}
                            quantity={currentQuantity}
                        />
                    </span>
                )}
            </div>
            <div className="flex justify-between w-full">
                <p className="text-primary md:text-xl text-[16px] flex items-center">
                    Check Stores Availability
                    <ArrowRight className="w-6 h-6 ml-2 mt-2.5" />
                </p>
                <p className="text-green-400 md:text-lg text-[16px]">in Stock</p>
            </div>
            <div>
                <div className="flex items-center justify-center gap-2 mt-4 max-w-full">
                    <div className="rounded flex flex-row items-center">
                        <Button
                            size="icon"
                            onClick={handleDecreaseQuantity}
                            variant={"secondary"}
                            className="sm:w-[3.3rem] sm:h-[3.3rem] w-[2.8rem] h-[2.8rem] shadow-md hover:shadow-lg transition-shadow  "
                        >
                            <Minus className="md:w-6 md:h-6 h-4 w-4 " />
                        </Button>
                        <span className="text-lg md:mx-5 my-2 mx-3">{currentQuantity}</span>
                        <Button
                            size="icon"
                            onClick={handleIncreaseQuantity}
                            variant={"secondary"}
                            className="sm:w-[3.3rem] sm:h-[3.3rem] w-[2.8rem] h-[2.8rem] shadow-md hover:shadow-lg  transition-shadow  "
                        >
                            <Plus className="md:w-6 md:h-6 h-4 w-4 " />
                        </Button>
                    </div>
                    <button
                        onClick={handleAddToBag}
                        className="bg-primary text-white font-medium md:px-4 md:py-3 px-3 py-3 md:text-lg text-sm w-full rounded uppercase flex items-center justify-center"
                    >
                        Add to Card
                        <AddToCardIcon
                            Fill="#fff"
                            width={23}
                            height={23}
                            className="md:block hidden ml-1"
                            style={undefined}
                        />
                    </button>
                </div>
                <div className="flex items-center justify-center gap-4 mt-4 max-w-full">
                    <button
                        onClick={handleClick}
                        className={cn(
                            "border-gray-950 dark:border-gray-50 transition-colors duration-300 bg-gray-50 dark:bg-transparent border-[1.5px] font-medium md:px-4 md:py-3 px-3 py-3 md:text-lg text-sm w-full rounded",
                            {
                                "bg-black text-white": isClicked,
                                "hover:bg-black hover:text-white": !isClicked,
                                "dark:hover:bg-gray-100 dark:hover:text-gray-950 dark:text-gray-100 dark:bg-background":
                                    !isClicked,
                                "dark:bg-white dark:text-gray-950": isClicked && "dark",
                            }
                        )}
                    >
                        Order Now
                    </button>
                </div>
            </div>
            <div className="mt-6">
                <h2 className="sm:text-2xl text-xl font-semibold">Description:</h2>
                <p className="text-muted-foreground text-base sm:text-lg md:text-xl mt-2">
                    Infuse your Indoor spaces with the {productName}, a downlight that
                    seamlessly blends contemporary design with exceptional functionality.
                    This versatile fixture boasts a sleek,{" "}
                    {specificationsTable["Main Material"]} construction that exudes
                    elegance while ensuring long-lasting durability. Experience the
                    perfect balance of style and energy efficiency, with the {productName}{" "}
                    effortlessly illuminating your living environment with a luminous flux
                    of {specificationsTable["Luminous Flux"]} and a choice of color
                    temperatures ranging from warm{" "}
                    {specificationsTable["Color Temperature"]}.
                </p>
            </div>
            {showPopup && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg z-[100000000]">
                    <p>
                        We noticed that you ordered 10 or more of this product. Please call
                        a sales person to get the best offer.
                    </p>
                    <button
                        onClick={() => setShowPopup(false)}
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductMainInfo;
