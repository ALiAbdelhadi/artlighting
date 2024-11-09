import { db } from "@/db";
import { Metadata } from "next";
import { notFound } from 'next/navigation';
import PreviewPage from './PreviewPage';

interface PageProps {
    params: {
        ProductId: string;
    };
    searchParams: {
        [key: string]: string | string[] | undefined;
    };
}
const Page = async ({ params, searchParams }: PageProps) => {
    const { ProductId } = params;
    const { id } = searchParams;
    if (!ProductId && (!id || typeof id !== 'string')) {
        return notFound();
    }
    let configuration = null;
    if (ProductId) {
        configuration = await db.configuration.findFirst({
            where: { ProductId },

        });
    }
    if (!configuration && id && typeof id === 'string') {
        configuration = await db.configuration.findUnique({
            where: { id },
            include: {
                product: true,
            }
        });
    }
    if (!configuration) {
        return notFound();
    }
    return (
        <PreviewPage configuration={configuration} discount={configuration.discount} />
    );
};
export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
    const product = await db.product.findFirst({
        where: { productId: params.ProductId }
    });
    let typeOfSpotlight
    let titleToSectionType;
    if (product?.sectionType === "IndoorLighting") {
        titleToSectionType = "Indoor lighting";
        typeOfSpotlight = "Ideal for homes and offices"
    } else if (product?.sectionType === "OutdoorLighting") {
        titleToSectionType = "Outdoor lighting";
        typeOfSpotlight = "Create the perfect ambiance for outdoor entertaining"
    } else if (product?.sectionType === "Chandelier") {
        titleToSectionType = "Chandelier";
        typeOfSpotlight = "A chandelier is a branched, decorative lighting fixture designed to be hung from the ceiling."
    }
    return {
        title: `Preview ${product?.productName || 'Unknown Product'} LED Spotlight | ${product?.Brand} | Energy Efficient ${titleToSectionType}`,
        description: `Preview of ${product?.productName || 'Unknown'} With a high CRI ${product?.cri} , and high beam angle of ${product?.beamAngle} this spotlight provides bright, ${typeOfSpotlight}`
    };
};


export default Page;
