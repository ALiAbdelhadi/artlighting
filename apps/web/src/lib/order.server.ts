import type { Order, ShippingAddress } from "@/types/products";
import { prisma } from "@repo/database";

export interface CreateOrderDTO {
    userId: string;
    productId: string;
    productName: string;
    productImages: string[];
    quantity: number;
    configPrice: number;
    productPrice: number;
    totalPrice: number;
    shippingMethod: string;
    shippingPrice: number;
    configurationId: string;
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
        phoneNumber: string;
    };
}

export class OrderService {
    static async createOrder(dto: CreateOrderDTO): Promise<Order> {
        const product = await prisma.product.findUnique({
            where: { id: dto.productId },
        });

        if (!product) {
            throw new Error("Product not found");
        }

        const shippingAddress = await this.upsertShippingAddress(dto.userId, dto.shippingAddress);

        const discountRate = product.discount;
        const discountedPrice = discountRate > 0
            ? Math.ceil(dto.configPrice * (1 - discountRate))
            : dto.configPrice;

        return prisma.order.create({
            data: {
                user: { connect: { id: dto.userId } },
                configuration: { connect: { id: dto.configurationId } },
                product: { connect: { id: dto.productId } },
                quantity: dto.quantity,
                productPrice: dto.productPrice,
                discountRate,
                discountedPrice,
                discountApplied: discountRate > 0,
                totalPrice: dto.totalPrice,
                productName: dto.productName,
                productImages: dto.productImages,
                shippingPrice: dto.shippingPrice,
                status: "awaiting_shipment",
                shippingAddress: { connect: { id: shippingAddress.id } },
                productColorTemp: product.productColor || "warm",
                productIp: product.productIp || "IP20",
                productChandLamp: product.productChandLamp || "lamp9w",
                brand: product.brand,
                chandelierLightingType: product.chandelierLightingType,
                configPrice: dto.configPrice,
            },
        });
    }

    private static async upsertShippingAddress(
        userId: string,
        addressData: CreateOrderDTO["shippingAddress"]
    ): Promise<ShippingAddress> {
        return prisma.shippingAddress.upsert({
            where: { userId },
            update: addressData,
            create: {
                userId,
                ...addressData,
            },
        });
    }

    static async getOrderWithDetails(orderId: number, userId: string, locale: string = "ar") {
        const order = await prisma.order.findFirst({
            where: { id: orderId, userId },
            include: {
                shippingAddress: true,
                product: {
                    include: {
                        specifications: { where: { language: locale } },
                        translations: { where: { language: locale } },
                    },
                },
                user: true,
                configuration: true,
            },
        });

        if (!order) {
            throw new Error("Order not found or unauthorized");
        }

        return order;
    }

    static async completeOrder(orderId: number): Promise<Order> {
        return prisma.order.update({
            where: { id: orderId },
            data: { isCompleted: true },
            include: { user: true, shippingAddress: true },
        });
    }
}