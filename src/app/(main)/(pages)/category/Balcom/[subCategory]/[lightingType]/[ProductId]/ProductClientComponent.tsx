"use client";
import ColorTemperatureSection from "@/app/components/ColorTemperatureSection";
import Container from "@/app/components/Container";
import ProductCard from "@/app/components/ProductCard/ProductCard";
import ProductFeatures from "@/app/components/ProductFeatures";
import ProductImages from "@/app/components/ProductImages";
import ProductMainInfo from "@/app/components/ProductMainInfo";
import ProductSpecifications from "@/app/components/ProductSpecifications";
import { Order, OrderStatus, Product } from "@prisma/client";
import { motion } from 'framer-motion';
import { useState } from "react";

interface ProductClientComponentProps {
    children: React.ReactNode;
    product: Product & {
        category: { name: string };
        lightingtype: { name: string };
    };
    configuration?: {
        id: string;
        ProductId: string;
        configPrice: number;
        priceIncrease: number;
        shippingPrice: number;
        discount: number;
        quantity: number;
        lampPriceIncrease: number | null;
        totalPrice: number;
    }
    relatedProducts: Product[];
}

const ProductClientComponent: React.FC<ProductClientComponentProps> = ({ children, product, relatedProducts, configuration }) => {
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
        productColorTemp: product.productColor,
        productIp: product.productIp,
        quantity: quantity,
        isCompleted: false,
        status: "awaiting_shipment" as OrderStatus,
        createdAt: new Date(),
        updatedAt: new Date(),
        configurationId: "",
        productPrice: product.price,
        discountedPrice: null,
        discountApplied: false,
        discountRate: null,
        shippingPrice: 69,
        shippingAddressId: null,
        configPrice: configuration?.configPrice,
    };

    const specificationsTable = {
        Input: product.input || "",
        "Maximum wattage": product.maximumWattage || "",
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
        IP: product.ip || "",
        "Energy Saving": product.energySaving || "",
        "Life Time": product.lifeTime || "",
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
                            <ProductImages productImages={product.productImages} />
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
                                hNumber={product.hNumber || null}
                                configuration={configuration}
                                sectionTypes={product.sectionType}
                            />
                        </div>
                        <ProductSpecifications
                            specificationsTable={specificationsTable}
                            productName={product.productName}
                        />
                        <ProductFeatures
                            specificationsTable={specificationsTable}
                        />
                        <ColorTemperatureSection
                            specificationsTable={specificationsTable}
                        />
                        {/* Related Products Section */}
                        <section>
                            <div className="text-center">
                                <h2 className="text-[1.45rem] font-semibold mt-5">
                                    Related Products
                                </h2>
                                {relatedProducts.length > 0 ? (
                                    <p className="text-muted-foreground md:text-xl text-lg my-5">
                                        This is some products you may like
                                    </p>
                                ) : (
                                    <p className="text-muted-foreground md:text-xl text-lg my-5">
                                        No related products found
                                    </p>
                                )}
                            </div>
                            {relatedProducts.length > 0 && (
                                <div className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-4 justify-center items-center">
                                    {relatedProducts.map((relatedProduct) => (
                                        <ProductCard
                                            key={relatedProduct.productId}
                                            product={{
                                                ...relatedProduct,
                                                ProductId: relatedProduct.productId
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>
                </Container>
            </div>
        </motion.div>
    );
};

export default ProductClientComponent;