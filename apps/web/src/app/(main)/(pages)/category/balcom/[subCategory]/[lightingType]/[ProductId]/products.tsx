"use client"

import ColorTemperatureSection from "@/components/color-temperature-section"
import ProductCard from "@/components/product-card/product-card"
import ProductFeatures from "@/components/product-features"
import ProductImages from "@/components/product-images"
import ProductMainInfo from "@/components/product-main-Info"
import ProductSpecifications from "@/components/product-specifications-table"
import { ConfigurationData, ProductWithRelations, SpecificationsTable } from "@/types/products"
import type { Order, OrderStatus } from "@repo/database"
import { Container } from "@repo/ui"
import { motion, type Variants } from "framer-motion"
import * as React from "react"
import { useState } from "react"

interface ProductClientComponentProps {
  children: React.ReactNode
  product: ProductWithRelations
  configuration?: ConfigurationData
  relatedProducts: ProductWithRelations[]
}
interface ProductCardProps {
  ProductId: string
  productName: string
  price: number
  discount?: number
  productImages: string[]
  Brand: string
  ChandelierLightingType?: string
  sectionType: string
  maximumWattage?: number
  mainMaterial?: string
  beamAngle?: string
  spotlightType?: string
  luminousFlux?: string
  colorTemperature?: string
  lifeTime?: string
  energySaving?: string
  cri?: string
  brandOfLed?: string
  electrical?: string
  finish?: string
  input?: string
  lampBase?: string
  ip?: number
  hNumber?: number
  // Add other required properties as needed
}

const pageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export default function ProductClientComponent({
  children,
  product,
  relatedProducts,
  configuration,
}: ProductClientComponentProps) {
  const [quantity, setQuantity] = useState(1)

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const order: Order = {
    id: 0,
    userId: "",
    productId: product.productId,
    productName: product.productName,
    productImages: product.productImages,
    productColorTemp: product.productColor || "warm",
    productIp: product.productIp || "IP20",
    productChandLamp: product.productChandLamp || "lamp9w",
    quantity: quantity,
    isCompleted: false,
    status: "awaiting_shipment" as OrderStatus,
    createdAt: new Date(),
    updatedAt: new Date(),
    configurationId: configuration?.id || "",
    productPrice: product.price,
    discountedPrice: null,
    discountApplied: false,
    discountRate: null,
    totalPrice: product.price * quantity,
    configPrice: configuration?.configPrice || product.price,
    priceIncrease: configuration?.priceIncrease || 0,
    Brand: product.Brand,
    ChandelierLightingType: product.ChandelierLightingType || "",
    shippingPrice: 69,
    shippingAddressId: null,
    OrderTimeReceived: null,
  }

  const specificationsTable: { [key: string]: string } = {
    Input: product.input || "",
    "Maximum wattage": product.maximumWattage?.toString() || "",
    "Brand Of Led": product.brandOfLed || "",
    "Luminous Flux": product.luminousFlux || "",
    "Main Material": product.mainMaterial || "",
    CRI: product.cri || "",
    "Beam Angle": product.beamAngle || "",
    "Working Temperature": product.workingTemperature || "",
    "Fixture Dimmable": product.fixtureDimmable || "",
    Electrical: product.electrical || "",
    "Power Factor": product.powerFactor || "",
    "Color Temperature": product.colorTemperature || "",
    IP: product.ip?.toString() || "",
    "Energy Saving": product.energySaving || "",
    "Life Time": product.lifeTime || "",
  }

  // Function to transform ProductWithRelations to ProductCardProps
  const transformToProductCardProps = (relatedProduct: ProductWithRelations): ProductCardProps => {
    return {
      ProductId: relatedProduct.productId,
      productName: relatedProduct.productName,
      price: relatedProduct.price,
      discount: relatedProduct.discount,
      productImages: relatedProduct.productImages,
      Brand: relatedProduct.Brand,
      ChandelierLightingType: relatedProduct.ChandelierLightingType || "",
      sectionType: relatedProduct.sectionType,
      maximumWattage: relatedProduct.maximumWattage ?? undefined,
      mainMaterial: relatedProduct.mainMaterial ?? undefined,
      beamAngle: relatedProduct.beamAngle ?? undefined,
      luminousFlux: relatedProduct.luminousFlux ?? undefined,
      colorTemperature: relatedProduct.colorTemperature ?? undefined,
      lifeTime: relatedProduct.lifeTime ?? undefined,
      energySaving: relatedProduct.energySaving ?? undefined,
      cri: relatedProduct.cri ?? undefined,
      brandOfLed: relatedProduct.brandOfLed ?? undefined,
      electrical: relatedProduct.electrical ?? undefined,
      finish: relatedProduct.finish || undefined,
      input: relatedProduct.input || undefined,
      lampBase: relatedProduct.lampBase || undefined,
      ip: relatedProduct.ip ?? undefined,
      hNumber: relatedProduct.hNumber ?? undefined,
    }
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
      {children}
      <div className="py-8 md:py-16">
        <Container>
          <div className="space-y-12">
            <div className="flex items-start gap-8">
              <ProductImages productImages={product.productImages} />
              <ProductMainInfo
                productName={product.productName}
                price={product.price}
                quantity={quantity}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                specificationsTable={specificationsTable}
                ProductId={product.productId}
                configId={configuration?.id || product.id}
                discount={product.discount}
                order={order}
                colorTemperature={product.colorTemperature || ""}
                Brand={product.Brand}
                ChandelierLightingType={product.ChandelierLightingType || ""}
                hNumber={product.hNumber}
                configuration={configuration}
                sectionTypes={[product.sectionType]}
                sectionType={product.sectionType}
                maximumWattage={product.maximumWattage || 0}
                mainMaterial={product.mainMaterial || ""}
                beamAngle={product.beamAngle || ""}
                spotlightType={product.spotlightType}
                luminousFlux={product.luminousFlux || ""}
                lifeTime={product.lifeTime || ""}
                energySaving={product.energySaving || ""}
                cri={product.cri || ""}
                brandOfLed={product.brandOfLed || ""}
                electrical={product.electrical || ""}
                finish={product.finish || undefined} // Convert null to undefined
                input={product.input || undefined} // Convert null to undefined
                lampBase={product.lampBase || undefined} // Convert null to undefined
                ip={product.ip || 20}
              />
            </div>

            <div className="space-y-12">
              <ProductSpecifications
                specificationsTable={specificationsTable}
                Brand={product.Brand}
                ChandelierLightingType={product.ChandelierLightingType || undefined}
                hNumber={product.hNumber}
                sectionType={product.sectionType}
              />
              <ProductFeatures specificationsTable={specificationsTable} />
              <ColorTemperatureSection specificationsTable={{
                ...specificationsTable,
                "Color Temperature": specificationsTable["Color Temperature"] || ""
              } as SpecificationsTable} />
              {/* Related Products Section */}
              <section className="space-y-8">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl md:text-3xl font-semibold">Related Products</h2>
                  {relatedProducts.length > 0 ? (
                    <p className="text-muted-foreground text-lg">Products you might also like</p>
                  ) : (
                    <p className="text-muted-foreground text-lg">No related products found</p>
                  )}
                </div>
                {relatedProducts.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {relatedProducts.map((relatedProduct) => (
                      <ProductCard
                        key={relatedProduct.productId}
                        product={transformToProductCardProps(relatedProduct)}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </Container>
      </div>
    </motion.div>
  )
}