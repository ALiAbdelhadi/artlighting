import { notFound } from 'next/navigation'
import { db } from '../../../../../db/index'
import CustomersPageClient from './CustomersPageClient'

const CustomerPage = async ({ params }: { params: { customerId: string } }) => {
    console.log("Received params:", params);
    console.log("Searching for user with ID:", params.customerId);

    try {
        const user = await db.user.findUnique({
            where: {
                id: params.customerId
            },
            include: {
                shippingAddress: true,
                product: true,
                orders: {
                    select: {
                        isCompleted: true
                    },
                    include: {
                        shippingAddress: true,
                        product: true,
                        user: true
                    },
                    orderBy: {
                        createdAt: "desc"
                    }
                }
            }
        });
        console.log("Database query result:", user);
        if (!user) {
            console.log("User not found!");
            return notFound();
        }
        console.log("Returning user data:", {
            id: user.id,
            email: user.email,
            shippingAddress: user.shippingAddress
        });
        return <CustomersPageClient user={user} />
    } catch (error) {
        console.error("Error fetching user:", error);
        return <div className="container mx-auto px-4 py-8 text-center">Error loading customer data.</div>
    }
}

export default CustomerPage