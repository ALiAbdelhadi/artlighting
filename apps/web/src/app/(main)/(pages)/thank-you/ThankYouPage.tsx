"use client";
import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import DiscountPrice from "@/components/discount-price";
import NormalPrice from "@/components/normal-price";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PRODUCT_LAMP_LABEL } from "@/config";
import { calculateEstimatedDeliveryDate, isProductChandLamp } from "@/lib/utils";
import { ProductChandLamp } from "@repo/database";
import { Container } from "@repo/ui";
import { formatPrice } from "@repo/ui/lib";
import { Separator } from "@repo/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";



export default function ThankYouPage({ discount }: { discount: number }) {
  const variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.3,
      },
    },
  };
  const router = useRouter();

  const estimatedDeliveryDate = calculateEstimatedDeliveryDate();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["get-order-completed-status", orderId],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${orderId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.error || "Failed to fetch order status");
        } catch {
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
      }
      
      return response.json();
    },
    enabled: !!orderId,
    retry: 1,
  });
  useEffect(() => {
    const lastCompletedOrderId = localStorage.getItem("lastCompletedOrderId");

    if (orderId !== lastCompletedOrderId) {
      router.push("/");
    }
  }, [orderId, router]);
  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading order details...</div>;
  if (error)
    return <div className="flex items-center justify-center h-screen text-lg">Error loading order details: {(error as Error).message}</div>;
  if (!order) return <div className="flex items-center justify-center h-screen text-lg">No order found. Please check your order ID.</div>;
  if (order.isCompleted !== true)
    return (
      <div className="flex items-center justify-center h-screen">
        This order has not been completed. Please complete your order first.
      </div>
    );

  const getProductWattage = (productName: string) => {
    const lastIndex = productName.lastIndexOf("-");
    if (lastIndex !== -1) {
      const match = productName.substring(lastIndex + 1).match(/^\d+/);
      return match ? `${match[0]}W` : "Not Available";
    }
    return "Not Available";
  };

  const isCairo =
    order.shippingAddress.state
      .toLowerCase()
      .replace(/\s/g, "")
      .match(/cairo|القاهرة/) !== null;
  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      <Breadcrumb />
      <div className="p-0">
        <Container>
          <div className="pt-6 pb-12 px-0">
            <div className="max-w-2xl">
              <p className="text-base font-medium text-primary">Thank you!</p>
              <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight lg:text-5xl">
                Your product is on the way!
              </h1>
              <p className="mb-6 text-lg text-muted-foreground">
                We&apos;ve received your order and are now processing it.
              </p>
            </div>
            <div className="mt-10 md:-mb-10 border-t border-zinc-200">
              <div className="mt-10 flex flex-auto flex-col">
                <h4 className=" text-xl font-semibold">
                  You made a great choice!
                </h4>
                <p className="mt-2 text-lg text-muted-foreground">
                  At Art Lighting, we believe that lighting products should not
                  only be visually appealing but also built to last for years to
                  come. That&lsquo;s why we offer an industry-leading 3-year warranty
                  on all our products.
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
                          {order.shippingAddress.fullName}
                          <br />
                          {order.shippingAddress.phoneNumber} <br />
                          {order.shippingAddress.address} <br />
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.city}{" "}
                          {order.shippingAddress.zipCode}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 items-center">
                        <div className="font-medium">Estimated Delivery Date :</div>
                        <div>{estimatedDeliveryDate}</div>
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
                              <TableHead>
                                Qty
                              </TableHead>
                              <TableHead className="font-semibold text-nowrap">
                                Color Temp
                              </TableHead>
                              {order.product.Brand === "balcom" && (
                                <TableHead className="font-semibold text-nowrap">
                                  Wattage
                                </TableHead>
                              )}
                              {order.product.Brand === "mister-led" &&
                                order.product.ChandelierLightingType ===
                                "lamp" && (
                                  <TableHead className="font-semibold text-nowrap">
                                    Lamp
                                  </TableHead>
                                )}
                              {
                                order.product.Brand === "mister-led" &&
                                order.product.ChandelierLightingType ===
                                "LED" && (
                                  <TableHead className="font-semibold text-nowrap">
                                    Wattage
                                  </TableHead>
                                )
                              }
                              {order.product.Brand === "balcom" && (
                                <TableHead className="font-semibold text-nowrap">
                                  IP Rating
                                </TableHead>
                              )}
                            </TableRow>
                          </TableHeader>
                          <TableBody className="sm:space-x-4">
                            <TableRow>
                              <TableCell>
                                <div className="flex items-center gap-4">
                                  <Image
                                    src={order.product.productImages[0]}
                                    width="70"
                                    height="70"
                                    alt="Product image"
                                    className="aspect-square rounded-[4px] object-cover"
                                  />
                                  <div>
                                    <div className="font-semibold text-sm md:text-base text-nowrap">
                                      {order.product.productName}
                                    </div>
                                    <div className="text-muted-foreground text-xs md:text-sm break-words text-wrap font-medium">
                                      <span className="capitalize">{order.product.Brand}</span>{" "}
                                      {order.product?.Brand === "balcom" ? (
                                        <span>
                                          spotlight with Maximum wattage of {getProductWattage(order.product.productName)}
                                        </span>
                                      ) : (
                                        order.product.ChandelierLightingType === "lamp" ? (
                                          <span >
                                            chandelier with{" "}
                                            {isProductChandLamp(order.productChandLamp)
                                              ? PRODUCT_LAMP_LABEL[order.productChandLamp as ProductChandLamp].toLocaleLowerCase()
                                              : "Unknown Lamp"}{" "}
                                          </span>
                                        ) :
                                          (
                                            <span>
                                              chandelier with{" "}
                                              {order.product.maximumWattage}
                                            </span>
                                          )
                                      )
                                      }
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm md:text-base font-semibold">
                                {order.quantity}
                              </TableCell>
                              <TableCell className="font-semibold capitalize">
                                {order.productColorTemp}
                              </TableCell>
                              {order.product.Brand === "balcom" && (
                                <TableHead className="font-semibold text-black">
                                  {order.product.maximumWattage + "W"}
                                </TableHead>
                              )}
                              {order.product.Brand === "balcom" && (
                                <TableCell className="font-semibold">
                                  {order.productIp}
                                </TableCell>
                              )}
                              {order.product.Brand === "mister-led" &&
                                order.product.ChandelierLightingType ===
                                "lamp" && (
                                  <TableCell className="font-semibold capitalize ">
                                    {isProductChandLamp(order.productChandLamp)
                                      ? PRODUCT_LAMP_LABEL[order.productChandLamp as ProductChandLamp]
                                      : "Unknown Lamp"}
                                  </TableCell>
                                )
                              }
                              {
                                order.product.Brand === "mister-led" &&
                                order.product.ChandelierLightingType ===
                                "LED" && (
                                  <TableCell className="font-semibold">
                                    {order.product.maximumWattage + "W"}
                                  </TableCell>
                                )
                              }
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                      <Separator />
                      <div className="space-y-2.5">
                        {discount > 0 ? (
                          <>
                            <div className="grid grid-cols-2 items-center">
                              <div className="font-medium text-muted-foreground">
                                Subtotal:
                              </div>
                              <s className="text-right text-base font-semibold text-gray-500">
                                <NormalPrice
                                  price={order.configPrice}
                                  quantity={order.quantity}
                                  sectionType={order.product?.sectionType}
                                />
                              </s>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                              <div className="font-medium  text-muted-foreground">
                                Shipping Fee:
                              </div>
                              <div className="text-right text-base font-semibold">
                                {isCairo ? (
                                  formatPrice(order.shippingPrice)
                                ) : (
                                  <p>
                                    We will inform you of the shipping cost as
                                    your location is outside Cairo, and your
                                    order will be completed once the shipping
                                    fee is confirmed
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                              <div className="font-medium text-muted-foreground">
                                Discount:
                              </div>
                              <span className="text-right text-base font-semibold text-destructive">
                                {order.product?.discount * 100}%
                              </span>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                              <div className="font-medium text-muted-foreground">
                                After Discount:
                              </div>
                              <span className="text-right ">
                                <DiscountPrice
                                  price={order.configPrice}
                                  quantity={order.quantity}
                                  sectionType={order.product?.sectionType}
                                  discount={order.product?.discount}
                                />
                              </span>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 items-center">
                              <div className="font-medium ">Total:</div>
                              <div className="text-right text-lg font-semibold text-destructive">
                                <DiscountPrice
                                  price={order.configPrice}
                                  shippingPrice={order.shippingPrice}
                                  discount={order.product?.discount}
                                  quantity={order.quantity}
                                  sectionType={order.product?.sectionType}
                                />
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="grid grid-cols-2 items-center">
                              <div className="font-medium text-muted-foreground">
                                Subtotal:
                              </div>
                              <span className="text-right text-base font-semibold">
                                <NormalPrice
                                  price={order.configPrice}
                                  quantity={order.quantity}
                                  sectionType={order.product?.sectionType}
                                />
                              </span>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                              <div className="font-medium  text-muted-foreground">
                                Shipping Fee:
                              </div>
                              <div className="text-right text-base font-semibold">
                                {formatPrice(order.shippingPrice)}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                              <div className="font-medium text-muted-foreground">
                                total:
                              </div>
                              <span className="text-right text-base font-semibold">
                                <NormalPrice
                                  price={order.configPrice}
                                  quantity={order.quantity}
                                  shippingPrice={order.shippingPrice}
                                  sectionType={order.product?.sectionType}
                                />
                              </span>
                            </div>
                          </>
                        )}
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
    </motion.div>
  );
};
