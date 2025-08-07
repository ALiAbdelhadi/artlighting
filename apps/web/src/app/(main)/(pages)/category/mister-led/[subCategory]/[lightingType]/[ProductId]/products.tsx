"use client";
import ColorTemperatureSection from "@/components/color-temperature-section";
import { Container } from "@repo/ui";
import ProductFeatures from "@/components/product-features";
import ProductImagesForCh from "@/components/product-images-for-chand";
import ProductMainInfo from "@/components/product-main-Info";
import ProductSpecifications from "@/components/product-specifications-table";
import { Configuration, Order, OrderStatus, Product } from "@repo/database";
import { motion } from "framer-motion";
import { useState } from "react";

interface ProductClientComponentProps {
  children: React.ReactNode;
  product: Product & {
    category: { name: string };
    lightingtype: { name: string };
    configuration: Configuration;
  };
}

export default function ProductClientComponent({
  children,
  product,
}: ProductClientComponentProps) {
  const [quantity, setQuantity] = useState(1);
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
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };
  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };
  const order: Order = {
    id: 0,
    userId: "",
    productId: product.productId,
    productName: product.productName,
    productImages: product.productImages,
    productColorTemp: product.productColor ?? "",
    productIp: product.productIp ?? "",
    quantity: quantity,
    productChandLamp: product.productChandLamp ?? "",
    isCompleted: false,
    status: "awaiting_shipment" as OrderStatus,
    createdAt: new Date(),
    updatedAt: new Date(),
    configurationId: "",
    productPrice: product.price,
    discountedPrice: null,
    discountApplied: false,
    discountRate: null,
    totalPrice: product.price * quantity,
    shippingPrice: 69,
    shippingAddressId: null,
    priceIncrease: product.priceIncrease ?? null,
    Brand: product.Brand ?? null,
    ChandelierLightingType: product.ChandelierLightingType ?? null,
    configPrice: product.price,
    OrderTimeReceived: null,
  };
  const specificationsTable: { [key: string]: string } = {
    Input: product.input || "",
    "Maximum wattage": product.maximumWattage?.toString() || "",
    "Main Material": product.mainMaterial || "",
    "Color Temperature": product.colorTemperature || "",
    "Life Time": product.lifeTime || "",
    Finished: product.finish || "",
    "Lamp Base": product.lampBase || "",
    BULB: product.bulb || "",
  };
  return (
    <motion.div initial="hidden" animate="visible" variants={variants}>
      {children}
      <div className="py-16">
        <Container>
          <div>
            <div className="flex md:flex-row flex-col items-start">
              <ProductImagesForCh productImages={product.productImages} />
              <ProductMainInfo
                productName={product.productName}
                price={product.price}
                quantity={quantity}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
                specificationsTable={specificationsTable}
                ProductId={product.productId}
                configId={product.id}
                discount={product.discount}
                order={order}
                colorTemperature={"Color Temperature"}
                Brand={product.Brand}
                ChandelierLightingType={product.ChandelierLightingType ?? ""}
                hNumber={product.hNumber ?? 0}
                sectionTypes={[product.sectionType]}
                ip={0}
                maxIP={0}
                configuration={product.configuration}
                sectionType={product.sectionType}
                maximumWattage={product.maximumWattage || undefined}
                mainMaterial={product.mainMaterial || undefined}
                beamAngle={product.beamAngle || undefined}
                luminousFlux={product.luminousFlux || undefined}
                lifeTime={product.lifeTime || undefined}
                energySaving={product.energySaving || undefined}
                cri={product.cri || undefined}
                brandOfLed={product.brandOfLed || undefined}
                electrical={product.electrical || undefined}
                finish={product.finish || undefined}
                input={product.input || undefined}
                lampBase={product.lampBase || undefined}
              />
            </div>
            <ProductSpecifications
              specificationsTable={specificationsTable}
              productName={product.productName}
              Brand={product.Brand}
              ChandelierLightingType={product.ChandelierLightingType ?? ""}
              hNumber={product.hNumber ?? 0}
            />
            <ProductFeatures specificationsTable={specificationsTable} />
            <ColorTemperatureSection
              specificationsTable={{
                ...specificationsTable,
                "Color Temperature":
                  specificationsTable["Color Temperature"] || "",
              }}
            />
          </div>
        </Container>
      </div>
    </motion.div>
  );
};
