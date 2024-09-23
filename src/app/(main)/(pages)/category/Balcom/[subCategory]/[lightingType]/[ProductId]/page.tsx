import Breadcrumb from "@/app/components/Breadcrumb/Breadcrumb";
import { db } from "@/db";
import { constructMetadata } from "@/lib/utils";
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ProductClientComponent from "./ProductClientComponent";
const getProductWattage = (productName: string): number => {
    if (!productName) return 0;
    const match = productName.match(/(\d+)(?:W)/);
    return match ? parseInt(match[1], 10) : 0;
};
export async function generateStaticParams() {
    const products = await db.product.findMany({
        select: {
            productId: true,
            category: {
                select: {
                    name: true,
                },
            },
            lightingtype: {
                select: {
                    name: true,
                },
            },
        },
    });
    return products.map((product) => ({
        subCategory: product.category.name,
        lightingType: product.lightingtype.name,
        ProductId: product.productId,
    }));
}
export default async function ProductPage({ params }: { params: { lightingType: string; ProductId: string; subCategory: string } }) {
    const { lightingType, ProductId, subCategory } = params;
    console.log('Params:', params);
    const product = await db.product.findFirst({
        where: {
            productId: ProductId,
            sectionType: subCategory,
            spotlightType: lightingType,
        },
        include: { category: true, lightingtype: true, },
    });
    console.log('Product:', product);
    if (!product) {
        console.log('Product not found');
        notFound();
    }
    const relatedProducts = await getRelatedProducts(product, subCategory);
    return (
        <Suspense fallback={<div>Loading...</div>}>
            {product && (
                <ProductClientComponent product={product} relatedProducts={relatedProducts}>
                    <Breadcrumb />
                </ProductClientComponent>
            )}
        </Suspense>
    );
}
export async function generateMetadata({ params }: { params: { subCategory: string, ProductId: string, lightingType: string } }): Promise<Metadata> {
    const { lightingType, ProductId, subCategory } = params;

    const product = await db.product.findFirst({
        where: {
            productId: ProductId,
            sectionType: subCategory,
            spotlightType: lightingType,
        },
        include: { category: true, lightingtype: true },
    });

    if (!product) {
        return constructMetadata({
            title: "Product Not Found",
            description: "The requested product could not be found.",
            icons: "/balcom.ico",
        });
    }
    const isOutdoor = product.maxIP && product.maxIP >= 65;
    const wattage = getProductWattage(product.productName);
    const title = `${product.productName} - ${wattage}W ${product.sectionType} ${product.lightingtype.name} | Lighting`;
    const description = `Discover the ${product.productName}, a ${wattage}W ${product.sectionType} ${product.lightingtype.name.toLowerCase()} perfect for ${product.category.name.toLowerCase()} applications. ${isOutdoor ? `With an IP rating of IP${product.maxIP}, it's ideal for outdoor use. ` : ''
        }Featuring a ${product.colorTemperature} color temperature and ${product.cri ? `CRI of ${product.cri}, ` : ''}this ${product.brandOfLed} LED light offers ${product.luminousFlux} lumens of brightness. Shop now at Balcom Lighting!`;
    return constructMetadata({
        title,
        description,
        icons: "/balcom.ico",
        image: product.productImages[0] || undefined
    });
}
const getRelatedProducts = async (product: any, subCategory: string) => {
    const currentWattage = getProductWattage(product.productName);
    const relatedProducts = await db.product.findMany({
        where: {
            sectionType: subCategory,
            productName: {
                contains: 'W',
            },
            productId: {
                not: product.productId,
            },
        },
    });
    return relatedProducts.filter((relatedProduct) => {
        const wattage = getProductWattage(relatedProduct.productName);
        return wattage >= currentWattage - 1 && wattage <= currentWattage + 2;
    });
};