"use client"

import { addToCart } from "@/actions/cart"
import { updateProductIP } from "@/actions/product-ip"
import { saveConfig as _saveConfig, type SaveConfigArgs } from "@/components/action"
import AddToCardIcon from "@/components/add-to-card"
import DiscountPrice from "@/components/discount-price"
import NormalPrice from "@/components/normal-price"
import ProductChandelierLampButtons from "@/components/product-chand-lamp-buttons"
import ProductColorTempButtons from "@/components/product-color-temp-buttons"
import ProductIPButtons from "@/components/product-ip-buttons"
import { QuantitySelector } from "@/components/quantity-selector"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { usePathname, useRouter } from "@/i18n/navigation"
import { cn } from "@/lib/utils"
import { type Configuration, type Order, type SupportedCurrency, ProductIP } from "@/types/products"
import { ProductColorTemp, ProductIP as PrismaProductIP, ProductChandLamp } from "@repo/database"
import { useAuth } from "@clerk/nextjs"
import { useMutation } from "@tanstack/react-query"
import { ArrowRight } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { useDebounce } from "use-debounce"

const PRODUCTS_WITH_IP20_TEXT = ["product-jy-810-10w", "product-jy-810-12w", "product-jy-810-18w", "product-jy-810-30w"]
const PRODUCTS_WITH_MAX_IP_TEXT = ["product-jy-913-5w", "product-jy-913-8w", "product-jy-913-12w", "product-jy-913-18w"]
const DEBOUNCE_DELAY = 300
const BULK_ORDER_THRESHOLD = 10
const QUANTITY_STORAGE_KEY_PREFIX = "quantity-"

interface ProductMainInfoProps {
  productName: string
  price: number
  quantity?: number
  increaseQuantity?: () => void
  decreaseQuantity?: () => void
  productId: string
  configId?: string
  discount: number
  order?: Order
  chandelierLightingType?: string
  Brand: string
  hNumber?: number
  configuration?: Configuration
  ip?: PrismaProductIP
  maxIP?: PrismaProductIP
  sectionTypes?: string[]
  sectionType: string
  maximumWattage?: number
  mainMaterial?: string
  beamAngle?: string
  spotlightType: string
  luminousFlux?: string
  colorTemperature?: string
  lifeTime?: string
  energySaving?: string
  brandOfLed?: string
  cri?: string
  electrical?: string
  finish?: string
  input?: string
  lampBase?: string
}

export default function ProductMainInfo({
  productName,
  price,
  quantity = 1,
  increaseQuantity,
  decreaseQuantity,
  productId,
  configId,
  discount,
  order,
  chandelierLightingType,
  Brand,
  hNumber,
  configuration: initialConfiguration,
  ip,
  maxIP,
  sectionTypes,
  sectionType,
  maximumWattage,
  mainMaterial,
  beamAngle,
  spotlightType,
  luminousFlux,
  colorTemperature,
  lifeTime,
  energySaving,
  brandOfLed,
  cri,
  electrical,
  finish,
  input,
  lampBase,
}: ProductMainInfoProps) {
  // Enhanced hooks for translations, navigation, and locale
  const t = useTranslations("product-main-info")
  const tDescription = useTranslations("product-descriptions")
  const tFullDescription = useTranslations("product-fullDescriptions")
  const tNotification = useTranslations("product-notifications")
  const tDialog = useTranslations("product-dialog")
  const router = useRouter()
  const locale = useLocale()
  const pathname = usePathname()

  // State management
  const [isPending, startTransition] = useTransition()
  const [showDialog, setShowDialog] = useState(false)
  const [currentQuantity, setCurrentQuantity] = useState(quantity)
  const [isClicked, setIsClicked] = useState(false)
  const [configuration, setConfiguration] = useState<Configuration | undefined>(initialConfiguration)
  const [selectedColorTemp, setSelectedColorTemp] = useState<ProductColorTemp>(
    (order?.productColorTemp as ProductColorTemp) ?? ProductColorTemp.warm,
  )
  const [selectedProductIp, setSelectProductIp] = useState<PrismaProductIP>(
    (initialConfiguration?.productIp as unknown as PrismaProductIP) ?? 
    (order?.productIp as PrismaProductIP) ?? 
    (ip as PrismaProductIP) ?? 
    PrismaProductIP.IP20
  )
  const [selectedProductChandelierLamp, setSelectedProductChandelierLamp] = useState<ProductChandLamp>(
    (order?.productChandLamp as ProductChandLamp) ?? ProductChandLamp.lamp9w,
  )
  const [priceIncrease, setPriceIncrease] = useState(0)
  const [lampPriceIncrease, setLampPriceIncrease] = useState(0)
  const { isSignedIn } = useAuth()
  const isUpdatingRef = useRef(false)
  const lastUpdateRef = useRef<string>("")
  const [debouncedProductIp] = useDebounce(selectedProductIp, DEBOUNCE_DELAY)

  const totalPriceBeforeDiscount = useMemo(() => {
    const total = price + priceIncrease + lampPriceIncrease
    console.log("Price calculation:", {
      basePrice: price,
      priceIncrease,
      lampPriceIncrease,
      total,
    })
    return total
  }, [price, priceIncrease, lampPriceIncrease])

  const discountedUnitPrice = useMemo(() => {
    const normalizedDiscount = discount > 1 ? discount / 100 : discount
    const discountedPrice = totalPriceBeforeDiscount * (1 - normalizedDiscount)
    const finalPrice = Math.ceil(discountedPrice)

    console.log("Discount calculation:", {
      totalPriceBeforeDiscount,
      discount,
      normalizedDiscount,
      discountedPrice,
      finalPrice,
    })

    return finalPrice
  }, [totalPriceBeforeDiscount, discount])

  const finalTotalPrice = useMemo(() => {
    return discountedUnitPrice * currentQuantity
  }, [discountedUnitPrice, currentQuantity])

  const showIP20Text = useMemo(() => PRODUCTS_WITH_IP20_TEXT.includes(productId), [productId])
  const showMaxIpText = useMemo(() => PRODUCTS_WITH_MAX_IP_TEXT.includes(productId), [productId])
  const showOutdoorText = useMemo(() => sectionTypes?.includes("outdoor") ?? false, [sectionTypes])

  useEffect(() => {
    const key = `${QUANTITY_STORAGE_KEY_PREFIX}${productId}`
    try {
      localStorage.setItem(key, currentQuantity.toString())
    } catch (error) {
      console.error("Failed to save quantity to localStorage:", error)
    }
  }, [currentQuantity, productId])

  const handleIncreaseQuantity = useCallback(() => {
    setCurrentQuantity((prev) => prev + 1)
    increaseQuantity?.()
  }, [increaseQuantity])

  const handleDecreaseQuantity = useCallback(() => {
    if (currentQuantity > 1) {
      setCurrentQuantity((prev) => prev - 1)
      decreaseQuantity?.()
    }
  }, [currentQuantity, decreaseQuantity])

  const handleProductChandelierLampChange = useCallback(
    (newProductLamp: ProductChandLamp, newLampPriceIncrease: number) => {
      console.log("Chandelier lamp change:", {
        newProductLamp,
        newLampPriceIncrease,
        basePrice: price,
        currentPriceIncrease: priceIncrease,
      })
      setSelectedProductChandelierLamp(newProductLamp)
      setLampPriceIncrease(newLampPriceIncrease)
    },
    [price, priceIncrease],
  )

  const handleColorTempChange = useCallback((newColorTemp: ProductColorTemp) => {
    setSelectedColorTemp(newColorTemp)
  }, [])

  const handleProductIPChange = useCallback((newProductIp: PrismaProductIP, newPriceIncrease: number) => {
    console.log("IP change:", {
      newProductIp,
      newPriceIncrease,
      basePrice: price,
      currentLampPriceIncrease: lampPriceIncrease,
    })
    setSelectProductIp(newProductIp)
    setPriceIncrease(newPriceIncrease)
  }, [price, lampPriceIncrease])

  const updateProductIPConfig = useCallback(
    async (newProductIp: PrismaProductIP, newPriceIncrease: number) => {
      if (!configId || isUpdatingRef.current) return

      const updateKey = `${configId}-${newProductIp}-${newPriceIncrease}`
      if (lastUpdateRef.current === updateKey) return

      isUpdatingRef.current = true
      lastUpdateRef.current = updateKey

      try {
        const result = await updateProductIP({
          productId,
          configId,
          newProductIp,
          priceIncrease: newPriceIncrease,
        })

        if (result.success && result.updatedConfig) {
          const updatedConfig: Configuration = {
            ...result.updatedConfig,
            currency: result.updatedConfig.currency as SupportedCurrency,
            productIp: result.updatedConfig.productIp ? (result.updatedConfig.productIp as unknown as ProductIP) : undefined,
            lampPriceIncrease: result.updatedConfig.lampPriceIncrease ?? undefined,
            priceIncrease: result.updatedConfig.priceIncrease ?? undefined,
          }
          setConfiguration(updatedConfig)
        } else {
          console.error("Failed to update configuration:", result.error)
          toast.error(tNotification("updateError"))
        }
      } catch (error) {
        console.error("Error updating product IP:", error)
        toast.error(tNotification("updateError"))
      } finally {
        isUpdatingRef.current = false
      }
    },
    [configId, productId, tNotification],
  )

  useEffect(() => {
    if (debouncedProductIp && configId) {
      updateProductIPConfig(debouncedProductIp, priceIncrease)
    }
  }, [debouncedProductIp, priceIncrease, configId, updateProductIPConfig])

  useEffect(() => {
    if (configuration?.productIp) {
      const configProductIp = configuration.productIp as unknown as PrismaProductIP
      if (configProductIp !== selectedProductIp) {
        setSelectProductIp(configProductIp)
      }
    }
  }, [configuration?.productIp, selectedProductIp])

  const { mutate: saveConfig, isPending: isSavingConfig } = useMutation({
    mutationKey: ["save-config", configId],
    mutationFn: (args: SaveConfigArgs) => _saveConfig(args),
    onError: (error) => {
      console.error("Configuration save error:", error)
      toast.error(tNotification("orderError"))
      setIsClicked(false)
    },
    onSuccess: (data) => {
      console.log("Configuration saved successfully:", data)
      try {
        localStorage.removeItem("cached-config")
        router.push(`/preview/${productId}`)
        toast.success(tNotification("configSaved") || "Configuration saved successfully!")
      } catch (error) {
        console.error("Navigation error:", error)
        toast.error("Navigation failed. Please try again.")
        setIsClicked(false)
      }
    },
  })

  const handleOrderNow = useCallback(() => {
    console.log("Order Now clicked - Complete price breakdown", {
      basePrice: price,
      priceIncrease,
      lampPriceIncrease,
      totalPriceBeforeDiscount,
      discount,
      discountedUnitPrice,
      currentQuantity,
      finalTotalPrice,
      configId,
      productId,
    })
    if (isSavingConfig) {
      console.log("Already processing configuration save")
      return
    }

    if (!configId) {
      console.error("Missing configuration ID")
      toast.error("Configuration not found. Please refresh the page.")
      return
    }

    if (!productId) {
      console.error("Missing product ID")
      toast.error("Product information missing. Please refresh the page.")
      return
    }

    if (currentQuantity < 1) {
      console.error("Invalid quantity")
      toast.error("Please select a valid quantity.")
      return
    }

    if (isClicked) {
      console.log("Button already clicked, preventing duplicate request")
      return
    }

    setIsClicked(true)

    const configData = {
      configId,
      productId,
      basePrice: price,
      configPrice: totalPriceBeforeDiscount,
      priceIncrease,
      lampPriceIncrease,
      quantity: currentQuantity,
      discount,
      totalPrice: finalTotalPrice,
    }

    console.log("Final configuration data being saved:", configData)
    saveConfig(configData)
  }, [
    isSavingConfig,
    configId,
    productId,
    currentQuantity,
    totalPriceBeforeDiscount,
    discountedUnitPrice,
    finalTotalPrice,
    isClicked,
    saveConfig,
    priceIncrease,
    lampPriceIncrease,
    discount,
    price,
  ])

  const handleAddToBag = useCallback(() => {
    if (!isSignedIn) {
      toast.error(tNotification("signInRequired"))
      return
    }

    startTransition(async () => {
      if (currentQuantity >= BULK_ORDER_THRESHOLD) {
        setShowDialog(true)
        return
      }

      try {
        await addToCart(productId)
        toast.success(tNotification("addedToCart", { productName }))
      } catch (error) {
        console.error("Failed to add item to cart:", error)
        toast.error(tNotification("failedToAdd"))
      }
    })
  }, [isSignedIn, currentQuantity, productId, tNotification, productName])

  const createProductDescription = useCallback((): string => {
    const params = {
      Brand: Brand,
      brand: Brand,
      wattage: maximumWattage ?? 0,
      material: mainMaterial ?? "N/A",
      luminousFlux: luminousFlux ?? "N/A",
      beamAngle: beamAngle ?? "N/A",
      ip: ip ?? "N/A",
      spotlightType: spotlightType,
      colorTemperature: colorTemperature ?? "N/A",
      finish: finish ?? "N/A",
      totalWattage: (hNumber || 0) * 12,
      hNumber: hNumber ?? 0,
      lampBase: lampBase ?? "N/A",
    }

    if (Brand === "balcom") {
      return sectionType === "indoor" ? tDescription("balcomIndoor", params) : tDescription("balcomOutdoor", params)
    }
    if (Brand === "mister-led" && sectionType === "chandelier") {
      return chandelierLightingType === "LED"
        ? tDescription("misterLedChandelierLED", params)
        : tDescription("misterLedChandelierLamp", params)
    }

    return ""
  }, [
    Brand,
    sectionType,
    chandelierLightingType,
    maximumWattage,
    mainMaterial,
    luminousFlux,
    beamAngle,
    ip,
    spotlightType,
    colorTemperature,
    finish,
    hNumber,
    lampBase,
    tDescription,
  ])

  const createProductDescriptionFull = useCallback((): string => {
    const params = {
      Brand: Brand,
      brand: Brand,
      wattage: maximumWattage ?? 0,
      material: mainMaterial ?? "N/A",
      luminousFlux: luminousFlux ?? "N/A",
      beamAngle: beamAngle ?? "N/A",
      colorTemperature: colorTemperature ?? "N/A",
      lifeTime: lifeTime ?? "N/A",
      energySaving: energySaving ?? "N/A",
      cri: cri ?? "N/A",
      ip: ip ?? "N/A",
      brandOfLed: brandOfLed ?? "N/A",
      electrical: electrical ?? "N/A",
      spotlightType: spotlightType,
      finish: finish ?? "N/A",
      input: input ?? "N/A",
      totalWattage: (hNumber || 0) * 12,
      hNumber: hNumber ?? 0,
      lampBase: lampBase ?? "N/A",
    }

    if (Brand === "balcom") {
      return sectionType === "indoor"
        ? tFullDescription("balcomIndoor", params)
        : tFullDescription("balcomOutdoor", params)
    }
    if (Brand === "mister-led" && sectionType === "chandelier") {
      return chandelierLightingType === "LED"
        ? tFullDescription("misterLedChandelierLED", params)
        : tFullDescription("misterLedChandelierLamp", params)
    }

    return ""
  }, [
    Brand,
    sectionType,
    chandelierLightingType,
    maximumWattage,
    mainMaterial,
    luminousFlux,
    beamAngle,
    colorTemperature,
    lifeTime,
    energySaving,
    cri,
    ip,
    brandOfLed,
    electrical,
    spotlightType,
    finish,
    input,
    hNumber,
    lampBase,
    tFullDescription,
  ])

  return (
    <div className="md:ml-7 ml-0">
      <div className="space-y-4">
        <h1 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight">{productName}</h1>
        <p className="text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed">
          {createProductDescription()}
        </p>
      </div>
      <div className="space-y-6 mt-6">
        <div
          className={cn(
            "grid gap-6",
            chandelierLightingType === "lamp" && Brand === "mister-led" && "sm:grid-cols-2",
            Brand === "balcom" && "sm:grid-cols-2",
          )}
        >
          <div className="space-y-4">
            {chandelierLightingType === "lamp" && Brand === "mister-led" && (
              <ProductChandelierLampButtons
                productId={productId}
                configId={configId}
                productChandLamp={selectedProductChandelierLamp}
                onProductLampChange={handleProductChandelierLampChange}
                hNumber={hNumber || 0}
                basePrice={price}
                discount={discount}
                priceIncrease={priceIncrease}
              />
            )}
            {Brand === "balcom" && (
              <ProductIPButtons
                productId={productId}
                configId={configId ?? ""}
                productIp={selectedProductIp}
                onProductIpChange={handleProductIPChange}
                basePrice={price}
                discount={discount} maxIP={maxIP ?? PrismaProductIP.IP20}              />
            )}
          </div>
          <div className="space-y-4">
            <ProductColorTempButtons
              productId={productId}
              productColorTemp={selectedColorTemp}
              onColorTempChange={handleColorTempChange}
            />
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {discount > 0 ? (
            <>
              <span className="text-xl font-semibold">
                <DiscountPrice
                  price={price}
                  discount={discount}
                  quantity={currentQuantity}
                  priceIncrease={priceIncrease}
                  lampPriceIncrease={lampPriceIncrease}
                  roundingMode="ceil"
                />
              </span>
              <s className="text-muted-foreground text-base">
                <NormalPrice price={totalPriceBeforeDiscount} quantity={currentQuantity} />
              </s>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm font-medium">
                {discount > 1 ? discount : discount * 100}% {t("off")}
              </span>
            </>
          ) : (
            <span className="text-xl font-semibold">
              <NormalPrice price={totalPriceBeforeDiscount} quantity={currentQuantity} />
            </span>
          )}
        </div>
        <div className="flex justify-between items-center py-4 border-t border-b">
          <div className="flex items-center text-primary">
            <span className="text-base md:text-lg font-medium">{t("checkAvailability")}</span>
            <ArrowRight className="w-5 h-5 ml-2 -rtl:rotate-180" />
          </div>
          <div className="text-right">
            <span className="text-green-600 font-medium">{t("inStock")}</span>
            {showIP20Text && <div className="text-destructive text-[13px] font-medium">{t("availableOnlyIP20")}</div>}
            {showMaxIpText && (
              <div className="text-destructive text-[13px] font-medium">{t("availableOnlyIP20IP44IP54")}</div>
            )}
            {showOutdoorText && (
              <div className="text-destructive text-[13px] font-medium">{t("availableOnlyIP65IP68")}</div>
            )}
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-white dark:bg-neutral-900 border-t shadow-lg px-4 md:relative md:bg-transparent md:border-0 md:shadow-none md:p-0 md:mt-6">
        <div className="flex flex-col gap-3 max-w-md mx-auto md:max-w-none md:p-0 p-4 ">
          <div className="flex items-center gap-4">
            <QuantitySelector
              quantity={currentQuantity}
              onIncrease={handleIncreaseQuantity}
              onDecrease={handleDecreaseQuantity}
              size="lg"
              rtlSupport={true}
              minQuantity={1}
            />
            <Button disabled={isPending} onClick={handleAddToBag} className="flex-1 h-12 text-base">
              {isPending ? t("adding") : t("addToCart")}
              <AddToCardIcon Fill="currentColor" width={20} height={20} className="ml-2" />
            </Button>
          </div>
          <Button
            disabled={isClicked || isSavingConfig}
            variant="outline"
            onClick={handleOrderNow}
            className="w-full h-12 bg-transparent text-base relative"
          >
            {isClicked || isSavingConfig ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                {t("processingOrder")}
              </div>
            ) : (
              t("orderNow")
            )}
          </Button>
        </div>
      </div>
      <div className="mt-8 mb-20 md:mb-0">
        <h2 className="text-xl font-semibold mb-4">{t("description")}</h2>
        <p className="text-muted-foreground leading-relaxed text-base">{createProductDescriptionFull()}</p>
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tDialog("bulkOrderTitle")}</DialogTitle>
            <DialogDescription>{tDialog("bulkOrderDescription")}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">{tDialog("close")}</Button>
            </DialogClose>
            <a
              href="tel:+1154466259"
              onClick={() => setShowDialog(false)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md inline-flex items-center"
            >
              {tDialog("contactSalesTeam")}
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}