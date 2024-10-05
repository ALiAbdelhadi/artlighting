"use client";
import Container from "@/app/components/Container";
import DiscountPrice from "@/app/helpers/DiscountPrice";
import NormalPrice from "@/app/helpers/NormalPrice";
import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { getUserStatus } from "./action";
type Order = {
    id: string;
    userId: string;
    configurationId: string;
    quantity: number;
    totalPrice: number;
    configPrice: number;
    product: {
        id: string;
        productName: string;
        productImages: string[];
        price: number;
        discount: number;
    };
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phoneNumber: number;
    };
};

const fetchOrderDetails = async (orderId: string) => {
    const response = await fetch(`/api/orders/${orderId}`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch order details");
    }
    return response.json();
};
type ConfirmPageProps = {
    discount: number;
};
const ConfirmPage: React.FC<ConfirmPageProps> = ({ discount }) => {
    const [quantity, setQuantity] = useState<number>(0);
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const {
        data: order,
        isLoading: isOrderLoading,
        error,
    } = useQuery<Order>({
        queryKey: ["orderDetails", orderId],
        queryFn: () => fetchOrderDetails(orderId!),
        enabled: !!orderId,
    });
    const [shippingInfo, setShippingInfo] = useState({
        fullName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phoneNumber: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    useEffect(() => {
        const checkUserStatus = async () => {
            if (!orderId) return;
            try {
                const orderDetails = await getUserStatus({ orderId: Number(orderId) });
                setShippingInfo({
                    fullName: orderDetails.shippingAddress?.fullName || "",
                    address: orderDetails.shippingAddress?.address || "",
                    city: orderDetails.shippingAddress?.city || "",
                    state: orderDetails.shippingAddress?.state || "",
                    zipCode: orderDetails.shippingAddress?.zipCode || "",
                    country: orderDetails.shippingAddress?.country || "",
                    phoneNumber:
                        orderDetails.shippingAddress?.phoneNumber.toString() || "",
                });
                setQuantity(orderDetails.quantity || 0);
            } catch (error) {
                toast({
                    title: "Error",
                    description:
                        (error as Error).message ||
                        "You are not authorized to view this order.",
                    variant: "destructive",
                    className: "rounded-lg"
                });
                router.push("/");
            }
        };
        checkUserStatus();
    }, [orderId, router, toast]);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: order?.userId,
                    productId: order?.product.id,
                    productName: order?.product.productName,
                    productImages: order?.product.productImages || [],
                    quantity: order?.quantity,
                    configPrice: order?.configPrice,
                    productPrice: order?.product.price,
                    totalPrice: order?.totalPrice,
                    shippingMethod: "standard",
                    shippingPrice: 69,
                    configurationId: order?.configurationId,
                    shippingAddress: {
                        fullName: shippingInfo.fullName,
                        address: shippingInfo.address,
                        city: shippingInfo.city,
                        state: shippingInfo.state,
                        zipCode: shippingInfo.zipCode,
                        country: shippingInfo.country,
                        phoneNumber: shippingInfo.phoneNumber,
                    },
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to complete order");
            }
            const data = await response.json();
            toast({
                title: (
                    <span className="text-primary text-base">
                        Your order has been confirmed
                    </span>
                ),
                description: (
                    <span className="text-sm text-muted-foreground">
                        Please check shipping details and product details to continue ordering the product.
                    </span>
                ),
                className: "rounded-lg"
            });
            router.push(`/complete/?orderId=${data.id}`);
        } catch (error) {
            toast({
                title: "Error",
                description:
                    (error as Error).message ||
                    "There was an error confirming your order. Please try again.",
                variant: "destructive",
                className: "rounded-lg"
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    if (isOrderLoading) return <div>Loading order details...</div>;
    if (error)
        return (
            <div className="text-center py-8 text-lg text-destructive">
                Error: {(error as Error).message}
            </div>
        );
    if (!order)
        return <div className="text-center py-8 text-lg">No order found</div>;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="py-12"
        >
            <Container>
                <h1 className="text-2xl font-bold mb-6">Confirm Your Order</h1>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-1/2">
                        {order.product?.productImages?.length > 0 ? (
                            <Carousel
                                showThumbs={false}
                                showStatus={false}
                                useKeyboardArrows={true}
                                infiniteLoop={false}
                                autoPlay={false}
                                className="rounded-lg  sm:w-[300px] md:w-[400px] lg:w-[500px]"
                            >
                                {order.product?.productImages.map((img, index) => (
                                    <div
                                        key={index}
                                        className="w-full sm:w-[300px] md:w-[400px] lg:w-[500px]"
                                    >
                                        <img
                                            src={img}
                                            alt={`Product image ${index + 1}`}
                                            className="object-contain h-[300px] md:h-[400px] lg:h-[500px]"
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        ) : (
                            <span>No images available for this product.</span>
                        )}
                        <div>
                            <h2 className="text-xl font-semibold mt-4">
                                {order.product?.productName}
                            </h2>
                            <div className="grid grid-cols-1 space-y-2 text-lg">
                                <div className="my-4 flex items-center space-x-3">
                                    {discount > 0 ? (
                                        <div className="w-full">
                                            <div className="flex items-center lg:justify-between">
                                                <span>Price Per Item:</span>{" "}
                                                <s className="ml-1.5 text-gray-500">
                                                    <NormalPrice price={order.configPrice} />
                                                </s>
                                            </div>
                                            <div className="flex items-center lg:justify-between">
                                                <span>Quantity:</span> <span>{quantity}</span>
                                            </div>
                                            <div className="flex items-center lg:justify-between ">
                                                <span>discount:</span>{" "}
                                                <span>{order.product?.discount * 100}%</span>
                                            </div>
                                            <div className="flex items-center lg:justify-between">
                                                <span>Price:</span>{" "}
                                                <span className="text-lg text-destructive font-semibold ml-1.5">
                                                    <DiscountPrice
                                                        price={order.configPrice}
                                                        discount={order.product?.discount}
                                                        quantity={quantity}
                                                    />
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full">
                                            <div className="flex items-center lg:justify-between">
                                                <span>Price Per Item: </span>{" "}
                                                <span >
                                                    <NormalPrice price={order.configPrice} />
                                                </span>
                                            </div>
                                            <div className="flex items-center lg:justify-between">
                                                <span>Quantity:</span><span>{quantity}</span>
                                            </div>
                                            <div className="flex items-center lg:justify-between">
                                                <span>Price:</span>{" "}
                                                <span className="text-lg font-semibold">
                                                    <NormalPrice
                                                        price={order.configPrice}
                                                        quantity={quantity}
                                                    />
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="font-semibold text-base text-primary">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        placeholder="John Doe"
                                        value={shippingInfo.fullName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phoneNumber" className="font-semibold text-base text-primary">Phone Number</Label>
                                    <Input
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        placeholder="+1 (555) 123-4567"
                                        value={shippingInfo.phoneNumber}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address" className="font-semibold text-base text-primary">Address</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    placeholder="123 Main St, Apt 4B"
                                    value={shippingInfo.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="state" className="font-semibold text-base text-primary">State / Province</Label>
                                    <Input
                                        id="state"
                                        name="state"
                                        placeholder="NY"
                                        value={shippingInfo.state}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city" className="font-semibold text-base text-primary">City / Government</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        placeholder="New York"
                                        value={shippingInfo.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2" >
                                    <Label htmlFor="zipCode" className="font-semibold text-base text-primary">Zip/Postal Code (optional)  </Label>
                                    <Input
                                        id="zipCode"
                                        name="zipCode"
                                        placeholder="10001"
                                        value={shippingInfo.zipCode}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country" className="font-semibold text-base text-primary">Country</Label>
                                    <Input
                                        id="country"
                                        name="country"
                                        placeholder="United States"
                                        value={shippingInfo.country}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="w-full flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="h-[52px] px-10 bg-primary text-primary-foreground text-lg"
                                >
                                    {isSubmitting ? "Sending your data..." : "Send Your Order"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Container>
        </motion.div>
    );
};

export default ConfirmPage;
