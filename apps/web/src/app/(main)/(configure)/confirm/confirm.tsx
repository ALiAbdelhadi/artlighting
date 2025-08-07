"use client";

import { Container } from "@repo/ui";
import CustomInput from "@/components/custom-input";
import DiscountPrice from "@/components/discount-price";
import LoadingState from "@/components/loading-state";
import NormalPrice from "@/components/normal-price";
import ProductImages from "@/components/product-images";
import { authFormConfirmingOrderSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@repo/ui/button";
import { Form } from "@repo/ui/form";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Home, Loader2, RefreshCw } from 'lucide-react';
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getUserStatus } from "./action";

type Order = {
  id: number
  userId: string
  configurationId: string
  quantity: number
  totalPrice: number
  configPrice: number
  productPrice: number
  discountRate: number
  discountedPrice: number
  productName: string
  productImages: string[]
  product: {
    id: string
    productName: string
    productImages: string[]
    price: number
    discount: number
  }
  shippingAddress: {
    fullName: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    phoneNumber: string
  }
};

const fetchOrderDetails = async (orderId: string): Promise<Order> => {
  const response = await fetch(`/api/orders/${orderId}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch order details");
  }
  return response.json();
};

const OrderSummary = ({ order }: { order: Order }) => {
  const subtotal = order.configPrice * order.quantity;
  const discountAmount = subtotal * order.discountRate;
  const shippingCost = 69;
  const total = subtotal - discountAmount + shippingCost;

  return (
    <div className="bg-muted/50 backdrop-blur-sm rounded-2xl p-6 sticky top-6 border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-6">Order Summary</h3>
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center text-muted-foreground">
          <span>Subtotal ({order.quantity} {order.quantity === 1 ? 'item' : 'items'})</span>
          <s className="text-gray-400">
            <NormalPrice price={subtotal} />
          </s>
        </div>
        {order.discountRate > 0 && (
          <div className="flex justify-between items-center text-green-600">
            <span>Discount ({Math.round(order.discountRate * 100)}%)</span>
            <span>-<NormalPrice price={discountAmount} /></span>
          </div>
        )}
        <div className="flex justify-between items-center text-muted-foreground">
          <span>Shipping</span>
          <NormalPrice price={shippingCost} />
        </div>
        <div className="border-t border-border pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-foreground">Total</span>
            <span className="text-xl font-semibold text-destructive">
              <NormalPrice price={total} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ErrorState = ({ error, onRetry }: { error: Error; onRetry: () => void }) => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="max-w-md w-full text-center">
      <div className="w-16 h-16 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-3">Unable to load order</h2>
      <p className="text-gray-600 mb-8">
        {error.message || "Something went wrong while loading your order details."}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={onRetry} variant="outline" className="flex items-center gap-2 rounded-full px-6">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
        <Button onClick={() => window.location.href = "/"} className="flex items-center gap-2 rounded-full px-6 bg-black hover:bg-gray-800">
          <Home className="w-4 h-4" />
          Go Home
        </Button>
      </div>
    </div>
  </div>
);

const NotFoundState = ({ onGoHome }: { onGoHome: () => void }) => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <div className="max-w-md w-full text-center">
      <div className="w-16 h-16 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-3">Order not found</h2>
      <p className="text-gray-600 mb-8">
        We couldn&apos;t find the order you&apos;re looking for.
      </p>
      <Button onClick={onGoHome} className="flex items-center gap-2 rounded-full px-6 bg-black hover:bg-gray-800">
        <Home className="w-4 h-4" />
        Return Home
      </Button>
    </div>
  </div>
);

const Confirm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const {
    data: order,
    isLoading: isOrderLoading,
    error,
    isError,
    refetch
  } = useQuery<Order>({
    queryKey: ["orderDetails", orderId],
    queryFn: () => fetchOrderDetails(orderId!),
    enabled: !!orderId,
    retry: 2,
    staleTime: 5 * 60 * 1000
  });

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

  const orderMetrics = useMemo(() => {
    if (!order) return null;
    return {
      hasDiscount: order.discountRate > 0,
      discountPercentage: Math.round(order.discountRate * 100),
      finalPrice: order.discountRate > 0
        ? order.configPrice * (1 - order.discountRate) * order.quantity
        : order.configPrice * order.quantity
    };
  }, [order]);

  useEffect(() => {
    const initializeUserData = async () => {
      if (!orderId || !order) return;

      try {
        const userOrderDetails = await getUserStatus({ orderId: Number(orderId) });
        if (userOrderDetails?.shippingAddress) {
          form.reset({
            fullName: userOrderDetails.shippingAddress.fullName || "",
            phoneNumber: userOrderDetails.shippingAddress.phoneNumber || "",
            address: userOrderDetails.shippingAddress.address || "",
            city: userOrderDetails.shippingAddress.city || "",
            state: userOrderDetails.shippingAddress.state || "",
            zipCode: userOrderDetails.shippingAddress.zipCode || "",
            country: userOrderDetails.shippingAddress.country || "",
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : "Authorization failed for this order.";
        toast.error("Authentication Error", {
          description: errorMessage,
        });
        router.push("/");
      }
    };

    initializeUserData();
  }, [orderId, order, router, form]);

  const onSubmit = async (data: z.infer<typeof authFormConfirmingOrderSchema>) => {
    if (!order) {
      toast.error("Data Error", {
        description: "Order information is not available. Please refresh the page.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        userId: order.userId,
        productId: order.product.id,
        productName: order.product.productName,
        productImages: order.product.productImages || [],
        quantity: order.quantity,
        configPrice: order.configPrice,
        productPrice: order.product.price,
        totalPrice: order.totalPrice,
        shippingMethod: "standard",
        shippingPrice: 69,
        configurationId: order.configurationId,
        shippingAddress: {
          fullName: data.fullName,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
          phoneNumber: data.phoneNumber,
        },
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const responseData = await response.json();
      toast.success("Your order has been processed. Redirecting to completion page...");

      if (responseData?.id) {
        router.push(`/complete/?orderId=${responseData.id}`);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      const errorMessage = error instanceof Error
        ? error.message
        : "An unexpected error occurred during order processing.";

      toast.error("Order Processing Failed", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isOrderLoading) {
    return <LoadingState />;
  }

  if (isError && error) {
    return <ErrorState error={error as Error} onRetry={() => refetch()} />;
  }

  if (!order) {
    return <NotFoundState onGoHome={() => router.push("/")} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="py-8 md:py-12"
    >
      <Container>
        <div className="space-y-4 mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-3">
            Confirm your order
          </h1>
          <p className="text-lg text-muted-foreground">
            Review your details and finalize your purchase
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mx-auto">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-muted/50 rounded-2xl border border-border overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3">
                    <div className="aspect-square rounded-xl overflow-hidden">
                      <ProductImages productImages={order.product.productImages || []} />
                    </div>
                  </div>
                  <div className="md:w-2/3 space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground mb-2">
                        {order.product.productName}
                      </h2>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 px-4 bg-muted/60 rounded-xl">
                        <span className="text-foreground text-[17px]">Price per item</span>
                        {orderMetrics?.hasDiscount ? (
                          <div className="text-right">
                            <div className="line-through text-gray-400 text-sm">
                              <NormalPrice price={order.configPrice} />
                            </div>
                            <div className="text-green-600 font-semibold">
                              <DiscountPrice
                                price={order.configPrice}
                                discount={order.discountRate}
                                quantity={1}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="font-semibold">
                            <NormalPrice price={order.configPrice} />
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center py-3 px-4 bg-muted/60  rounded-xl">
                        <span className="text-foreground text-[17px]">Quantity</span>
                        <Badge variant="secondary" className="rounded-full">
                          {order.quantity}
                        </Badge>
                      </div>
                      {orderMetrics?.hasDiscount && (
                        <div className="flex justify-between items-center py-3 px-4 bg-green-50 rounded-xl">
                          <span className="text-green-700 font-medium">You save</span>
                          <span className="text-green-700 font-semibold">
                            {orderMetrics.discountPercentage}% off
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-muted/50 rounded-2xl border border-border p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                Shipping information
              </h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput
                      control={form.control}
                      name="fullName"
                      label="Full Name"
                      placeholder="Enter your full name"
                      type="text"
                      required
                    />
                    <CustomInput
                      control={form.control}
                      name="phoneNumber"
                      label="Phone Number"
                      placeholder="Enter your phone number"
                      type="tel"
                      required
                    />
                  </div>
                  <CustomInput
                    control={form.control}
                    name="address"
                    label="Address"
                    placeholder="Enter your street address"
                    type="text"
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput
                      control={form.control}
                      name="city"
                      label="City"
                      placeholder="Enter your city"
                      type="text"
                      required
                    />
                    <CustomInput
                      control={form.control}
                      name="state"
                      label="State / Province"
                      placeholder="Enter your state"
                      type="text"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput
                      control={form.control}
                      name="zipCode"
                      label="Postal Code"
                      placeholder="Enter postal code (optional)"
                      type="text"
                    />
                    <CustomInput
                      control={form.control}
                      name="country"
                      label="Country"
                      placeholder="Enter your country"
                      type="text"
                      required
                    />
                  </div>
                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      variant={"default"}
                      className="w-full h-14 text-lg font-semibold rounded-full transition-colors duration-200"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing order...
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5" />
                          Complete order
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
          <div className="lg:col-span-2">
            <OrderSummary order={order} />
          </div>
        </div>
      </Container>
    </motion.div>
  );
};

export default Confirm;