import Breadcrumb from '@/app/components/Breadcrumb/Breadcrumb';
import { db } from '@/db';
import { constructMetadata } from '@/lib/utils';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import LightingTypePage from './LightingTypePage';

export async function generateStaticParams() {
    const products = await db.product.findMany({
        select: {
            productId: true,
            category: {
                select: {
                    name: true
                },
            },
            lightingtype: {
                select: {
                    name: true
                }
            }
        }
    })
    return products.map((product) => ({
        subCategory: product.category.name,
        lightingType: product.lightingtype.name,
    }));
}
export async function generateMetadata({ params }: { params: { subCategory: string, lightingType: string } }): Promise<Metadata> {

    const { subCategory, lightingType } = params;
    const products = await db.product.findMany({
        where: {
            Brand: 'Balcom',
            sectionType: subCategory,
            spotlightType: lightingType,
        },
    });
    if (!products.length) {
        notFound();
    }
    let title;
    let description;
    if (subCategory === "Indoor") {
        title = `Discover Balcom's ${subCategory} lighting solutions by offering ${lightingType}`;
        description = `Illuminate your interior spaces with our stylish and functional ${subCategory} lights. Explore our collection of ${lightingType} fixtures designed to enhance your home or office ambiance.`;
    } else if (subCategory === "Outdoor") {
        title = `Enhance Your Outdoor Living with Balcom's ${subCategory} Lighting by offering ${lightingType}`;
        description = `Create a captivating outdoor atmosphere with our durable and weather-resistant ${subCategory} lighting options. Explore our range of ${lightingType} fixtures perfect for patios, gardens, and more.`;
    }

    return constructMetadata({
        title,
        description,
        image: "/brand/balcom.jpeg",
        icons: "/balcom.ico"
    });
}
async function ProductPage({ params }: { params: { subCategory: string; lightingType: string } }) {
    if (!params || !params.subCategory || !params.lightingType) {
        return <div>Loading...</div>;
    }
    const { subCategory, lightingType } = params;
    const products = await db.product.findMany({
        where: {
            Brand: 'Balcom',
            sectionType: subCategory,
            spotlightType: lightingType,
        },
    })
    if (!products.length) {
        notFound()
    }
    return (
        <Suspense fallback={<div className='text-center text-lg'>Loading...</div>}>
            <LightingTypePage products={products} subCategory={subCategory} lightingType={lightingType}>
                <Breadcrumb />
            </LightingTypePage>
        </Suspense>
    )
}
export default ProductPage;