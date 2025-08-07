"use client";
import { Container } from "@repo/ui";
import DiscountPrice from "@/components/discount-price";
import NormalPrice from "@/components/normal-price";
import { PRODUCT_LAMP_LABEL } from "@/config";
import { calculateEstimatedDeliveryDate, isProductChandLamp } from "@/lib/utils";
import {
  Configuration,
  Product,
  ShippingAddress
} from "@repo/database";
import { Button } from "@repo/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  CheckCircle,
  DiscIcon,
  LightbulbIcon,
  Package,
  Truck,
  VariableIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

interface Order {
  id: string;
  totalPrice: number;
  status: string;
  isCompleted: boolean;
  configPrice: number;
  product: Product;
  quantity: number;
  productPrice: number;
  shippingAddress: ShippingAddress;
  shippingPrice: number;
  productColorTemp: string;
  productIp: string;
  Brand: string;
  productChandLamp: string;
  configuration: Configuration;
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
  orderId: string,
): Promise<UpdateOrderStatusResponse> => {
  try {
    const response = await fetch("/api/webhooks/completeOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to complete the order");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

type CompleteProps = {
  discount: number;
  Brand: string;
};

const Complete = ({ discount, Brand }: CompleteProps) => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
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
  const estimatedDeliveryDate = calculateEstimatedDeliveryDate();
  const { mutate: handleComplete, isPending } = useMutation({
    mutationKey: ["confirmOrder", orderId],
    mutationFn: async () => {
      return updateOrderStatus(orderId!);
    },
    onSuccess: (response) => {
      console.log("API Response:", response);
      if (response.success && response.order && response.order.isCompleted) {
        console.log(
          "Order completed successfully. Redirecting to thank you page",
        );
        localStorage.setItem("lastCompletedOrderId", orderId!);
        router.push(`/thank-you?orderId=${response.order.id}`);
      } else {
        console.error(
          "Order not marked as completed or unexpected response structure",
        );
        toast.error("Order completion issue", {
          description:
            "There was an issue completing your order. Please try again or contact support.",
        });
      }
    },
    onError: (error) => {
      console.error("Error completing order:", error);
      toast.error("There was an error completing your order. Please try again.", {
        description: "There was an error completing your order. Please try again.",
        className: "rounded-lg",
      });
    },
  });
  useEffect(() => {
    const checkOrderStatus = async () => {
      if (orderId) {
        try {
          const response = await fetch(`/api/orders/${orderId}`);
          const orderData = await response.json();
          if (orderData.isCompleted) {
            // If the order is already completed, redirect to the product page
            router.push(
              `/category/${orderData.product.Brand}/${orderData.product.sectionType}/${orderData.product.spotlightType}/${orderData.product.productId}`,
            );
          }
        } catch (error) {
          console.error("Error checking order status:", error);
        }
      }
    };

    checkOrderStatus();
  }, [orderId, router]);
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading order details...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        Error loading order details
      </div>
    );
  if (!order)
    return (
      <div className="flex justify-center items-center h-screen">
        No order found
      </div>
    );
  const isCairo =
    order.shippingAddress.state
      .toLowerCase()
      .replace(/\s/g, "")
      .match(/cairo|القاهرة/) !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8"
    >
      <Container>
        {/* {order && <CurrentOrderHeader order={order} />} */}
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="grid gap-8">
              <div className="space-y-4">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary">
                  Complete your order
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Thank you for your order! We&apos;re processing your purchase and
                  will send you a completion message once you complete the
                  order.
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Package className="mr-2 text-primary" /> Order processing
                  </span>
                  <span className="flex items-center">
                    <Truck className="mr-2 text-primary" /> Ready for shipping
                  </span>
                  <span className="flex items-center">
                    <CheckCircle className="mr-2 text-primary" /> Order complete
                  </span>
                </div>
              </div>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl ">
                    Ordered Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto custom-scrollbar">
                    <div className="min-w-[600px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="font-semibold">
                              Product
                            </TableHead>
                            <TableHead className="font-semibold pl-32 ">
                              Qty
                            </TableHead>
                            <TableHead className="font-semibold text-nowrap">
                              Color Temp
                            </TableHead>
                            {Brand === "balcom" && (
                              <TableHead className="font-semibold text-nowrap">
                                Wattage
                              </TableHead>
                            )}
                            {Brand === "mister-led" &&
                              order.product.ChandelierLightingType ===
                              "lamp" && (
                                <TableHead className="font-semibold text-nowrap">
                                  Lamp
                                </TableHead>
                              )}
                            {
                              Brand === "mister-led" &&
                              order.product.ChandelierLightingType ===
                              "LED" && (
                                <TableHead className="font-semibold text-nowrap">
                                  Wattage
                                </TableHead>
                              )
                            }
                            {Brand === "balcom" && (
                              <TableHead className="font-semibold text-nowrap">
                                IP Rating
                              </TableHead>
                            )}
                            {discount > 0 && (
                              <TableHead className="font-semibold">
                                Discount
                              </TableHead>
                            )}
                            <TableHead className="font-semibold">
                              Price
                            </TableHead>
                            <TableHead className="font-semibold">
                              Total
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>
                              <div className="flex items-center gap-4">
                                <Image
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
                            <TableCell className="font-semibold capitalize">
                              {order.productColorTemp}
                            </TableCell>
                            {Brand === "balcom" && (
                              <TableHead className="font-semibold text-black">
                                {order.product.maximumWattage + "W"}
                              </TableHead>
                            )}
                            {Brand === "balcom" && (
                              <TableCell className="font-semibold">
                                {order.configuration.productIp}
                              </TableCell>
                            )}
                            {Brand === "mister-led" &&
                              order.product.ChandelierLightingType ===
                              "lamp" && (
                                <TableCell className="font-semibold capitalize ">
                                  {isProductChandLamp(order.productChandLamp)
                                    ? PRODUCT_LAMP_LABEL[order.productChandLamp]
                                    : "Unknown Lamp"}
                                </TableCell>
                              )
                            }
                            {
                              Brand === "mister-led" &&
                              order.product.ChandelierLightingType ===
                              "LED" && (
                                <TableCell className="font-semibold">
                                  {order.product.maximumWattage + "W"}
                                </TableCell>
                              )
                            }
                            {discount > 0 ? (
                              <TableCell className="text-destructive font-semibold">
                                {order.product.discount * 100}%
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
                  </div>
                </CardContent>
              </Card>
              {/* <div className="flex items-center justify-end py-5">
                                <Button
                                    onClick={handleAddMoreProducts}
                                >
                                    Add More Products
                                </Button>
                            </div> */}
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">
                    Shipping Information :{" "}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto custom-scrollbar">
                    <div className="min-w-[600px]">
                      <div className="grid gap-x-4 gap-y-1.5">
                        <div className="gap-2 grid grid-cols-1 md:grid-cols-2">
                          <address className="not-italic text-muted-foreground tracking-wide md:text-base sm:text-sm text-xs leading-5">
                            <h3 className="font-semibold text-foreground">Shipping Address :</h3>
                            <p className="md:text-base text-sm">
                              {order.shippingAddress.fullName}
                            </p>
                            <p>{order.shippingAddress.address}</p>
                            <p>
                              {order.shippingAddress.city},{" "}
                              {order.shippingAddress.zipCode},{" "}
                              {order.shippingAddress.state}
                            </p>
                          </address>
                          <div>
                            <h3 className="font-semibold flex items-center gap-2">
                              Estimated Delivery Date:
                              <span className="inline-block font-normal not-italic text-muted-foreground tracking-wide md:text-base sm:text-sm text-xs leading-5 ">
                                {estimatedDeliveryDate}
                              </span>
                            </h3>
                          </div>
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
                          <h3 className="font-semibold">Name</h3>
                          <p className="not-italic text-muted-foreground tracking-wide md:text-base sm:text-sm text-xs leading-5 ">
                            {order.shippingAddress.fullName}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold">Phone Number</h3>
                          <p className="text-muted-foreground tracking-wide sm:text-base text-sm leading-5 -my-1">
                            <span>{order.shippingAddress.phoneNumber}</span>
                          </p>
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold">Billing Address</h3>
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
                <CardTitle className="text-lg sm:text-xl">
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto custom-scrollbar">
                  <div className="p-6 pt-0 min-w-[300px]">
                    <div className="grid gap-4">
                      <div>
                        <h3 className="font-medium text-base sm:text-lg">
                          Delivery Details
                        </h3>
                        <p className="text-muted-foreground tracking-wide sm:text-base text-sm leading-5 -my-1">
                          {isCairo
                            ? "Your order will be delivered to Cairo"
                            : "Shipping to locations outside Cairo"}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium text-base sm:text-lg">
                          Shipping Address
                        </h3>
                        <p className="text-muted-foreground tracking-wide sm:text-base text-sm leading-5 -my-1">
                          {order.shippingAddress.fullName}
                        </p>
                        <p className="tracking-wide leading-6">
                          {order.shippingAddress.address},{" "}
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}{" "}
                          {order.shippingAddress.zipCode},{" "}
                          {order.shippingAddress.country}
                        </p>
                        <p className="tracking-wide leading-6">
                          Phone: {order.shippingAddress.phoneNumber}
                        </p>
                      </div>
                      <div>
                        <h3 className="font-medium text-base sm:text-lg">
                          Shipping Cost
                        </h3>
                        <p className="text-muted-foreground tracking-wide sm:text-base text-sm leading-5 -my-1">
                          {isCairo
                            ? "Fixed rate for Cairo"
                            : "To be determined"}
                        </p>
                        <div className="tracking-wide leading-6 font-semibold text-primary">
                          {isCairo ? (
                            <NormalPrice price={order.shippingPrice} />
                          ) : (
                            "We will contact you with the shipping price."
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium text-base sm:text-lg">
                          Estimated Delivery Time
                        </h3>
                        <p className="text-muted-foreground tracking-wide sm:text-base text-sm leading-5 -my-1">
                          {isCairo ? "3-5 business days" : "To be determined"}
                        </p>
                        <p className="tracking-wide leading-6">
                          {isCairo
                            ? "We strive to deliver your order as quickly as possible."
                            : "Delivery time will be provided when we contact you with the shipping price."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Why Choose Our Products?
                </CardTitle>
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
            disabled={isPending}
            className="inline-flex sm:h-[52px] h-[40px] items-center justify-center rounded-md bg-primary sm:px-10 px-8 sm:text-lg text-base font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
          >
            Complete Your Order
          </Button>
        </div>
      </Container>
    </motion.div>
  );
};

export default Complete;
