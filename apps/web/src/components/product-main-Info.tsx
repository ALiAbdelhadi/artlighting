"use client"

import { addToCart } from "@/actions/cart"
import { updateProductIP } from "@/actions/product-ip"
import { saveConfig as _saveConfig, type SaveConfigArgs } from "@/components/action"
import { cn } from "@repo/ui"
import { ProductMainInfoProps } from "@/types/products"
import { useAuth } from "@clerk/nextjs"
import { type Configuration, ProductChandLamp, ProductColorTemp, ProductIP } from "@repo/database"
import { Button } from "@repo/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useMutation } from "@tanstack/react-query"
import { ArrowRight, Minus, Plus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"
import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import { toast } from "sonner"
import { useDebounce } from "use-debounce"
import AddToCardIcon from "./add-to-card"
import DiscountPrice from "./discount-price"
import NormalPrice from "./normal-price"
import ProductChandLampButtons from "./product-chand-lamp-buttons"
import ProductColorTempButtons from "./product-color-temp-buttons"
import ProductIPButtons from "./product-ip-buttons"

const ProductMainInfo: React.FC<ProductMainInfoProps> = ({
  productName,
  price,
  quantity = 1,
  increaseQuantity,
  decreaseQuantity,
  ProductId,
  configId,
  discount,
  order,
  ChandelierLightingType,
  Brand,
  hNumber,
  configuration: initialConfiguration,
  ip,
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
}) => {
  const [isPending, startTransition] = useTransition()
  const [showDialog, setShowDialog] = useState(false)
  const [currentQuantity, setCurrentQuantity] = useState(quantity)
  const [isClicked, setIsClicked] = useState(false)
  const [selectedColorTemp, setSelectedColorTemp] = useState<ProductColorTemp>(
    (order?.productColorTemp as ProductColorTemp) || ProductColorTemp.warm,
  )
  // Fixed: Using underscore prefix to indicate intentionally unused variable
  const [, setConfiguration] = useState<Configuration | undefined>(initialConfiguration as Configuration)
  const [selectedProductIp, setSelectProductIp] = useState<ProductIP>((order?.productIp as ProductIP) || ProductIP.IP20)
  const [selectedProductChandLamp, setSelectedProductChandLamp] = useState<ProductChandLamp>(
    (order?.productChandLamp as ProductChandLamp) || ProductChandLamp.lamp9w,
  )

  const router = useRouter()
  const { isSignedIn } = useAuth()

  const isUpdatingRef = useRef(false)
  const lastUpdateRef = useRef<string>("")

  const debouncedProductIp = useDebounce(selectedProductIp, 300)

  useEffect(() => {
    localStorage.setItem(`quantity-${ProductId}`, currentQuantity.toString())
  }, [currentQuantity, ProductId])

  const handleIncreaseQuantity = useCallback(() => {
    setCurrentQuantity((prev) => prev + 1)
    increaseQuantity()
  }, [increaseQuantity])

  const handleDecreaseQuantity = useCallback(() => {
    if (currentQuantity > 1) {
      setCurrentQuantity((prev) => prev - 1)
      decreaseQuantity()
    }
  }, [currentQuantity, decreaseQuantity])

  const { mutate: saveConfig } = useMutation({
    mutationKey: ["save-config"],
    mutationFn: async (args: SaveConfigArgs) => {
      await _saveConfig(args)
    },
    onError: () => {
      toast.error("There was an error with your order. Please refresh the page and try again.")
    },
    onSuccess: () => {
      router.push(`/preview/${ProductId}`)
    },
  })

  const [priceIncrease, setPriceIncrease] = useState(0)
  const [lampPriceIncrease, setLampPriceIncrease] = useState(0)

  const handleProductChandLampChange = useCallback((newProductLamp: ProductChandLamp, newPriceIncrease: number) => {
    setSelectedProductChandLamp(newProductLamp)
    setLampPriceIncrease(newPriceIncrease)
  }, [])

  // Memoized function to update product IP
  const updateProductIPConfig = useCallback(
    async (newProductIp: ProductIP, newPriceIncrease: number) => {
      if (!configId || isUpdatingRef.current) {
        return
      }

      // Create a unique key for this update to prevent duplicates
      const updateKey = `${configId}-${newProductIp}-${newPriceIncrease}`
      if (lastUpdateRef.current === updateKey) {
        return
      }

      isUpdatingRef.current = true
      lastUpdateRef.current = updateKey

      try {
        console.log(`Updating configuration with ID: ${configId}`)
        const result = await updateProductIP({
          productId: ProductId,
          configId,
          newProductIp,
          priceIncrease: newPriceIncrease,
        })

        if (result.success && result.updatedConfig) {
          setConfiguration(result.updatedConfig)
          console.log("Configuration updated successfully:", result.updatedConfig)
        } else {
          console.error("Failed to update configuration:", result.error)
        }
      } catch (error) {
        console.error("Error updating product IP:", error)
      } finally {
        isUpdatingRef.current = false
      }
    },
    [configId, ProductId],
  )

  // Use effect to handle debounced IP updates
  useEffect(() => {
    if (debouncedProductIp && configId) {
      updateProductIPConfig(debouncedProductIp, priceIncrease)
    }
  }, [debouncedProductIp, priceIncrease, updateProductIPConfig, configId])

  const handleProductIPChange = useCallback(async (newProductIp: ProductIP, newPriceIncrease: number) => {
    // Only update local state immediately, the API call will be debounced
    setSelectProductIp(newProductIp)
    setPriceIncrease(newPriceIncrease)
  }, [])

  const totalPrice = price + priceIncrease + lampPriceIncrease

  const handleOrderNow = useCallback(() => {
    saveConfig({
      configId,
      ProductId,
      configPrice: totalPrice,
      priceIncrease,
      lampPriceIncrease,
      quantity: currentQuantity,
      discount,
      totalPrice,
    })
    setIsClicked(true)
  }, [saveConfig, configId, ProductId, totalPrice, priceIncrease, lampPriceIncrease, currentQuantity, discount])

  const handleColorTempChange = useCallback((newColorTemp: ProductColorTemp) => {
    setSelectedColorTemp(newColorTemp)
  }, [])

  const handleAddToBag = useCallback(() => {
    if (!isSignedIn) {
      toast("Please sign in to add items to your cart.")
      return
    }

    startTransition(async () => {
      if (currentQuantity >= 10) {
        setShowDialog(true)
      } else {
        try {
          await addToCart(ProductId)
          toast(`${productName} has been added to your cart`)
        } catch (error) {
          // Fixed: Added proper error handling and logging
          console.error("Failed to add item to cart:", error)
          toast("Failed to add item to cart. Please try again.")
        }
      }
    })
  }, [isSignedIn, currentQuantity, ProductId, productName])

  const productsWithIP20Text = ["product-jy-810-10w", "product-jy-810-12w", "product-jy-810-18w", "product-jy-810-30w"]
  const productsWithMaxIpText = ["product-jy-913-5w", "product-jy-913-8w", "product-jy-913-12w", "product-jy-913-18w"]

  const createProductDescription = useCallback((): string => {
    if (Brand === "balcom" && sectionType === "indoor") {
      return `Elevate your indoor space with the ${Brand} ${maximumWattage}W LED luminaire. Crafted with premium ${mainMaterial}, this high-performance light offers ${luminousFlux} luminous output, ${beamAngle} beam angle.`
    } else if (Brand === "balcom" && sectionType === "outdoor") {
      return `Illuminate your outdoor area with the ${Brand} ${maximumWattage}W ${spotlightType} lighting fixture. Built to withstand the elements with its IP${ip} weatherproof rating and durable ${mainMaterial} construction, this fixture delivers ${luminousFlux} luminous output and ${beamAngle} beam spread. Experience ${colorTemperature}`
    } else if (Brand === "mister-led" && sectionType === "chandelier" && ChandelierLightingType === "LED") {
      return `Transform your space with this elegant ${Brand} ${maximumWattage}W LED chandelier. Featuring a sophisticated ${finish} finish and crafted from ${mainMaterial}, this modern fixture combines style with energy-efficient LED technology.`
    } else if (Brand === "mister-led" && sectionType === "chandelier" && ChandelierLightingType === "lamp") {
      return `Enhance your interior with this stunning ${Brand} chandelier, designed with ${(hNumber || 0) * 12}w elegant Lamp counted: ${hNumber} with 12W lamp holders. Beautifully crafted from ${mainMaterial} with a refined ${finish} finish, this versatile fixture allows you to customize your lighting experience with ${lampBase} bulbs.`
    }
    return ""
  }, [
    Brand,
    sectionType,
    maximumWattage,
    mainMaterial,
    luminousFlux,
    beamAngle,
    ip,
    spotlightType,
    colorTemperature,
    ChandelierLightingType,
    finish,
    hNumber,
    lampBase,
  ])

  const createProductDescriptionFull = useCallback((): string => {
    if (Brand === "balcom" && sectionType === "indoor") {
      return `Elevate your indoor space with the ${Brand} ${maximumWattage}W LED luminaire. Crafted with premium ${mainMaterial}, this high-performance light offers ${luminousFlux} lumens of brightness, a ${beamAngle} degree beam angle, and adjustable ${colorTemperature}. Enjoy up to ${lifeTime} hours of reliable performance, save ${energySaving} on your energy bills, and experience exceptional color rendering with a CRI of ${cri}. Designed for IP${ip} rated environments, this luminaire features ${brandOfLed} LEDs and ${electrical} for optimal efficiency.`
    } else if (Brand === "balcom" && sectionType === "outdoor") {
      return `Illuminate your outdoor area with the ${Brand} ${maximumWattage}W ${spotlightType} lighting fixture. Built to withstand the elements with its IP${ip} weatherproof rating and durable ${mainMaterial} construction, this fixture delivers ${luminousFlux} lumens of brightness and a ${beamAngle} degree beam spread. Experience ${colorTemperature} color temperature, ${lifeTime} hours of long-lasting performance, and ${energySaving}% energy efficiency. Equipped with ${brandOfLed} LEDs and ${electrical}, this fixture provides reliable lighting for any outdoor setting.`
    } else if (Brand === "mister-led" && sectionType === "chandelier" && ChandelierLightingType === "LED") {
      return `Transform your space with this elegant ${Brand} ${maximumWattage}W LED chandelier. Featuring a sophisticated ${finish} finish and masterfully crafted from ${mainMaterial}, this modern fixture combines timeless style with cutting-edge LED technology. Operating at ${input}, it offers flexible lighting options with adjustable color temperatures of ${colorTemperature}. With an impressive lifespan of ${lifeTime} hours, this chandelier provides long-lasting, maintenance-free illumination while adding a touch of luxury to your space.`
    } else if (Brand === "mister-led" && sectionType === "chandelier" && ChandelierLightingType === "lamp") {
      return `Enhance your interior with this stunning ${Brand} chandelier, thoughtfully designed with ${(hNumber || 0) * 12}w Lamp counted: ${hNumber} with 12W lamp elegant lamp holders. Beautifully crafted from ${mainMaterial} with a refined ${finish} finish, this versatile fixture allows you to customize your lighting experience with ${lampBase} bulbs. Operating at ${input}, it supports various color temperatures (${colorTemperature}) to suit your mood and decor. The chandelier's durable construction and timeless design make it a perfect centerpiece for your living space, dining room, or entryway. Design flexibility allows you to choose your preferred bulbs (not included) for personalized illumination.`
    }
    return ""
  }, [
    Brand,
    sectionType,
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
    ChandelierLightingType,
    finish,
    input,
    hNumber,
    lampBase,
  ])

  return (
    <div className="ml-7">
      <div className="space-y-4">
        <h1 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight">{productName}</h1>
        <p className="text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed">
          {createProductDescription()}
        </p>
        <div className="space-y-6">
          <div
            className={cn(
              "grid gap-6",
              ChandelierLightingType === "lamp" && Brand === "mister-led" && "sm:grid-cols-2",
              Brand === "balcom" && "sm:grid-cols-2",
            )}
          >
            <div className="space-y-4">
              {ChandelierLightingType === "lamp" && Brand === "mister-led" && (
                <ProductChandLampButtons
                  productId={ProductId}
                  productChandLamp={selectedProductChandLamp}
                  onProductLampChange={handleProductChandLampChange}
                  basePrice={price}
                  hNumber={hNumber || 0}
                />
              )}

              {Brand === "balcom" && (
                <ProductIPButtons
                  productId={ProductId}
                  productIp={selectedProductIp}
                  onProductIpChange={handleProductIPChange}
                  basePrice={price}
                  configId={configId}
                />
              )}
            </div>

            <div className="space-y-4">
              <ProductColorTempButtons
                productId={ProductId}
                productColorTemp={selectedColorTemp}
                onColorTempChange={handleColorTempChange}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {discount > 0 ? (
              <>
                <span className="text-xl font-semibold">
                  <DiscountPrice price={totalPrice} discount={discount} quantity={currentQuantity} />
                </span>
                <s className="text-muted-foreground text-base">
                  <NormalPrice price={totalPrice} quantity={currentQuantity} />
                </s>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm font-medium">
                  {discount * 100}% OFF
                </span>
              </>
            ) : (
              <span className="text-xl font-semibold">
                <NormalPrice price={totalPrice} quantity={currentQuantity} />
              </span>
            )}
          </div>

          <div className="flex justify-between items-center py-4 border-t border-b">
            <div className="flex items-center text-primary">
              <span className="text-base md:text-lg font-medium">Check Store Availability</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </div>

            <div className="text-right">
              <span className="text-green-600 font-medium">In Stock</span>
              {productsWithIP20Text.includes(ProductId) && (
                <div className="text-destructive text-[13px] font-medium">(Available only in IP20)</div>
              )}
              {productsWithMaxIpText.includes(ProductId) && (
                <div className="text-destructive text-[13px] font-medium">(Available only in IP20, IP44, IP54)</div>
              )}
              {sectionTypes.includes("outdoor") && (
                <div className="text-destructive text-[13px] font-medium">(Available only in IP65, IP68)</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-neutral-900 border-t shadow-lg p-4 md:relative md:bg-transparent md:border-0 md:shadow-none md:p-0 md:mt-6">
        <div className="flex items-center gap-4 max-w-md mx-auto md:max-w-none">
          <div className="flex items-center border rounded-lg">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDecreaseQuantity}
              className="h-12 w-12"
              disabled={currentQuantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-4 py-2 min-w-[3rem] text-center font-medium">{currentQuantity}</span>
            <Button size="icon" variant="ghost" onClick={handleIncreaseQuantity} className="h-12 w-12">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button disabled={isPending} onClick={handleAddToBag} className="flex-1 h-12 text-base">
            {isPending ? "Adding..." : "Add to Cart"}
            <AddToCardIcon Fill="currentColor" width={20} height={20} className="ml-2" />
          </Button>
        </div>
        <Button
          disabled={isClicked}
          variant="outline"
          onClick={handleOrderNow}
          className="w-full mt-3 h-12 bg-transparent text-base"
        >
          {isClicked ? "Processing Order..." : "Order Now"}
        </Button>
      </div>
      <div className="mt-8 mb-20 md:mb-0">
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <p className="text-muted-foreground leading-relaxed text-base">{createProductDescriptionFull()}</p>
      </div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Order Notification</DialogTitle>
            <DialogDescription>
              We noticed that you&apos;re ordering 10 or more of this product. For the best offer, please contact our
              sales team.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Close</Button>
            </DialogClose>
            <Link
              href="tel:+1154466259"
              onClick={() => setShowDialog(false)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md inline-flex items-center"
            >
              Contact Sales Team
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProductMainInfo