import { db } from "@/db";
import { constructMetadata } from "@/lib/utils";
import { notFound } from 'next/navigation';
import ConfirmPage from './ConfirmPage';
interface ConfirmProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}
const page = async ({ searchParams }: ConfirmProps) => {
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
        <ConfirmPage discount={order.configuration?.discount || 0} />
    )
}
export const metadata = constructMetadata({ title: "Confirm your order by typing all your info", description: "Review your order carefully and click 'Send data' to confirm. Once submitted" })
export default page