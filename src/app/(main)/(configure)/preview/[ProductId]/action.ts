"use server";

import { db } from "@/db";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createOrder({ configId, quantity }: { configId: string, quantity: number }) {
    console.log("Starting createOrder function");
    try {
        const { userId } = auth();
        if (!userId) {
            console.error("User not authenticated");
            throw new Error("You need to be logged in");
        }

        const configuration = await db.configuration.findUnique({
            where: { id: configId },
        });
        if (!configuration) {
            console.error("Configuration not found");
            throw new Error("Configuration not found");
        }

        const product = await db.product.findUnique({
            where: { productId: configuration.ProductId },
        });
        if (!product) {
            console.error("Product not found");
            throw new Error("Product not found");
        }

        let dbUser = await db.user.findUnique({ where: { id: userId } });
        if (!dbUser) {
            const clerkUser = await clerkClient.users.getUser(userId);
            dbUser = await db.user.create({
                data: {
                    id: userId,
                    email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
                    phoneNumber: clerkUser.phoneNumbers[0]?.phoneNumber ?? "",
                },
            });
        }

        let shippingAddress = await db.shippingAddress.findFirst({
            where: { userId: userId },
        });
        if (!shippingAddress) {
            const clerkUser = await clerkClient.users.getUser(userId);
            shippingAddress = await db.shippingAddress.create({
                data: {
                    userId: userId,
                    fullName: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`,
                    address: "",
                    city: "",
                    state: "",
                    zipCode: "",
                    country: "",
                    phoneNumber: clerkUser.phoneNumbers[0]?.phoneNumber ?? "",
                },
            });
        }
        // Apply the discount using the reusable function
        const discountedPrice = configuration.price
        const shippingPrice = configuration.shippingPrice
        const finalPrice = discountedPrice * quantity +  shippingPrice;
        const order = await db.order.create({
            data: {
                userId: userId,
                configurationId: configId,
                productId: product.id,
                quantity: quantity,
                productPrice: configuration.price,
                discountRate: configuration.discount,
                discountedPrice: discountedPrice,
                totalPrice: finalPrice,
                productName: product.productName,
                productImages: product.productImages,
                status: "awaiting_shipment",
                shippingPrice: 69,
                shippingAddressId: shippingAddress.id,
                productColorTemp: product.productColor || "",
                productIp: product.productIp || "",
                productChandLamp: product.productChandLamp || "",
                Brand: product.Brand,
                ChandelierLightingType : product.ChandelierLightingType
            },
        });

        console.log("Order created successfully", {
            userId: userId,
            orderId: order.id,
            productId: product.id,
        });

        return { userId: userId, orderId: order.id, productId: product.id };
    } catch (error) {
        console.error("Error in createOrder:", error);
        throw error;
    }
}
