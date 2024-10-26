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

    try {
        const users = await db.user.findMany({
            select: {
                id: true,
                email: true,
                createdAt: true,
                shippingAddress: {
                    select: {
                        fullName: true,
                        phoneNumber: true,
                        address: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        console.log("Found users:", users.map(u => ({
            id: u.id,
            email: u.email
        })));

        return (
            <div>
                <CustomersClient users={users} />
            </div>
        );
    } catch (error) {
        console.error("Error fetching users:", error);
        return <div>Error loading customers</div>;
    }
};

export default Customers;