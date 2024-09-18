"use client";
import Container from "@/app/components/Container";
import DiscountPrice from "@/app/helpers/DiscountPrice";
import NormalPrice from "@/app/helpers/NormalPrice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Product, ProductChandLamp, ShippingAddress } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CheckCircle, DiscIcon, LightbulbIcon, Package, Truck, VariableIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment } from "react";
import gsap from "gsap";
import { useEffect, useRef } from "react"
interface Order {
    id: string;
    totalPrice: number;
    status: string;
    isCompleted: boolean;
    product: Product;
    quantity: number;
    productPrice: number;
    shippingAddress: ShippingAddress;
    shippingPrice: number;
    productColorTemp: String
    productIp: String
    Brand: string
    productChandLamp: string
}
interface UpdateOrderStatusResponse {
    success: boolean;
    order: Order;
}
const fetchOrderDetails = async (orderId: string): Promise<Order> => {
    const response = await fetch(`/api/orders/${orderId}`);
    if (!response.ok) {
        throw new Error("Failed to fetch order details");
    }
    return response.json();
};
const updateOrderStatus = async (
    orderId: string
): Promise<UpdateOrderStatusResponse> => {
    const response = await fetch("/api/webhooks/completeOrder", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
    });
    if (!response.ok) {
        throw new Error("Failed to complete the order");
    }
    return response.json();
};
type CompletePageProps = {
    discount: number;
    Brand: string,
    ChandelierLightingType: string
};
const CompletePage: React.FC<CompletePageProps> = ({ discount, Brand, }) => {
    const ContentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (ContentRef.current) {
            gsap.fromTo(
                ContentRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 1, delay: 0.3 }
            );
        }
    }, []);
    const searchParams = useSearchParams();
    const orderId = searchParams.get("orderId");
    const { toast } = useToast();
    const router = useRouter();

    const {
        data: order,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["orderDetails", orderId],
        queryFn: () => fetchOrderDetails(orderId!),
        enabled: !!orderId,
    });

    const { mutate: handleComplete, isPending } = useMutation({
        mutationKey: ["confirmOrder", orderId],
        mutationFn: async () => {
            return updateOrderStatus(orderId!);
        },
        onSuccess: (response) => {
            console.log("API Response:", response);
            if (response.success && response.order && response.order.isCompleted) {
                console.log(
                    "Order completed successfully. Redirecting to thank you page"
                );
                router.push(`/thank-you?orderId=${response.order.id}`);
            } else {
                console.error(
                    "Order not marked as completed or unexpected response structure"
                );
                toast({
                    title: "Order completion issue",
                    description:
                        "There was an issue completing your order. Please try again or contact support.",
                    variant: "destructive",
                });
            }
        },
        onError: (error) => {
            console.error("Error completing order:", error);
            toast({
                title: "Something went wrong",
                description:
                    "There was an error completing your order. Please try again.",
                variant: "destructive",
                action: <ToastAction altText="try again">try again</ToastAction>,
            });
        },
    });
    if (isLoading) return <div>Loading order details...</div>;
    if (error) return <div>Error loading order details</div>;
    if (!order) return <div>No order found</div>;
    const PRODUCT_LAMP_LABEL: Record<ProductChandLamp, string> = {
        lamp9w: "Lamp 9w",
        lamp12w: "Lamp 12"
    }
    function isProductChandLamp(value: string): value is ProductChandLamp {
        return value === 'lamp9w' || value === 'lamp12w';
    }
    return (
        <div className=" py-8" ref={ContentRef}>
            <Container>
                <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
                    <div className="lg:col-span-2">
                        <div className="grid gap-8">
                            <div className="py-8 ">
                                <h1 className=" text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-primary">Complete your order</h1>
                                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                                    Thank you for your order! We're processing your purchase and
                                    will send you a completion message once you complete the
                                    order.
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                    <span className="flex items-center"><Package className="mr-2 text-primary" /> Order processing</span>
                                    <span className="flex items-center"><Truck className="mr-2 text-primary" /> Ready for shipping</span>
                                    <span className="flex items-center"><CheckCircle className="mr-2 text-primary" /> Order complete</span>
                                </div>
                            </div>
                            <Card className="overflow-hidden">
                                <CardHeader className="p-4 sm:p-6">
                                    <CardTitle className="text-lg sm:text-xl">
                                        Ordered Products
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-6">
                                    <div className="overflow-x-auto custom-scrollbar">
                                        <div className="min-w-[600px]">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-secondary/10">
                                                        <TableHead className="font-semibold">Product</TableHead>
                                                        <TableHead className="font-semibold pl-32 ">Qty</TableHead>
                                                        {discount > 0 && <TableHead className="font-semibold">Discount</TableHead>}
                                                        {
                                                            Brand === "Balcom" && (
                                                                <TableHead className="font-semibold text-nowrap">Color Temp</TableHead>
                                                            )
                                                        }
                                                        {
                                                            Brand === "MisterLed" && order.product.ChandelierLightingType === "lamp" && (
                                                                <TableHead className="font-semibold text-nowrap">Lamp</TableHead>
                                                            )
                                                        }
                                                        {
                                                            Brand === "Balcom" && (
                                                                <TableHead className="font-semibold text-nowrap">IP Rating</TableHead>
                                                            )
                                                        }
                                                        <TableHead className="font-semibold">Price</TableHead>
                                                        <TableHead className="font-semibold">Total</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <TableRow>
                                                        <TableCell>
                                                            <div className="flex items-center gap-4">
                                                                <img
                                                                    src={order.product.productImages[0]}
                                                                    alt="Product Image"
                                                                    width={70}
                                                                    height={70}
                                                                    className="rounded-md object-cover"
                                                                />
                                                                <div>
                                                                    <h4 className="text-nowrap font-semibold text-card-foreground">
                                                                        {order.product.productName}
                                                                    </h4>
                                                                    <p className="text-muted-foreground font-medium text-xs md:text-sm break-words text-wrap">
                                                                        Modern, minimalist design
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="font-semibold pl-32 pr-10">
                                                            {order.quantity}
                                                        </TableCell>
                                                        {discount > 0 ? (
                                                            <TableCell className="text-destructive font-semibold">
                                                                {order.product.discount * 100}%
                                                            </TableCell>
                                                        ) : null}
                                                        {
                                                            Brand === "Balcom" && (
                                                                <TableCell className="font-semibold capitalize" >{order.productColorTemp}</TableCell>
                                                            )
                                                        }
                                                        {
                                                            Brand === "Balcom" && (
                                                                <TableCell className="font-semibold">{order.productIp}</TableCell>
                                                            )
                                                        }
                                                        {
                                                            Brand === "MisterLed" && order.product.ChandelierLightingType === "lamp" && (
                                                                <TableCell className="font-semibold capitalize">
                                                                    {isProductChandLamp(order.productChandLamp)
                                                                        ? PRODUCT_LAMP_LABEL[order.productChandLamp]
                                                                        : 'Unknown Lamp'}
                                                                </TableCell>
                                                            )
                                                        }
                                                        {discount > 0 ? (
                                                            <Fragment>
                                                                <TableCell className="text-sm pr-4 sm:pr-0">
                                                                    <DiscountPrice
                                                                        price={order.product?.price}
                                                                        discount={discount}
                                                                    />
                                                                </TableCell>
                                                                <TableCell>
                                                                    <DiscountPrice price={order.product?.price} discount={discount} quantity={order?.quantity} />
                                                                </TableCell>
                                                            </Fragment>
                                                        ) : (
                                                            <>
                                                                <TableCell className="font-semibold">
                                                                    <NormalPrice
                                                                        price={order.product?.price}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className="font-semibold">
                                                                    <NormalPrice
                                                                        price={order.product?.price}
                                                                        quantity={order?.quantity}
                                                                    />
                                                                </TableCell>
                                                            </>
                                                        )}
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="overflow-hidden">
                                <CardHeader>
                                    <CardTitle className="md:text-xl sm:text-lg text-base -mb-3 text-card-foreground">Shipping Information : </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto custom-scrollbar">
                                        <div className="p-6 pt-0 min-w-[600px]">
                                            <div className="grid gap-x-4 gap-y-1.5">
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold">
                                                        Shipping Address :
                                                    </h3>
                                                    <address className="not-italic text-muted-foreground tracking-wide md:text-base sm:text-sm text-xs leading-5 ">
                                                        <p>{order.shippingAddress.fullName}</p>
                                                        <p>{order.shippingAddress.address}</p>
                                                        <p>
                                                            {order.shippingAddress.city},{" "}
                                                            {order.shippingAddress.zipCode}
                                                        </p>
                                                    </address>
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold ">
                                                        Estimated Delivery Date
                                                    </h3>
                                                    <p className="not-italic text-muted-foreground tracking-wide md:text-base sm:text-sm text-xs leading-5 ">
                                                        June 23, 2023
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="overflow-hidden">
                                <CardHeader>
                                    <CardTitle>Customer Details</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto custom-scrollbar">
                                        <div className="p-6 pt-0 min-w-[600px]">
                                            <div className="grid gap-x-4 gap-y-1.5">
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold">
                                                        Name
                                                    </h3>
                                                    <p className="not-italic text-muted-foreground tracking-wide md:text-base sm:text-sm text-xs leading-5 ">
                                                        {order.shippingAddress.fullName}
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold">
                                                        Phone Number
                                                    </h3>
                                                    <p className="text-muted-foreground tracking-wide sm:text-base text-sm leading-5 -my-1">
                                                        <span>{order.shippingAddress.phoneNumber}</span>
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold">
                                                        Billing Address
                                                    </h3>
                                                    <address className="not-italic text-muted-foreground tracking-wide sm:text-base text-sm leading-5 -my-1">
                                                        <p>{order.shippingAddress.address}</p>
                                                        <p>
                                                            {order.shippingAddress.city},{" "}
                                                            {order.shippingAddress.zipCode}
                                                        </p>
                                                    </address>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="grid gap-8">
                        <Card className="overflow-hidden">
                            <CardHeader>
                                <CardTitle>Product Information</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto custom-scrollbar">
                                    <div className="p-6 pt-0 min-w-[300px]">
                                        <div className="grid gap-4">
                                            <div>
                                                <h3 className="font-medium text-base sm:text-lg">
                                                    LED Spotlight
                                                </h3>
                                                <p className="text-muted-foreground tracking-wide sm:text-base text-sm leading-5 -my-1">
                                                    Illuminate Your Space with Precision.
                                                </p>
                                                <p className="tracking-wide leading-6">
                                                    Illuminate your world with precision. Our LED
                                                    spotlights deliver powerful, focused beams of light,
                                                    perfect for accentuating architectural details,
                                                    highlighting landscape features, or creating dramatic
                                                    effects. Experience superior energy efficiency and
                                                    long-lasting performance.
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-base sm:text-lg">
                                                    Brilliant Brightness
                                                </h3>
                                                <p className="text-muted-foreground tracking-wide sm:text-base text-sm leading-5 -my-1">
                                                    {order.product.luminousFlux} lumens for optimal
                                                    visibility.
                                                </p>
                                                <p className="tracking-wide leading-6">
                                                    Choose from warm white (3000K), neutral white (4000K),
                                                    or cool white (6500K) to match your ambiance.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="overflow-hidden">
                            <CardHeader>
                                <CardTitle>Why Choose Our Products?</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto custom-scrollbar">
                                    <div className="p-6 pt-0  min-w-[300px]">
                                        <div className="grid gap-4">
                                            <div className="flex items-start gap-4">
                                                <LightbulbIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                                                <div>
                                                    <h3 className="font-medium text-base sm:text-lg">
                                                        Energy-Efficient
                                                    </h3>
                                                    <p className="text-muted-foreground tracking-wide sm:text-base text-sm leading-5 -my-1">
                                                        Our lighting products are designed to be
                                                        energy-efficient, helping you save on your utility
                                                        bills while reducing your carbon footprint.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <VariableIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                                                <div>
                                                    <h3 className="font-medium text-base sm:text-lg">
                                                        Adjustable Brightness
                                                    </h3>
                                                    <p className="text-muted-foreground tracking-wide sm:text-base text-sm leading-5 -my-1">
                                                        Many of our lighting options feature adjustable
                                                        brightness settings, allowing you to create the
                                                        perfect ambiance for any occasion.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <DiscIcon className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
                                                <div>
                                                    <h3 className="font-medium text-base sm:text-lg">
                                                        Durable Construction
                                                    </h3>
                                                    <p className="text-muted-foreground tracking-wide sm:text-base text-sm leading-5 -my-1">
                                                        Our lighting products are built to last, with
                                                        high-quality materials and construction that ensure
                                                        long-lasting performance.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
                <div className="flex justify-end my-10">
                    <Button
                        onClick={() => {
                            handleComplete();
                        }}
                        isLoading={isPending}
                        disabled={isPending}
                        loadingText="Completing your order"
                        className="inline-flex h-[52px] items-center justify-center rounded-md bg-primary px-10 text-lg font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                        Complete Your Order
                    </Button>
                </div>
            </Container>
            <style jsx global>
                {`
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #a0aec0 #edf2f7;
          }
          .custom-scrollbar::-webkit-scrollbar {
            height: 8px;
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #edf2f7;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #4a5568, #2d3748);
            border-radius: 10px;
            border: 2px solid #edf2f7;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #2d3748, #1a202c);
          }
          img {
            max-width: 100%;
            height: auto;
          }
          address {
            word-wrap: break-word;
          }
        `}
            </style>
        </div>
    );
};

export default CompletePage;
