import { db } from "@/db";
import { constructMetadata } from "@/lib/utils";
import { notFound } from 'next/navigation';
import CompletePage from "./CompletePage";
interface CompleteProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}
const page = async ({ searchParams }: CompleteProps) => {
    const { orderId } = searchParams
    if (!orderId || typeof orderId !== "string") {
        return notFound();
    }
    const order = await db.order.findUnique({
        where: { id: parseInt(orderId, 10) },
        include: {
            configuration: true,
            product: true,
        }
    });
    if (!order) {
        return notFound()
    }
    return (
        <CompletePage discount={order.configuration?.discount || 0} Brand={order.product.Brand} ChandelierLightingType={order.product.ChandelierLightingType} />
    )
}
export const metadata = constructMetadata({title: "Order Confirmed!", description: "Please Review you order before completed"})
export default page