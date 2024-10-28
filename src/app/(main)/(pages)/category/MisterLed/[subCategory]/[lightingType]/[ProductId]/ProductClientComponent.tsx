"use client";
import ColorTemperatureSection from "@/app/components/ColorTemperatureSection";
import Container from "@/app/components/Container";
import ProductFeatures from "@/app/components/ProductFeatures";
import ProductImagesForCh from "@/app/components/ProductImagesForCh";
import ProductMainInfo from "@/app/components/ProductMainInfo";
import ProductSpecifications from "@/app/components/ProductSpecifications";
import { Order, OrderStatus, Product, Configuration } from '@prisma/client';
import { motion } from "framer-motion";
import { useState } from "react";
interface ProductClientComponentProps {
    children: React.ReactNode;
    product: Product &  {
        category: { name: string };
        lightingtype: { name: string };
        configuration: Configuration
    };
}

const ProductClientComponent: React.FC<ProductClientComponentProps> = ({ children, product }) => {
    const [quantity, setQuantity] = useState(1);
    const variants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.3
            }
        }
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
        productColorTemp: product.productColor ?? '',
        productIp: product.productIp ?? '',
        quantity: quantity,
        productChandLamp: product.productChandLamp ?? '',
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
        OrderTimeReceived: null
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
        hNumber: product.hNumber?.toString() || "",
        ChandelierLightingType: product.ChandelierLightingType ?? ""
    };
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
        >
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
                                sectionTypes={[product.sectionType]} ip={0} maxIP={0} configuration={product.configuration}
                                ChandelierLightingType={product.ChandelierLightingType ?? ""}
                                sectionType={product.sectionType}
                                maximumWattage={product.maximumWattage}
                                mainMaterial={product.mainMaterial}
                                beamAngle={product.beamAngle}
                                luminousFlux={product.luminousFlux}
                                lifeTime={product.lifeTime}
                                energySaving={product.energySaving}
                                cri={product.cri}
                                brandOfLed={product.brandOfLed}
                                electrical={product.electrical}
                                finish={product.finish}
                                input={product.input}
                                lampBase={product.lampBase}
                                />
                        </div>
                        <ProductSpecifications
                            specificationsTable={specificationsTable}
                            productName={product.productName}
                            Brand={product.Brand}
                            ChandelierLightingType={product.ChandelierLightingType ?? ""}
                            hNumber={product.hNumber ?? 0}
                        />
                        <ProductFeatures
                            specificationsTable={specificationsTable}
                        />
                        <ColorTemperatureSection
                            specificationsTable={{
                                ...specificationsTable,
                                "Color Temperature": specificationsTable["Color Temperature"] || ""
                            }}
                        />
                    </div>
                </Container>
            </div>
        </motion.div>
    );
};

export default ProductClientComponent;