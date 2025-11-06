"use client"

import CustomInput from "@/components/custom-input"
import DiscountPrice from "@/components/discount-price"
import LoadingState from "@/components/loading-state"
import NormalPrice from "@/components/normal-price"
import ProductImages from "@/components/product-images"
import { Badge } from "@/components/ui/badge"
import { Form } from "@/components/ui/form"
import { useRouter } from "@/i18n/navigation"
import { authFormConfirmingOrderSchema } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Container } from "@repo/ui"
import { Button } from "@repo/ui/button"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { AlertCircle, CheckCircle, Home, Loader2, RefreshCw } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { z } from "zod"
import { getUserStatus } from "./action"

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
  // إضافة خصائص Configuration المطلوبة
  configuration?: {
    id: string
    configPrice: number
    totalPrice: number
    quantity: number
    discount: number
  }
}

const fetchOrderDetails = async (orderId: string): Promise<Order> => {
  const response = await fetch(`/api/orders/${orderId}`)
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Failed to fetch order details")
  }
  return response.json()
}

const OrderSummary = ({ order }: { order: Order }) => {
  const t = useTranslations("confirm")

  // استخدام نفس منطق حساب الأسعار من ملف preview.tsx
  const priceCalculations = useMemo(() => {
    // إعطاء الأولوية لبيانات configuration إذا كانت متوفرة
    const configPrice = order.configuration?.configPrice || order.configPrice || 0
    const totalPrice = order.configuration?.totalPrice || order.totalPrice || 0
    const quantity = order.configuration?.quantity || order.quantity || 1
    const discount = order.configuration?.discount || order.discountRate || 0

    // حساب السعر للوحدة الواحدة بعد الخصم
    const unitPriceAfterDiscount = quantity > 0 ? totalPrice / quantity : 0
    const hasDiscount = discount > 0

    console.log("Price calculations from order configuration:", {
      configPrice,
      totalPrice,
      quantity,
      discount,
      unitPriceAfterDiscount,
      hasDiscount
    });

    return {
      configPrice,
      totalPrice,
      quantity,
      discount,
      unitPriceAfterDiscount,
      hasDiscount,
      subtotal: configPrice * quantity,
      discountAmount: hasDiscount ? (configPrice * quantity * (discount > 1 ? discount / 100 : discount)) : 0
    }
  }, [order])

  // A strategic best practice would be to source this value from a config file or the API
  // to avoid hardcoding business logic in the UI.
  const shippingCost = 69
  const finalTotal = priceCalculations.totalPrice + shippingCost
  const itemsText = priceCalculations.quantity === 1 ? t("orderSummary.item") : t("orderSummary.items")

  return (
    <div className="bg-muted/50 backdrop-blur-sm rounded-2xl p-6 sticky top-6 border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-6">{t("orderSummary.title")}</h3>
      <div className="space-y-4 mb-6">
        {/* عرض السعر الأصلي قبل الخصم */}
        <div className="flex justify-between items-center text-muted-foreground">
          <span>{`${t("orderSummary.subtotal")} (${priceCalculations.quantity} ${itemsText})`}</span>
          {priceCalculations.hasDiscount ? (
            <s className="text-gray-400">
              <NormalPrice price={priceCalculations.subtotal} />
            </s>
          ) : (
            <NormalPrice price={priceCalculations.subtotal} />
          )}
        </div>

        {/* عرض الخصم إذا كان متوفراً */}
        {priceCalculations.hasDiscount && (
          <div className="flex justify-between items-center text-green-600">
            <span>{`${t("orderSummary.discount")} (${Math.round(priceCalculations.discount > 1 ? priceCalculations.discount : priceCalculations.discount * 100)}%)`}</span>
            <span>
              -<NormalPrice price={priceCalculations.discountAmount} />
            </span>
          </div>
        )}

        {/* عرض سعر المنتج بعد الخصم */}
        {priceCalculations.hasDiscount && (
          <div className="flex justify-between items-center text-foreground">
            <span>{t("orderSummary.subtotalAfterDiscount")}</span>
            <NormalPrice price={priceCalculations.totalPrice} />
          </div>
        )}

        {/* تكلفة الشحن */}
        <div className="flex justify-between items-center text-muted-foreground">
          <span>{t("orderSummary.shipping")}</span>
          <NormalPrice price={shippingCost} />
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-foreground">{t("orderSummary.total")}</span>
            <span className="text-xl font-semibold text-destructive">
              <NormalPrice price={finalTotal} />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

const ErrorState = ({ error, onRetry }: { error: Error; onRetry: () => void }) => {
  const t = useTranslations("confirm")

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-3">{t("errors.unableToLoad")}</h2>
        <p className="text-gray-600 mb-8">{error.message || t("errors.somethingWentWrong")}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={onRetry}
            variant="outline"
            className="flex items-center gap-2 rounded-full px-6 bg-transparent"
          >
            <RefreshCw className="w-4 h-4" />
            {t("buttons.tryAgain")}
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-2 rounded-full px-6 bg-black hover:bg-gray-800"
          >
            <Home className="w-4 h-4" />
            {t("buttons.goHome")}
          </Button>
        </div>
      </div>
    </div>
  )
}

const NotFoundState = ({ onGoHome }: { onGoHome: () => void }) => {
  const t = useTranslations("confirm")

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-3">{t("errors.orderNotFound")}</h2>
        <p className="text-gray-600 mb-8">{t("errors.orderNotFoundDesc")}</p>
        <Button onClick={onGoHome} className="flex items-center gap-2 rounded-full px-6 bg-black hover:bg-gray-800">
          <Home className="w-4 h-4" />
          {t("buttons.returnHome")}
        </Button>
      </div>
    </div>
  )
}

const Confirm = () => {
  const t = useTranslations("confirm")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  const {
    data: order,
    isLoading: isOrderLoading,
    error,
    isError,
    refetch,
  } = useQuery<Order>({
    queryKey: ["orderDetails", orderId],
    queryFn: () => fetchOrderDetails(orderId!),
    enabled: !!orderId,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  })

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
  })

  // استخدام نفس منطق حساب الأسعار من ملف preview.tsx
  const priceCalculations = useMemo(() => {
    if (!order) return null

    const configPrice = order.configuration?.configPrice || order.configPrice || 0
    const totalPrice = order.configuration?.totalPrice || order.totalPrice || 0
    const quantity = order.configuration?.quantity || order.quantity || 1
    const discount = order.configuration?.discount || order.discountRate || 0

    const unitPriceAfterDiscount = quantity > 0 ? totalPrice / quantity : 0
    const hasDiscount = discount > 0
    const discountPercentage = Math.round(discount > 1 ? discount : discount * 100)

    return {
      configPrice,
      totalPrice,
      quantity,
      discount,
      unitPriceAfterDiscount,
      hasDiscount,
      discountPercentage
    }
  }, [order])

  useEffect(() => {
    const initializeUserData = async () => {
      if (!orderId || !order) return

      try {
        const userOrderDetails = await getUserStatus({ orderId: Number(orderId) })
        if (userOrderDetails?.shippingAddress) {
          form.reset({
            fullName: userOrderDetails.shippingAddress.fullName || "",
            phoneNumber: userOrderDetails.shippingAddress.phoneNumber || "",
            address: userOrderDetails.shippingAddress.address || "",
            city: userOrderDetails.shippingAddress.city || "",
            state: userOrderDetails.shippingAddress.state || "",
            zipCode: userOrderDetails.shippingAddress.zipCode || "",
            country: userOrderDetails.shippingAddress.country || "",
          })
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : t("errors.authorizationFailed")
        toast.error(t("errors.authenticationError"), {
          description: errorMessage,
        })
        router.push("/")
      }
    }

    initializeUserData()
  }, [orderId, order, router, form, t])

  const onSubmit = async (data: z.infer<typeof authFormConfirmingOrderSchema>) => {
    if (!order || !priceCalculations) {
      toast.error(t("errors.dataError"), {
        description: t("errors.orderInfoNotAvailable"),
      })
      return
    }

    setIsSubmitting(true)
    try {
      const orderPayload = {
        userId: order.userId,
        productId: order.product.id,
        productName: order.product.productName,
        productImages: order.product.productImages || [],
        quantity: priceCalculations.quantity,
        configPrice: priceCalculations.configPrice,
        productPrice: order.product.price,
        totalPrice: priceCalculations.totalPrice, // استخدام السعر المحسوب من التكوين
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
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const responseData = await response.json()
      toast.success(t("success.orderProcessed"))

      if (responseData?.id) {
        router.push(`/complete/?orderId=${responseData.id}`)
      } else {
        throw new Error(t("errors.invalidResponse"))
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("errors.unexpectedError")

      toast.error(t("errors.orderProcessingFailed"), {
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isOrderLoading) {
    return <LoadingState />
  }

  if (isError && error) {
    return <ErrorState error={error as Error} onRetry={() => refetch()} />
  }

  if (!order || !priceCalculations) {
    return <NotFoundState onGoHome={() => router.push("/")} />
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
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-3">{t("title")}</h1>
          <p className="text-lg text-muted-foreground">{t("subtitle")}</p>
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
                      <h2 className="text-xl font-semibold text-foreground mb-2">{order.product.productName}</h2>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 px-4 bg-muted/60 rounded-xl">
                        <span className="text-foreground text-[17px]">{t("productDetails.pricePerItem")}</span>
                        {priceCalculations.hasDiscount ? (
                          <div className="text-right">
                            <div className="line-through text-gray-400 text-sm">
                              <NormalPrice price={priceCalculations.configPrice} />
                            </div>
                            <div className="text-destructive font-semibold">
                              <NormalPrice price={priceCalculations.unitPriceAfterDiscount} />
                            </div>
                          </div>
                        ) : (
                          <span className="font-semibold">
                            <NormalPrice price={priceCalculations.unitPriceAfterDiscount} />
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center py-3 px-4 bg-muted/60  rounded-xl">
                        <span className="text-foreground text-[17px]">{t("productDetails.quantity")}</span>
                        <Badge variant="secondary" className="rounded-full">
                          {priceCalculations.quantity}
                        </Badge>
                      </div>
                      {priceCalculations.hasDiscount && (
                        <div className="flex justify-between items-center py-3 px-4 bg-green-50 rounded-xl">
                          <span className="text-green-700 font-medium">{t("orderSummary.youSave")}</span>
                          <span className="text-green-700 font-semibold">
                            {priceCalculations.discountPercentage}% {t("orderSummary.off")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-muted/50 rounded-2xl border border-border p-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">{t("shippingInfo.title")}</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput
                      control={form.control}
                      name="fullName"
                      label={t("shippingInfo.fullName.label")}
                      placeholder={t("shippingInfo.fullName.placeholder")}
                      type="text"
                      required
                    />
                    <CustomInput
                      control={form.control}
                      name="phoneNumber"
                      label={t("shippingInfo.phoneNumber.label")}
                      placeholder={t("shippingInfo.phoneNumber.placeholder")}
                      type="tel"
                      required
                    />
                  </div>
                  <CustomInput
                    control={form.control}
                    name="address"
                    label={t("shippingInfo.address.label")}
                    placeholder={t("shippingInfo.address.placeholder")}
                    type="text"
                    required
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput
                      control={form.control}
                      name="city"
                      label={t("shippingInfo.city.label")}
                      placeholder={t("shippingInfo.city.placeholder")}
                      type="text"
                      required
                    />
                    <CustomInput
                      control={form.control}
                      name="state"
                      label={t("shippingInfo.state.label")}
                      placeholder={t("shippingInfo.state.placeholder")}
                      type="text"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomInput
                      control={form.control}
                      name="zipCode"
                      label={t("shippingInfo.zipCode.label")}
                      placeholder={t("shippingInfo.zipCode.placeholder")}
                      type="text"
                    />
                    <CustomInput
                      control={form.control}
                      name="country"
                      label={t("shippingInfo.country.label")}
                      placeholder={t("shippingInfo.country.placeholder")}
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
                          {t("buttons.processingOrder")}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5" />
                          {t("buttons.completeOrder")}
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
  )
}

export default Confirm