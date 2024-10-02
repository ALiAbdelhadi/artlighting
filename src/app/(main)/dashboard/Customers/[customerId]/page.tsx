import React from 'react'
import dynamic from 'next/dynamic'
import { db } from '../../../../../db/index'

const CustomersPageClient = dynamic(() => import('./CustomersPageClient'), { ssr: false })

const CustomerPage = async ({ params }: { params: { userId: string } }) => {
    const user = await db.user.findFirst({
        where: {
            id: params.userId 
        },
        include: {
            shippingAddress: true,
            product: true,
            orders: {
                where: {
                    isCompleted: true
                },
                include: {
                    shippingAddress: true,
                    product: true,
                    user:true
                },
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    })

    if (!user) {
        return <div className="container mx-auto px-4 py-8 text-center">Customer not found.</div>
    }

    return <CustomersPageClient user={user} />
}

export default CustomerPage