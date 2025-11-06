"use client";

import LoginModal from "@/components/login-model";
import NormalPrice from "@/components/normal-price";
import ProductImages from "@/components/product-images";
import { useRouter } from "@/i18n/navigation";
import { useUser } from "@clerk/nextjs";
import { Configuration } from "@repo/database";
import { Container } from "@repo/ui";
import { Button } from "@repo/ui/button";
import { ScrollArea } from "@repo/ui/scroll-area";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { toast } from "sonner";
import { createOrder } from "./action";

interface ProductWithSpecs {
  id: string;
  productId: string;
  productName: string;
  price: number;
  productImages: string[];
  discount: number;
  sectionType: string;
  spotlightType: string;
  brand: string;
  productColor: string;
  productIp: string;
  productChandLamp: string;
  maxIP?: number;
  luminousFlux?: string;
  mainMaterial?: string;
  beamAngle?: string;
  colorTemperature?: string;
  lifeTime?: string;
  energySaving?: string;
  cri?: string;
  brandOfLed?: string;
  electrical?: string;
  input?: string;
  finish?: string;
  lampBase?: string;
  hNumber?: number;
  chandelierLightingType?: string;
  specification?: any;
  localizedSpecs?: any;
}

const fetchProduct = async (productId: string, locale: string): Promise<ProductWithSpecs> => {
  try {
    const response = await fetch(`/api/products/${productId}?locale=${locale}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Product fetch failed: ${response.status} - ${errorText}`);
      throw new Error(`Failed to fetch product: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Fetch product error:", error);
    throw error;
  }
};

const fetchConfiguration = async (productId: string): Promise<Configuration> => {
  try {
    const response = await fetch(`/api/configurations/by-products/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Configuration fetch failed: ${response.status} - ${errorText}`);
      throw new Error(`Failed to fetch configuration: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Fetch configuration error:", error);
    throw error;
  }
};

interface PreviewProps {
  configuration?: Configuration;
  discount?: number;
  productId: string;
  ProductSpecification?: any;
  product?: ProductWithSpecs;
  locale: string;
}

export default function Preview({
  configuration: initialConfiguration,
  discount: initialDiscount,
  productId,
  product: initialProduct,
  locale: initialLocale,
}: PreviewProps) {
  const [configuration, setConfiguration] = useState<Configuration | undefined>(initialConfiguration);
  const { ProductId } = useParams();
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const locale = useLocale();
  const t = useTranslations('preview');

  const [authState, setAuthState] = useState({
    isAuthChecked: false,
    canProceedWithOrder: false
  });

  const actualProductId = productId || (ProductId as string);

  const {
    data: product,
    isLoading: isProductLoading,
    isError: isProductError,
    error: productError,
    refetch: refetchProduct,
  } = useQuery<ProductWithSpecs>({
    queryKey: ["product", actualProductId, locale],
    queryFn: () => fetchProduct(actualProductId, locale),
    enabled: !!actualProductId && !initialProduct,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: fetchedConfiguration,
    isLoading: isConfigLoading,
    isError: isConfigError,
    refetch: refetchConfiguration,
  } = useQuery<Configuration>({
    queryKey: ["configuration", actualProductId],
    queryFn: () => fetchConfiguration(actualProductId),
    enabled: !!actualProductId && !initialConfiguration,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const finalProduct = initialProduct || product;
  const finalConfiguration = initialConfiguration || configuration || fetchedConfiguration;

  // حساب الأسعار المبسط - نستخدم ما هو محفوظ في قاعدة البيانات
  const priceCalculations = useMemo(() => {
    if (!finalConfiguration) {
      return {
        configPrice: 0,
        totalPrice: 0,
        quantity: 1,
        discount: 0,
        unitPriceAfterDiscount: 0,
        hasDiscount: false
      };
    }

    const configPrice = finalConfiguration.configPrice || 0; // السعر قبل الخصم
    const totalPrice = finalConfiguration.totalPrice || 0; // السعر النهائي بعد الخصم
    const quantity = finalConfiguration.quantity || 1;
    const discount = finalConfiguration.discount || 0;

    // حساب السعر للوحدة الواحدة بعد الخصم
    const unitPriceAfterDiscount = quantity > 0 ? totalPrice / quantity : 0;
    const hasDiscount = discount > 0;

    console.log("Price calculations from saved configuration:", {
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
      hasDiscount
    };
  }, [finalConfiguration]);

  useEffect(() => {
    if (isLoaded) {
      setAuthState({
        isAuthChecked: true,
        canProceedWithOrder: isSignedIn && !!user
      });
    }
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (finalConfiguration) {
      try {
        localStorage.setItem("configurationId", finalConfiguration.id);
        setConfiguration(finalConfiguration);
      } catch (error) {
        console.error("Error storing configuration ID:", error);
      }
    }
  }, [finalConfiguration]);

  const { mutate: CreateOrderSession, isPending } = useMutation({
    mutationKey: ["get-order-session"],
    mutationFn: createOrder,
    onMutate: () => {
      if (!authState.canProceedWithOrder) {
        throw new Error("Authentication required");
      }
    },
    onSuccess: ({ userId, orderId, productId: returnedProductId }) => {
      try {
        localStorage.removeItem("configurationId");
        localStorage.removeItem(`quantity-${actualProductId}`);
      } catch (error) {
        console.error("Error clearing localStorage:", error);
      }
      router.push(`/confirm/?orderId=${orderId}&userId=${userId}&productId=${returnedProductId}`);
    },
    onError: (error) => {
      console.error("Error creating order:", error);

      if (error.message.includes("logged in")) {
        toast.error(t('authError'));
        setIsLoginModalOpen(true);
      } else {
        toast.error(t('generalError'));
      }
    },
  });

  const handleConfirm = useCallback(async () => {
    console.log("Creating order with configuration:", {
      configId: finalConfiguration?.id,
      priceCalculations
    });

    if (!isLoaded) {
      toast.error(t('waitAuth'));
      return;
    }

    if (!authState.canProceedWithOrder) {
      console.log("User not authenticated, showing login modal");
      setIsLoginModalOpen(true);
      return;
    }

    if (!finalConfiguration) {
      toast.error(t('configMissing'));
      return;
    }

    if (isSignedIn && user && finalConfiguration) {
      console.log("Proceeding with order creation:", {
        configId: finalConfiguration.id,
        quantity: priceCalculations.quantity,
        userId: user.id,
        totalPrice: priceCalculations.totalPrice
      });

      CreateOrderSession({
        configId: finalConfiguration.id,
        quantity: priceCalculations.quantity
      });
    } else {
      console.log("Final validation failed, showing login modal");
      setIsLoginModalOpen(true);
    }
  }, [isLoaded, isSignedIn, user, authState, finalConfiguration, priceCalculations, CreateOrderSession, t]);

  const handleRetry = () => {
    refetchProduct();
    refetchConfiguration();
  };

  const isLoading = !authState.isAuthChecked || isProductLoading || isConfigLoading;

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-2xl">{t('loadingTitle')}</h3>
          <p>{t('loadingSubtitle')}</p>
        </div>
      </div>
    );
  }

  if (isProductError || isConfigError || !finalProduct || !finalConfiguration) {
    console.error("Preview errors:", { isProductError, isConfigError, productError });

    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <h3 className="font-semibold text-2xl">{t('errorTitle')}</h3>
          <p>{t('errorSubtitle')}</p>
          <div className="flex gap-2">
            <Button onClick={handleRetry} variant="outline">
              {t('retryButton')}
            </Button>
            <Button onClick={() => window.location.reload()}>
              {t('refreshButton')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getHighlightDescription = (key: string, fallbackKey: string, dynamicValue?: string) => {
    if (dynamicValue) {
      return t(`highlights-preview.${key}`, { [key === 'ledsDescription' ? 'luminousFlux' : 'material']: dynamicValue });
    }
    return t(`highlights-preview.${fallbackKey}`);
  };

  return (
    <div className="min-h-screen">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-12"
        >
          <h1 className="lg:text-3xl md:text-2xl text-xl font-bold sm:mb-8">
            {t('title')}
          </h1>
          <LoginModal
            isOpen={isLoginModalOpen}
            setIsOpen={setIsLoginModalOpen}
          />
          <div className="flex flex-col lg:flex-row lg:gap-x-12 gap-x-0">
            <div className="lg:w-[40%] md:w-[50%] mb-0">
              {finalProduct.productImages && finalProduct.productImages.length > 0 ? (
                <div>
                  <ProductImages productImages={finalProduct.productImages} />
                </div>
              ) : (
                <div className="w-full h-[450px] flex items-center justify-center bg-gray-100 rounded-lg">
                  <p>{t('noImagesAvailable')}</p>
                </div>
              )}
            </div>
            <div>
              <div className="h-[37.5rem] w-full col-span-full lg:col-span-1 flex flex-col">
                <ScrollArea className="relative flex-1 overflow-auto" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                  <div className="p-[18px]" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="-ml-4">
                      <h2 className="md:text-2xl text-xl mt-6 font-bold text-primary">
                        {finalProduct.productName}
                      </h2>
                      <div className="mt-3 flex items-center gap-1.5 text-base">
                        <Check className="h-4 w-4 text-green-500" />
                        {t('inStock')}
                      </div>
                    </div>
                    <div className="sm:col-span-12 md:col-span-9 text-base mb-6">
                      <div className="grid grid-cols-1 border-b border-gray-200 py-4 sm:py-2 md:py-4">
                        <div>
                          <p className="font-bold md:text-xl text-lg -ml-4">
                            {t('highlights')}
                          </p>
                          <ol className="mt-3 list-disc space-y-1">
                            <li className="md:text-lg text-base">
                              <p className="inline tracking-wide">
                                <strong>{t('highlights-preview.ledsTitle')}</strong>{" "}
                                {getHighlightDescription('ledsDescription', 'ledsDescriptionDefault', finalProduct.luminousFlux)}
                              </p>
                            </li>
                            <li className="md:text-lg text-base">
                              <p className="inline tracking-wide">
                                <strong>{t('highlights-preview.durableTitle')}</strong>{" "}
                                {getHighlightDescription('durableDescription', 'durableDescriptionDefault', finalProduct.mainMaterial)}
                              </p>
                            </li>
                            <li className="md:text-lg text-base">
                              <p className="inline tracking-wide">
                                <strong>{t('highlights-preview.adaptableTitle')}</strong>{" "}
                                {t('highlights-preview.adaptableDescription')}
                              </p>
                            </li>
                          </ol>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 border-b border-gray-200 py-4 sm:py-2 md:py-4">
                        <div>
                          <p className="font-bold md:text-xl text-lg -ml-4">
                            {t('features')}
                          </p>
                          <ol className="mt-3 list-disc space-y-1">
                            <li className="md:text-lg text-base">
                              <p className="inline tracking-wide">
                                <strong>{t('features-preview.warranty')}</strong>
                              </p>
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>
                    <div className="mt-8">
                      <div className="py-4 sm:py-6 sm:rounded-lg">
                        <div className="flow-root text-lg">
                          {priceCalculations.hasDiscount ? (
                            <>
                              <div className="flex items-center justify-between py-1 mt-2">
                                <p className="md:text-lg text-base">
                                  {t('pricePerItem')}
                                </p>
                                <s className="text-gray-500 md:text-lg text-base">
                                  <NormalPrice price={priceCalculations.configPrice} />
                                </s>
                              </div>
                              <div className="flex items-center justify-between py-1 mt-2">
                                <p className="md:text-lg text-base text-center">
                                  {t('quantity')}
                                </p>
                                <p className="md:text-lg text-base">{priceCalculations.quantity}</p>
                              </div>
                              <div className="flex items-center justify-between py-1 mt-2">
                                <p className="md:text-lg text-base">
                                  {t('discountAmount')}
                                </p>
                                <span className="text-green-600 font-semibold md:text-lg text-base">
                                  {`${Math.round((priceCalculations.discount > 1 ? priceCalculations.discount : priceCalculations.discount * 100))}%`}
                                </span>
                              </div>
                              <div className="flex items-center justify-between py-1 mt-2">
                                <p className="md:text-lg text-base">
                                  {t('priceAfterDiscount')}
                                </p>
                                <span className="md:text-lg text-base text-destructive font-semibold">
                                  <NormalPrice price={priceCalculations.totalPrice} />
                                </span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center justify-between py-1 mt-2">
                                <p>{t('pricePerItem')}</p>
                                <p>
                                  <NormalPrice price={priceCalculations.unitPriceAfterDiscount} />
                                </p>
                              </div>
                              <div className="flex items-center justify-between py-1 mt-2">
                                <p>{t('quantity')}</p>
                                <p>{priceCalculations.quantity}</p>
                              </div>
                              <div className="flex items-center justify-between py-1 mt-2">
                                <p>{t('totalPrice')}</p>
                                <p>
                                  <NormalPrice price={priceCalculations.totalPrice} />
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
              <div className="mt-8 flex md:justify-end justify-center pb-12">
                <Button
                  onClick={handleConfirm}
                  disabled={isPending || !authState.isAuthChecked}
                  className="sm:h-[52px] h-[40px] sm:px-10 px-8 bg-primary text-primary-foreground sm:text-lg text-base"
                >
                  {isPending ? t('confirmingOrder') : t('confirmOrder')}
                  <ArrowRight className="sm:h-[18px] sm:w-[18px] h-[16px] w-[16px] ml-1.5 inline" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}