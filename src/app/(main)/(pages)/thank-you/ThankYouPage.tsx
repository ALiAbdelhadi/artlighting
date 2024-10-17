"use client";
import Breadcrumb from '@/app/components/Breadcrumb/Breadcrumb';
import Container from '@/app/components/Container';
import DiscountPrice from '@/app/helpers/DiscountPrice';
import NormalPrice from "@/app/helpers/NormalPrice";
import { formatPrice } from '@/app/utils/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product, ShippingAddress } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { addDays, format } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface Order {
    id: string;
    totalPrice: number;
    status: string;
    isCompleted: boolean;
    discountedPrice: number
    product: Product
    quantity: number;
    productPrice: number;
    shippingAddress: ShippingAddress
    shippingPrice: number;
    discount: number;
    configPrice: number
    OrderTimeReceived: string
}

const calculateEstimatedDeliveryDate = () => {
    const currentDate = new Date()
    const estimatedDeliveryDate = addDays(currentDate, 7)
    return format(estimatedDeliveryDate, "dd MMM, yyyy", { locale: enUS })
}
const ThankYouPage: React.FC<Order> = ({ discount }) => {
    const variants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.3
            }
        }
    };
    const router = useRouter()

    const estimatedDeliveryDate = calculateEstimatedDeliveryDate();
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId') || "";
    const { data: order, isLoading, error } = useQuery({
        queryKey: ['get-order-completed-status', orderId],
        queryFn: async () => {
            const response = await fetch(`/api/orders/${orderId}`);
            if (!response.ok) throw new Error('Failed to fetch order status');
            return response.json();
        },
        enabled: !!orderId,
    });
    useEffect(() => {
        const lastCompletedOrderId = localStorage.getItem("lastCompletedOrderId");

        if (orderId !== lastCompletedOrderId) {
            router.push('/');
        }
    }, [orderId, router]);
    if (isLoading) return <div>Loading order details...</div>;
    if (error) return <div>Error loading order details: {(error as Error).message}</div>;
    if (!order) return <div>No order found. Please check your order ID.</div>;
    if (order.isCompleted !== true) return <div>This order has not been completed. Please complete your order first.</div>;
    const handleSlideChange = (index: number) => {
        setCurrentIndex(index);
    };

    const getProductWattage = (productName: string) => {
        const lastIndex = productName.lastIndexOf("-");
        if (lastIndex !== -1) {
            const match = productName.substring(lastIndex + 1).match(/^\d+/);
            return match ? `${match[0]}W` : "Not Available";
        }
        return "Not Available";
    };
    const isCairo = order.shippingAddress.state.toLowerCase().replace(/\s/g, '').match(/cairo|القاهرة/) !== null;
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
        >
            <Breadcrumb />
            <div className='p-0'>
                <Container>
                    <div className="pt-6 pb-12 px-0">
                        <div className='max-w-2xl'>
                            <p className='text-base font-medium text-primary'>Thank you!</p>
                            <h1 className='mt-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight lg:text-5xl'>
                                Your product is on the way!
                            </h1>
                            <p className='mb-6 text-lg text-muted-foreground'>
                                We've received your order and are now processing it.
                            </p>
                        </div>
                        <div className='mt-10 md:-mb-10 border-t border-zinc-200'>
                            <div className='mt-10 flex flex-auto flex-col'>
                                <h4 className=' text-xl font-semibold'>
                                    You made a great choice!
                                </h4>
                                <p className='mt-2 text-lg text-muted-foreground'>
                                    At Art Lighting, we believe that lighting products should not only be visually appealing but also built to last for years to come. That's why we offer an industry-leading 3-year warranty on all our products.
                                </p>
                            </div>
                        </div>
                        <section className="w-full py-12 md:py-24 lg:py-32">
                            <div className="grid gap-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Order Summary</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-4">
                                            <div className="grid grid-cols-2 items-center">
                                                <div className="font-medium">Order Number:</div>
                                                <div>#{order.id}</div>
                                            </div>
                                            <div className="grid grid-cols-2 items-center">
                                                <div className="font-medium">Shipping Address:</div>
                                                <div>
                                                    {order.shippingAddress.fullName}<br />
                                                    {order.shippingAddress.phoneNumber} <br />
                                                    {order.shippingAddress.address} <br />
                                                    {order.shippingAddress.city}, {order.shippingAddress.city} {order.shippingAddress.zipCode}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 items-center">
                                                <div className="font-medium">Delivery:</div>
                                                <div>
                                                    {estimatedDeliveryDate}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 items-center">
                                                <div className="font-medium">Shipping Fee:</div>
                                                <div>{formatPrice(order.shippingPrice)}</div>
                                            </div>
                                            <Separator />
                                            <div className="overflow-x-auto  rounded-md custom-scrollbar">
                                                <Table className="min-w-full">
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Item</TableHead>
                                                            <TableHead className='pl-20 sm:pl-0'>Qty</TableHead>
                                                            <TableHead className='text-nowrap'>Price Per Item</TableHead>
                                                            {discount > 0 ?
                                                                <TableHead>Discount </TableHead>
                                                                :
                                                                null
                                                            }
                                                            <TableHead>Total</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody className="sm:space-x-4">
                                                        <TableRow>
                                                            <TableCell >
                                                                <div className="flex items-center gap-4">
                                                                    <img
                                                                        src={order.product.productImages[0]}
                                                                        width="70"
                                                                        height="70"
                                                                        alt="Product image"
                                                                        className="aspect-square rounded-[4px] object-cover"
                                                                    />
                                                                    <div>
                                                                        <div className="font-semibold text-sm md:text-base text-nowrap">{order.product.productName}</div>
                                                                        <div className="text-muted-foreground text-xs md:text-sm break-words text-wrap font-medium">{`${order.product.Brand} spotlight with Maximum wattage of ${getProductWattage(order.product.productName)} and ${order.product.luminousFlux}`}</div>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="text-sm md:text-base pl-20 sm:pl-0 font-medium">{order.quantity}</TableCell>
                                                            <TableCell className="text-sm md:text-base font-medium"><NormalPrice price={order.configPrice} /></TableCell>
                                                            {discount > 0 ?
                                                                <TableCell className='text-sm md:text-base text-destructive font-medium'>{order.product?.discount * 100}%</TableCell>
                                                                :
                                                                null
                                                            }
                                                            {discount > 0 ?
                                                                (
                                                                    <TableCell className="text-sm md:text-base font-medium"><DiscountPrice price={order.configPrice} discount={order.product?.discount} /></TableCell>
                                                                )
                                                                :
                                                                (
                                                                    <TableCell className="text-sm md:text-base font-medium"><NormalPrice price={order.configPrice} quantity={order.quantity} /></TableCell>
                                                                )
                                                            }
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </div>
                                            <Separator />
                                            <div className='space-y-2.5'>
                                                {discount > 0 ?
                                                    (
                                                        <>
                                                            <div className="grid grid-cols-2 items-center">
                                                                <div className="font-medium text-muted-foreground">Subtotal:</div>
                                                                <s className="text-right text-base font-semibold text-gray-500"><NormalPrice price={order.configPrice} quantity={order.quantity} /></s>
                                                            </div>
                                                            <div className="grid grid-cols-2 items-center">
                                                                <div className="font-medium  text-muted-foreground">Shipping Fee:</div>
                                                                <div className="text-right text-base font-semibold">
                                                                    {isCairo ? (
                                                                        formatPrice(order.shippingPrice)
                                                                    )
                                                                        :
                                                                        (
                                                                            <p>We will inform you of the shipping cost as your location is outside Cairo, and your order will be completed once the shipping fee is confirmed</p>
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 items-center">
                                                                <div className="font-medium text-muted-foreground">Discount:</div>
                                                                <span className="text-right text-base font-semibold text-destructive">{order.product?.discount * 100}%</span>
                                                            </div>
                                                            <Separator />
                                                            <div className="grid grid-cols-2 items-center">
                                                                <div className="font-medium ">Total:</div>
                                                                <div className="text-right text-base font-semibold text-destructive">
                                                                    <DiscountPrice price={order.configPrice} shippingPrice={order.shippingPrice} discount={order.product?.discount} quantity={order.quantity} />
                                                                </div>
                                                            </div>
                                                        </>
                                                    )
                                                    : (
                                                        <>
                                                            <div className="grid grid-cols-2 items-center">
                                                                <div className="font-medium text-muted-foreground">Subtotal:</div>
                                                                <span className="text-right text-base font-semibold"><NormalPrice price={order.configPrice} quantity={order.quantity} /></span>
                                                            </div>
                                                            <div className="grid grid-cols-2 items-center">
                                                                <div className="font-medium  text-muted-foreground">Shipping Fee:</div>
                                                                <div className="text-right text-base font-semibold">{formatPrice(order.shippingPrice)}</div>
                                                            </div>
                                                            <div className="grid grid-cols-2 items-center">
                                                                <div className="font-medium text-muted-foreground">total:</div>
                                                                <span className="text-right text-base font-semibold"><NormalPrice price={order.configPrice} quantity={order.quantity} shippingPrice={order.shippingPrice} /></span>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="flex justify-end mt-10">
                                <Link
                                    href="/category"
                                    className="inline-flex h-12 items-center justify-center rounded-md text-primary-foreground bg-primary px-10 text-lg font-medium shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                    prefetch={false}
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </section>
                    </div>
                </Container>
            </div>
            <style jsx global>{`
                .custom-scrollbar {
                    scrollbar-width: 10px;
                    scrollbar-color: #e5e7eb #f1f1f1;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `}</style>
        </motion.div>
    );
};

export default ThankYouPage;