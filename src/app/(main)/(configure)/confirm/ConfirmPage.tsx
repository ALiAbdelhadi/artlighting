"use client";
import Container from "@/app/components/Container";
import CustomInput from "@/app/components/CustomInput";
import DiscountPrice from "@/app/helpers/DiscountPrice";
import NormalPrice from "@/app/helpers/NormalPrice";
import { authFormConfirmingOrderSchema } from "@/app/utils/utils";
import { useToast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { z } from "zod";
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
        phoneNumber: string;
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
    const { data: order, isLoading: isOrderLoading, error } = useQuery<Order>({
        queryKey: ["orderDetails", orderId],
        queryFn: () => fetchOrderDetails(orderId!),
        enabled: !!orderId,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof authFormConfirmingOrderSchema>>({
        resolver: zodResolver(authFormConfirmingOrderSchema),
        defaultValues: {
            fullName: "",
            phoneNumber: "",
            address: "",
            state: "",
            city: "",
            zipCode: "",
            country: "",
        },
    });

    useEffect(() => {
        const checkUserStatus = async () => {
            if (!orderId) return;
            try {
                const orderDetails = await getUserStatus({ orderId: Number(orderId) });
                form.reset({
                    fullName: orderDetails.shippingAddress?.fullName || "",
                    phoneNumber: orderDetails.shippingAddress?.phoneNumber || "",
                    address: orderDetails.shippingAddress?.address || "",
                    city: orderDetails.shippingAddress?.city || "",
                    state: orderDetails.shippingAddress?.state || "",
                    zipCode: orderDetails.shippingAddress?.zipCode || "",
                    country: orderDetails.shippingAddress?.country || "",
                });
                setQuantity(orderDetails.quantity || 0);
            } catch (error) {
                toast({
                    title: "Error",
                    description: (error as Error).message || "You are not authorized to view this order.",
                    variant: "destructive",
                    className: "rounded-lg"
                });
                router.push("/");
            }
        };
        checkUserStatus();
    }, [orderId, router, toast, form]);

    const onSubmit = async (data: z.infer<typeof authFormConfirmingOrderSchema>) => {
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
                        fullName: data.fullName,
                        address: data.address,
                        city: data.city,
                        state: data.state,
                        zipCode: data.zipCode,
                        country: data.country,
                        phoneNumber: data.phoneNumber,
                    },
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to complete order");
            }
            const responseData = await response.json();
            toast({
                title: "Order Confirmed",
                description: "Your order has been confirmed. Please check shipping details and product details.",
                className: "rounded-lg"
            });
            router.push(`/complete/?orderId=${responseData.id}`);
        } catch (error) {
            toast({
                title: "Error",
                description: (error as Error).message || "There was an error confirming your order. Please try again.",
                variant: "destructive",
                className: "rounded-lg"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isOrderLoading) return <div className="flex justify-center items-center h-screen">Loading order details...</div>
    if (error) return <div className="text-center py-8 text-lg text-destructive">Error: {(error as Error).message}</div>
    if (!order) return <div className="text-center py-8 text-lg">No order found</div>

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
                                className="rounded-lg sm:w-[300px] md:w-[400px] lg:w-[500px]"
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
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <CustomInput
                                        control={form.control}
                                        name="fullName"
                                        label="Full Name"
                                        placeholder="John Doe"
                                        type="text"
                                    />
                                    <CustomInput
                                        control={form.control}
                                        name="phoneNumber"
                                        label="Phone Number"
                                        placeholder="0 (010) 123-4567"
                                        type="tel"
                                    />
                                </div>
                                <CustomInput
                                    control={form.control}
                                    name="address"
                                    label="Address"
                                    placeholder="123 Main St, Apt 4B"
                                    type="text"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <CustomInput
                                        control={form.control}
                                        name="state"
                                        label="State / Province"
                                        placeholder="Heliopolis"
                                        type="text"
                                    />
                                    <CustomInput
                                        control={form.control}
                                        name="city"
                                        label="City / Government"
                                        placeholder="Cairo"
                                        type="text"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <CustomInput
                                        control={form.control}
                                        name="zipCode"
                                        label="Zip/Postal Code (optional)"
                                        placeholder="10001"
                                        type="text"
                                    />
                                    <CustomInput
                                        control={form.control}
                                        name="country"
                                        label="Country"
                                        placeholder="Egypt"
                                        type="text"
                                    />
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
                        </Form>
                    </div>
                </div>
            </Container>
        </motion.div>
    );
};

export default ConfirmPage;