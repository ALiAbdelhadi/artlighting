import { constructMetadata } from "@/lib/utils";
import { notFound } from "next/navigation";
import Complete from "./complete";
import { prisma } from "@repo/database";

interface CompleteProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}
const page = async ({ searchParams }: CompleteProps) => {
  const { orderId } = await searchParams;
  if (!orderId || typeof orderId !== "string") {
    return notFound();
  }
  const order = await prisma.order.findUnique({
    where: { id: parseInt(orderId, 10) },
    include: {
      configuration: true,
      product: true,
    },
  });
  if (!order) {
    return notFound();
  }
  return (
    <Complete
      discount={order.configuration?.discount || 0}
      Brand={order.product.Brand}
    />
  );
};
export const metadata = constructMetadata({
  title: "Order Confirmed!",
  description: "Please Review you order before completed",
});

export default page;
