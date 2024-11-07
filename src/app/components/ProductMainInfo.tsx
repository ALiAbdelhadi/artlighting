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
import { updateProductIP } from "../(main)/actions/productIP";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import Link from "next/link";

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
    ip: number
    maxIP: number
    hNumber: number
    configuration: Configuration
    sectionTypes: string[];
    sectionType: string
    maximumWattage: number
    mainMaterial: string
    beamAngle: string
    spotlightType: string
    luminousFlux: string
    lifeTime: string
    energySaving: string
    cri: string
    brandOfLed: string
    electrical: string
    finish?: string
    input?: string
    lampBase?: string
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
    configuration: initialConfiguration,
    ip,
    maxIP,
    sectionTypes,
    sectionType,
    maximumWattage,
    mainMaterial,
    beamAngle,
    spotlightType,
    luminousFlux,
    colorTemperature,
    lifeTime,
    energySaving,
    brandOfLed,
    cri,
    electrical,
    finish,
    input,
    lampBase
}) => {
    const [showDialog, setShowDialog] = useState(false);
    const [currentQuantity, setCurrentQuantity] = useState(quantity);
    const [isClicked, setIsClicked] = useState(false);
    const [selectedColorTemp, setSelectedColorTemp] = useState<ProductColorTemp>(
        (order?.productColorTemp as ProductColorTemp) || ProductColorTemp.warm
    );
    const [configuration, setConfiguration] = useState<Configuration>(initialConfiguration);
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
    const handleProductIPChange = async (
        newProductIp: ProductIP,
        newPriceIncrease: number,
    ) => {
        setSelectProductIp(newProductIp);
        setPriceIncrease(newPriceIncrease);

        if (configId) {
            const result = await updateProductIP({
                productId: ProductId,
                configId,
                newProductIp,
                priceIncrease: newPriceIncrease,
            });
            if (result.success) {
                console.log('Configuration updated successfully');
                // Update the local state with the new configuration
                if (result.updatedConfig) {
                    setConfiguration(result.updatedConfig);
                }
            } else {
                console.error('Failed to update configuration:', result.error);
                // Handle the error, maybe show a toast to the user
            }
        } else {
            console.error('Configuration ID is missing');
            // Handle the error, maybe show a toast to the user
        }
    };
    const totalPrice = price + priceIncrease + lampPriceIncrease;
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
            setShowDialog(true);
        } else {
            await addToCart(ProductId);
            toast({
                title: (
                    <span className="text-primary text-base">
                        Product Added To Cart
                    </span>
                ),
                description: (
                    <span className="text-sm text-muted-foreground">{productName} has been added to your cart</span>
                ),
                className: "rounded-lg"
            });
        }
    };

    console.log('Price:', price, 'Price Increase:', priceIncrease, 'Lamp Price Increase:', lampPriceIncrease, 'Total Price:', totalPrice);
    const productsWithIP20Text = ['product-jy-810-10w', 'product-jy-810-12w', "product-jy-810-18w", "product-jy-810-30w"];
    const productsWithMaxIpText = ['product-jy-913-5w', 'product-jy-913-8w', "product-jy-913-12w", "product-jy-913-18w"];
    function createProductDescription() {
        if (Brand === "Balcom" && sectionType === "Indoor") {
            return `Elevate your indoor space with the ${Brand} ${maximumWattage}W LED luminaire. Crafted with premium ${mainMaterial}, this high-performance light offers ${luminousFlux} luminous output, ${beamAngle} beam angle.`;
        } else if (Brand === "Balcom" && sectionType === "Outdoor") {
            return `Illuminate your outdoor area with the ${Brand} ${maximumWattage}W ${spotlightType} lighting fixture. Built to withstand the elements with its IP${ip} weatherproof rating and durable ${mainMaterial} construction, this fixture delivers ${luminousFlux} luminous output and ${beamAngle} beam spread. Experience ${colorTemperature}`;
        } else if (Brand === "MisterLed" && sectionType === "Chandelier" && ChandelierLightingType === "LED") {
            return `Transform your space with this elegant ${Brand} ${maximumWattage}W LED chandelier. Featuring a sophisticated ${finish} finish and crafted from ${mainMaterial}, this modern fixture combines style with energy-efficient LED technology.`;
        } else if (Brand === "MisterLed" && sectionType === "Chandelier" && ChandelierLightingType === "lamp") {
            return `Enhance your interior with this stunning ${Brand} chandelier, designed with ${hNumber * 12}w elegant Lamp counted: ${hNumber} with 12W lamp holders. Beautifully crafted from ${mainMaterial} with a refined ${finish} finish, this versatile fixture allows you to customize your lighting experience with ${lampBase} bulbs.`;
        }
    }

    function createProductDescriptionFull() {
        if (Brand === "Balcom" && sectionType === "Indoor") {
            return `Elevate your indoor space with the ${Brand} ${maximumWattage}W LED luminaire. Crafted with premium ${mainMaterial}, this high-performance light offers ${luminousFlux} lumens of brightness, a ${beamAngle} degree beam angle, and adjustable ${colorTemperature}K color temperature. Enjoy up to ${lifeTime} hours of reliable performance, save ${energySaving}% on your energy bills, and experience exceptional color rendering with a CRI of ${cri}. Designed for IP${ip} rated environments, this luminaire features ${brandOfLed} LEDs and ${electrical} for optimal efficiency.`;
        } else if (Brand === "Balcom" && sectionType === "Outdoor") {
            return `Illuminate your outdoor area with the ${Brand} ${maximumWattage}W ${spotlightType} lighting fixture. Built to withstand the elements with its IP${ip} weatherproof rating and durable ${mainMaterial} construction, this fixture delivers ${luminousFlux} lumens of brightness and a ${beamAngle} degree beam spread. Experience ${colorTemperature} color temperature, ${lifeTime} hours of long-lasting performance, and ${energySaving}% energy efficiency. Equipped with ${brandOfLed} LEDs and ${electrical}, this fixture provides reliable lighting for any outdoor setting.`;
        } else if (Brand === "MisterLed" && sectionType === "Chandelier" && ChandelierLightingType === "LED") {
            return `Transform your space with this elegant ${Brand} ${maximumWattage}W LED chandelier. Featuring a sophisticated ${finish} finish and masterfully crafted from ${mainMaterial}, this modern fixture combines timeless style with cutting-edge LED technology. Operating at ${input}, it offers flexible lighting options with adjustable color temperatures of ${colorTemperature}. With an impressive lifespan of ${colorTemperature} hours, this chandelier provides long-lasting, maintenance-free illumination while adding a touch of luxury to your space.`;
        } else if (Brand === "MisterLed" && sectionType === "Chandelier" && ChandelierLightingType === "lamp") {
            return `Enhance your interior with this stunning ${Brand} chandelier, thoughtfully designed with ${hNumber * 12}w Lamp counted: ${hNumber} with 12W lamp elegant lamp holders. Beautifully crafted from ${mainMaterial} with a refined ${finish} finish, this versatile fixture allows you to customize your lighting experience with ${lampBase} bulbs. Operating at ${input}, it supports various color temperatures (${colorTemperature}) to suit your mood and decor. The chandelier's durable construction and timeless design make it a perfect centerpiece for your living space, dining room, or entryway. Design flexibility allows you to choose your preferred bulbs (not included) for personalized illumination.`;
        }
    }
    return (
        <div className="md:ml-16">
            <h1 className="md:text-4xl sm:text-3xl text-2xl mt-5 mb-2 font-bold uppercase">
                {productName}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-3 ">
                {createProductDescription()}
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
                                configId={configId}
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
                <p className="text-primary md:text-xl sm:text-lg text-base flex items-center">
                    Check Stores Availability
                    <ArrowRight className="sm:w-6 sm:h-6 w-5 h-5 ml-2" />
                </p>
                <p className="text-green-400 md:text-lg text-[16px]">
                    in Stock
                    {productsWithIP20Text.includes(ProductId) && (
                        <span className="text-destructive font-semibold"> (Available only in IP20)</span>
                    )}
                    {productsWithMaxIpText.includes(ProductId) && (
                        <span className="text-destructive font-semibold"> (Available only in IP20,IP44,IP54)</span>
                    )}
                    {sectionTypes.includes("Outdoor") && (
                        <span className="text-destructive font-semibold"> (Available only in IP65,IP68)</span>
                    )}
                </p>
            </div>
            <div>
                <div className="flex items-center justify-center gap-2 mt-4 max-w-full">
                    <div className="rounded flex flex-row items-center">
                        <Button
                            size="icon"
                            onClick={handleDecreaseQuantity}
                            className="sm:w-[3.3rem] sm:h-[3.3rem] w-[2.8rem] h-[2.8rem] shadow-md hover:shadow-lg transition-shadow bg-gray-950 hover:bg-black dark:bg-gray-100 dark:hover:bg-gray-50"
                        >
                            <Minus className="md:w-6 md:h-6 h-4 w-4 " />
                        </Button>
                        <span className="text-lg md:mx-5 my-2 mx-3">{currentQuantity}</span>
                        <Button
                            size="icon"
                            onClick={handleIncreaseQuantity}
                            className="sm:w-[3.3rem] sm:h-[3.3rem] w-[2.8rem] h-[2.8rem] shadow-md hover:shadow-lg  transition-shadow  bg-gray-950 hover:bg-black dark:bg-gray-100 dark:hover:bg-gray-50"
                        >
                            <Plus className="md:w-6 md:h-6 h-4 w-4 " />
                        </Button>
                    </div>
                    <button
                        onClick={handleAddToBag}
                        className="bg-primary text-white font-medium md:px-4 md:py-3 px-3 py-3 md:text-lg text-sm w-full rounded uppercase flex items-center justify-center"
                    >
                        Add to Cart
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
                    {createProductDescriptionFull()}
                </p>
            </div>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text">Bulk Order Notification</DialogTitle>
                        <DialogDescription>
                            We noticed that you're ordering 10 or more of this product. For the best offer, please contact our sales team.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="secondary">Close</Button>
                        </DialogClose>
                        <Link href={"tel:+1154466259"} onClick={() => {
                            console.log("Contacting sales team");
                            setShowDialog(false);
                        }} className="bg-primary rounded-md flex items-center px-5">
                            Contact Sales Team
                        </Link>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProductMainInfo;
