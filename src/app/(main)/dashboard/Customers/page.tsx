import { db } from "@/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import CustomersClient from "./CustomersClient";

const Customers = async () => {
    const { userId } = auth();
    const user = await currentUser();
    if (!userId || !user) {
        console.log("User Not Found");
        return notFound();
    }
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    if (user.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
        console.log("User Not Authorized, redirecting to 404");
        return notFound();
    }
    const users = await db.user.findMany({
        include: {
            shippingAddress: true,
        },
        orderBy: { createdAt: "desc" },
    });
    return (
        <div>
            <CustomersClient users={users} />
        </div>
    );
};

export default Customers;