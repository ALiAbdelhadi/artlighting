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
import { PRODUCT_TEMP_LABEL_MAP } from "@/config/config";
import { Link, useRouter } from "@/i18n/navigation";
import { calculateEstimatedDeliveryDate, formatNumber, isProductChandLamp } from "@/lib/utils";
import type { Configuration, Order, Product, ProductSpecification, ShippingAddress } from "@/types/products"
import { Container } from "@repo/ui";
import { Separator } from "@repo/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";

// Define the type for the order object with its relations
type OrderWithRelations = Order & {
  product: Product & {
    specifications: ProductSpecification[]
  }
  shippingAddress: ShippingAddress | null
  configuration: Configuration | null
  discount: number | null
}

interface UpdateOrderStatusResponse {
  success: boolean
  order: Order
}

// Helper function to extract wattage from a product name string
const getProductWattage = (productName: string): number => {
  if (!productName) return 0;
  const match = productName.match(/(\d+)(?:W)/);
  return match ? parseInt(match[1], 10) : 0;
};

export default function ThankYou({
  discount,
  initialOrder
}: {
  discount: number,
  initialOrder: OrderWithRelations
}) {
  // Animation variants for Framer Motion
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

  // Hooks for translations, routing, and locale
  const t = useTranslations('thankYou');
  const tLamp = useTranslations('ProductChandLampButtons');
  const router = useRouter();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const estimatedDeliveryDate = calculateEstimatedDeliveryDate(isRTL ? "ar" : "en");
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const [isValidatingOrder, setIsValidatingOrder] = useState(true);

  // Fetch order data using React Query, with initial data provided
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["get-order-completed-status", orderId],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Accept-Language': locale,
        }
      });

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
    enabled: !!orderId && !initialOrder, // Only fetch if orderId exists and no initialOrder is provided
    retry: 1,
    initialData: initialOrder,
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  // Debugging useEffect to log order data
  useEffect(() => {
    console.log("=== DEBUG THANK YOU PAGE ===");
    console.log("Initial Order:", initialOrder);
    console.log("Order from useQuery:", order);
    console.log("Locale:", locale);
    console.log("=== END DEBUG ===");
  }, [initialOrder, order, locale]);

  // useEffect for validating the order and managing localStorage
  useEffect(() => {
    const validateOrder = () => {
      if (!orderId) {
        console.log("No orderId provided, redirecting to home");
        router.push("/");
        return;
      }

      if (isLoading) {
        return; // Wait for data to load before validating
      }

      if (!order || !order.isCompleted) {
        console.log("Order not found or not completed, redirecting to home");
        router.push("/");
        return;
      }

      // Logic to prevent re-showing the thank you page for an old order
      const lastCompletedOrderId = localStorage.getItem("lastCompletedOrderId");
      if (lastCompletedOrderId !== orderId) {
        console.log("New completed order detected, updating localStorage");
        localStorage.setItem("lastCompletedOrderId", orderId);
      }

      setIsValidatingOrder(false);
    };

    const timeoutId = setTimeout(validateOrder, 100);
    return () => clearTimeout(timeoutId);
  }, [orderId, router, order, isLoading]);

  // Loading state while validating
  if (isValidatingOrder || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">{t('loadingOrderDetails')}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        <div className="text-center">
          <p className="text-red-600 mb-4">{t('errorLoadingOrderDetails')}</p>
          <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
        </div>
      </div>
    );
  }

  // No order found state
  if (!order) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        <div className="text-center">
          <p className="text-muted-foreground">{t('noOrderFound')}</p>
          <p className="text-sm text-muted-foreground mt-2">{t('checkOrderId')}</p>
        </div>
      </div>
    );
  }

  // Order not completed state
  if (order.isCompleted !== true) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg mb-4">{t('orderNotCompleted')}</p>
          <p className="text-muted-foreground">{t('completeOrderFirst')}</p>
        </div>
      </div>
    );
  }

  // Check if the shipping address is in Cairo
  const isCairo = order.shippingAddress?.state
    ?.toLowerCase()
    ?.replace(/\s/g, "")
    ?.match(/cairo|القاهرة/) !== null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      dir={isRTL ? "rtl" : "ltr"}
      className={isRTL ? "rtl" : "ltr"}
    >
      <Breadcrumb />
      <div className="p-0">
        <Container>
          <div className="pt-6 pb-12 px-0">
            <div className="max-w-2xl">
              <p className="text-base font-medium text-primary">{t('pageTitle')}</p>
              <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight lg:text-5xl">
                {t('productOnTheWay')}
              </h1>
              <p className="mb-6 text-lg text-muted-foreground">
                {t('orderReceived')}
              </p>
            </div>

            <div className="mt-10 md:-mb-10 border-t border-zinc-200">
              <div className="mt-10 flex flex-auto flex-col">
                <h4 className="text-xl font-semibold">
                  {t('greatChoice')}
                </h4>
                <p className="mt-2 text-lg text-muted-foreground">
                  {t('qualityDescription')}
                </p>
              </div>
            </div>

            <section className="w-full py-12 md:py-24 lg:py-32">
              <div className="grid gap-2">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('orderSummary')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 items-center">
                        <div className="font-medium">{t('orderNumber')}</div>
                        <div className={isRTL ? "text-left" : "text-right"}>#{order.id}</div>
                      </div>
                      <div className="grid grid-cols-2 items-center">
                        <div className="font-medium">{t('shippingAddress')}</div>
                        <div className={isRTL ? "text-left" : "text-right"}>
                          {order.shippingAddress?.fullName}
                          <br />
                          {order.shippingAddress?.phoneNumber} <br />
                          {order.shippingAddress?.address} <br />
                          {order.shippingAddress?.city},{" "}
                          {order.shippingAddress?.state}{" "}
                          {order.shippingAddress?.zipCode}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 items-center">
                        <div className="font-medium">{t('estimatedDeliveryDate')}</div>
                        <div className={isRTL ? "text-left" : "text-right"}>{estimatedDeliveryDate}</div>
                      </div>
                      <div className="grid grid-cols-2 items-center">
                        <div className="font-medium">{t('shippingFee')}</div>
                        <div className={isRTL ? "text-left" : "text-right"}>
                          <NormalPrice price={order.shippingPrice} />
                        </div>
                      </div>
                      <Separator />
                      <div className="overflow-x-auto rounded-md custom-scrollbar">
                        <Table className="min-w-full">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="font-semibold !rtl:text-right">
                                {t("item")}
                              </TableHead>
                              <TableHead className="font-semibold pl-32" >
                                {t("qty")}
                              </TableHead>
                              <TableHead className="font-semibold text-nowrap" dir={isRTL ? "rtl" : "ltr"}>
                                {t("colorTemp")}
                              </TableHead>
                              {order.brand === "balcom" && (
                                <TableHead className="font-semibold text-nowrap" dir={isRTL ? "rtl" : "ltr"}>
                                  {t("wattage")}
                                </TableHead>
                              )}
                              {order.brand === "mister-led" && order.chandelierLightingType === "lamp" && (
                                <TableHead className="font-semibold text-nowrap" dir={isRTL ? "rtl" : "ltr"}>
                                  {t("lamp")}
                                </TableHead>
                              )}
                              {order.brand === "mister-led" && order.chandelierLightingType === "LED" && (
                                <TableHead className="font-semibold text-nowrap" dir={isRTL ? "rtl" : "ltr"}>
                                  {t("wattage")}
                                </TableHead>
                              )}
                              {order.brand === "balcom" && (
                                <TableHead className="font-semibold text-nowrap" dir={isRTL ? "rtl" : "ltr"}>
                                  {t("ipRating")}
                                </TableHead>
                              )}
                              {discount > 0 && (
                                <TableHead className="font-semibold" dir={isRTL ? "rtl" : "ltr"}>
                                  {t("discount")}
                                </TableHead>
                              )}
                              <TableHead className="font-semibold" dir={isRTL ? "rtl" : "ltr"}>
                                {t("price")}
                              </TableHead>
                              <TableHead className="font-semibold" dir={isRTL ? "rtl" : "ltr"}>
                                {t("total")}
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>
                                <div className="flex items-center gap-4">
                                  <Image
                                    src={order.productImages[0] || "/placeholder.jpg"}
                                    alt="Product Image"
                                    width={70}
                                    height={70}
                                    className="rounded-md object-cover"
                                  />
                                  <div className="text-left rtl:text-right">
                                    <h4 className="text-nowrap font-semibold text-card-foreground">
                                      {order.productName}
                                    </h4>
                                    <p className="text-muted-foreground font-medium text-xs md:text-sm break-words text-wrap">
                                      {t("modernDesign")}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="font-semibold pl-32 pr-10">
                                {formatNumber(order.quantity, isRTL ? "ar" : "en")}
                              </TableCell>
                              <TableCell className="font-semibold capitalize">
                                {PRODUCT_TEMP_LABEL_MAP[locale]?.[order.productColorTemp] || order.productColorTemp}
                              </TableCell>
                              {order.brand === "balcom" && (
                                <TableCell className="font-semibold text-black">
                                  {order.product.specifications?.[0]?.maximumWattage || "N/A"}W
                                </TableCell>
                              )}
                              {order.brand === "balcom" && (
                                <TableCell className="font-semibold">
                                  {order.productIp}
                                </TableCell>
                              )}
                              {order.brand === "mister-led" &&
                                order.chandelierLightingType === "lamp" && (
                                  <TableCell className="font-semibold capitalize ">
                                    {isProductChandLamp(order.productChandLamp)
                                      ? tLamp(order.productChandLamp)
                                      : "Unknown Lamp"}
                                  </TableCell>
                                )}
                              {order.brand === "mister-led" &&
                                order.chandelierLightingType === "LED" && (
                                  <TableCell className="font-semibold">
                                    {order.product.specifications?.[0]?.maximumWattage || "N/A"}W
                                  </TableCell>
                                )}
                              {discount > 0 ? (
                                <TableCell className="text-destructive font-semibold">
                                  {discount * 100}%
                                </TableCell>
                              ) : null}
                              {discount > 0 ? (
                                <>
                                  <TableCell className="text-sm pr-4 sm:pr-0">
                                    <DiscountPrice
                                      price={order.configPrice}
                                      discount={discount}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <DiscountPrice
                                      price={order.configPrice}
                                      discount={discount}
                                      quantity={order?.quantity}
                                      shippingPrice={order?.shippingPrice}
                                    />
                                  </TableCell>
                                </>
                              ) : (
                                <>
                                  <TableCell className="font-semibold">
                                    <NormalPrice price={order.configPrice} />
                                  </TableCell>
                                  <TableCell className="font-semibold">
                                    <NormalPrice
                                      price={order.configPrice}
                                      quantity={order?.quantity}
                                      shippingPrice={order?.shippingPrice}
                                    />
                                  </TableCell>
                                </>
                              )}
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
                                {t('subtotal')}
                              </div>
                              <s className={`text-base font-semibold text-gray-500 ${isRTL ? "text-left" : "text-right"}`}>
                                <NormalPrice
                                  price={order.configPrice}
                                  quantity={order.quantity}
                                  sectionType={order.product?.sectionType}
                                />
                              </s>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                              <div className="font-medium text-muted-foreground">
                                {t('shippingFee')}
                              </div>
                              <div className={`text-base font-semibold ${isRTL ? "text-left" : "text-right"}`}>
                                {isCairo ? (
                                  <NormalPrice
                                    price={order.shippingPrice}
                                    sectionType={order.product?.sectionType}
                                  />
                                ) : (
                                  <p className="text-sm">
                                    {t('outsideCairoShipping')}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                              <div className="font-medium text-muted-foreground">
                                {t('discount')}
                              </div>
                              <span className={`text-base font-semibold text-destructive ${isRTL ? "text-left" : "text-right"}`}>
                                {order.product?.discount ? order.product.discount * 100 : discount * 100}%
                              </span>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                              <div className="font-medium text-muted-foreground">
                                {t('afterDiscount')}
                              </div>
                              <span className={isRTL ? "text-left" : "text-right"}>
                                <DiscountPrice
                                  price={order.configPrice}
                                  quantity={order.quantity}
                                  sectionType={order.product?.sectionType}
                                  discount={order.product?.discount || discount}
                                />
                              </span>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 items-center">
                              <div className="font-medium">{t('total')}</div>
                              <div className={`text-lg font-semibold text-destructive ${isRTL ? "text-left" : "text-right"}`}>
                                <DiscountPrice
                                  price={order.configPrice}
                                  shippingPrice={order.shippingPrice}
                                  discount={order.product?.discount || discount}
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
                                {t('subtotal')}
                              </div>
                              <span className={`text-base font-semibold ${isRTL ? "text-left" : "text-right"}`}>
                                <NormalPrice
                                  price={order.configPrice}
                                  quantity={order.quantity}
                                  sectionType={order.product?.sectionType}
                                />
                              </span>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                              <div className="font-medium text-muted-foreground">
                                {t('shippingFee')}
                              </div>
                              <div className={`text-base font-semibold ${isRTL ? "text-left" : "text-right"}`}>
                                <NormalPrice
                                  price={order.shippingPrice}
                                  sectionType={order.product?.sectionType}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 items-center">
                              <div className="font-medium text-muted-foreground">
                                {t('total')}
                              </div>
                              <span className={`text-base font-semibold ${isRTL ? "text-left" : "text-right"}`}>
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

              <div className={`flex mt-10 ${isRTL ? "justify-start" : "justify-end"}`}>
                <Link
                  href="/category"
                  className="inline-flex h-12 items-center justify-center rounded-md text-primary-foreground bg-primary px-10 text-lg font-medium shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  {t('continueShopping')}
                </Link>
              </div>
            </section>
          </div>
        </Container>
      </div>
    </motion.div>
  );
};
