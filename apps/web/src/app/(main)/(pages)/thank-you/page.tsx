
import { constructMetadata } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ThankYouPage from "./ThankYouPage";
import { prisma } from "@repo/database";
interface ThankYouProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}
const Page = async ({ searchParams }: ThankYouProps) => {
  const { orderId } = await searchParams;
  if (!orderId || typeof orderId !== "string") {
    return notFound();
  }
  const order = await prisma.order.findUnique({
    where: { id: parseInt(orderId, 10) },
    include: {
      configuration: true,
      product: true,
      shippingAddress: true,
    },
  });
  if (!order) {
    return notFound();
  }
  return (
    <ThankYouPage discount={order.configuration.discount} />
  );
};

export async function generateMetadata({
  searchParams,
}: ThankYouProps): Promise<Metadata> {
  const { orderId } = await searchParams;
  if (!orderId || typeof orderId !== "string") {
    return notFound();
  }
  const order = await prisma.order.findUnique({
    where: { id: parseInt(orderId, 10) },
    include: {
      configuration: true,
      product: true,
      shippingAddress: true,
    },
  });
  if (!order) {
    return notFound();
  }

  const productName = order.product.productName;
  const customerName = order.shippingAddress?.fullName;
  const productImage = order.productImages[0];

  return constructMetadata({
    title: `Thank you, ${customerName}! Your order is confirmed`,
    description: `Thank you for ordering ${productName}. Your order #${order.id} has been successfully placed and is being processed.`,
    image: productImage,
  });
}

export default Page;
