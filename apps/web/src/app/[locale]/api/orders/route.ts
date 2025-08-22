import { auth } from "@clerk/nextjs/server";
import { prisma, ProductSpecification } from "@repo/database";
import { addDays, format } from "date-fns";
import { enUS } from "date-fns/locale";
import { NextResponse } from "next/server";


interface RequestBody {
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
  ProductSpecifications: ProductSpecification
}
const calculateEstimatedDeliveryDate = () => {
  const currentDate = new Date();
  const estimatedDeliveryDate = addDays(currentDate, 8);
  return format(estimatedDeliveryDate, "dd MMM, yyyy", { locale: enUS });
};
export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 },
      );
    }
    const body: RequestBody = await request.json();
    console.log("Received order data:", body);
    const requiredFields: (keyof RequestBody)[] = [
      "productId",
      "productName",
      "quantity",
      "configPrice",
      "productPrice",
      "totalPrice",
      "configurationId",
      "shippingAddress",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 },
      );
    }
    const addressFields: (keyof RequestBody["shippingAddress"])[] = [
      "fullName",
      "address",
      "city",
      "state",
      "country",
      "phoneNumber",
    ];
    const missingAddressFields = addressFields.filter(
      (field) => !body.shippingAddress[field],
    );
    if (missingAddressFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required shipping address fields: ${missingAddressFields.join(", ")}`,
        },
        { status: 400 },
      );
    }
    const product = await prisma.product.findUnique({
      where: { id: body.productId },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const shippingAddress = await prisma.shippingAddress.upsert({
      where: { userId: userId },
      update: {
        ...body.shippingAddress,
      },
      create: {
        userId: userId,
        ...body.shippingAddress,
      },
    });
    const discountRate = product.discount;
    const discountedPrice =
      discountRate > 0
        ? Math.ceil(body.configPrice * (1 - discountRate))
        : body.configPrice;
    const discountApplied = discountRate > 0;
    const order = await prisma.order.create({
      data: {
        user: { connect: { id: userId } },
        configuration: { connect: { id: body.configurationId } },
        product: { connect: { id: body.productId } },
        quantity: body.quantity,
        productPrice: body.productPrice,
        discountRate: discountRate,
        discountedPrice: discountedPrice,
        discountApplied: discountApplied,
        totalPrice: body.totalPrice,
        productName: body.productName,
        productImages: body.productImages,
        shippingPrice: body.shippingPrice,
        status: "awaiting_shipment",
        shippingAddress: { connect: { id: shippingAddress.id } },
        productColorTemp: product.productColor || "warm",
        productIp: product.productIp || "IP20",
        productChandLamp: product.productChandLamp || "lamp9w",
        brand: product.brand,
        chandelierLightingType: product.chandelierLightingType,
        configPrice: body.configPrice,
        orderTimeReceived: new Date(calculateEstimatedDeliveryDate()),
      },
    });
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 },
    );
  }
}
