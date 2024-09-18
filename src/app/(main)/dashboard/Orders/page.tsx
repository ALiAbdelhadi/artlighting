import { db } from "@/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import OrdersClient from "./OrdersClient";

const OrdersPage = async () => {
    const { userId } = auth();
    const user = await currentUser();
    if (!userId || !user) {
        return notFound();
    }
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    if (user.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
        return notFound();
    }
    const orders = await db.order.findMany({
        where: { isCompleted: true },
        orderBy: { createdAt: "desc" },
        include: { user: true, shippingAddress: true, product: true },
    });
    const discountData = await db.configuration.findFirst({
        select: {discount: true}
    })
    const discount = discountData?.discount || 0
    return <OrdersClient orders={orders} discount={discount}  />;
};

export default OrdersPage;
