import { constructMetadata } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ThankYou from "./thank-you";
import { prisma } from "@repo/database";
import { getLocale } from "next-intl/server";

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

  const locale = await getLocale();

  const order = await prisma.order.findUnique({
    where: { id: parseInt(orderId, 10) },
    include: {
      configuration: true,
      product: {
        include: {
          specifications: {
            where: {
              language: locale,
            },
          },
          translations: {
            where: {
              language: locale,
            },
          },
        },
      },
      shippingAddress: true,
    },
  });

  if (!order) {
    return notFound();
  }

  const discount = order.configuration?.discount ?? 0;

  const localizedProductName =
    order.product.translations[0]?.name || order.product.productName;

  const localizedOrder = {
    ...order,
    productName: localizedProductName,
    product: {
      ...order.product,
      productName: localizedProductName,
      translations: order.product.translations,
      specifications: order.product.specifications,
      maximumWattage: order.product.maximumWattage,
    },
  };

  return (
    <ThankYou
      discount={discount}
      initialOrder={localizedOrder}
    />
  );
};

export async function generateMetadata({
  searchParams,
}: ThankYouProps): Promise<Metadata> {
  const { orderId } = await searchParams;

  if (!orderId || typeof orderId !== "string") {
    return notFound();
  }

  const locale = await getLocale();

  const order = await prisma.order.findUnique({
    where: { id: parseInt(orderId, 10) },
    include: {
      configuration: true,
      product: {
        include: {
          specifications: {
            where: {
              language: locale,
            },
          },
          translations: {
            where: {
              language: locale,
            },
          },
        },
      },
      shippingAddress: true,
    },
  });

  if (!order) {
    return notFound();
  }

  const productName =
    order.product.translations[0]?.name || order.product.productName;
  const customerName = order.shippingAddress?.fullName;

  let productImage: string = locale === "ar" ? "/logo-ar.png" : "/logo-en.png";
  if (order.product?.productImages?.[0]) {
    productImage = order.product.productImages[0];
  }
  const titles: Record<string, string> = {
    en: `Thank you, ${customerName}! Your order is confirmed`,
    ar: `شكرًا لك، ${customerName}! تم تأكيد طلبك`,
  };

  const descriptions: Record<string, string> = {
    en: `Thank you for ordering ${productName}. Your order #${order.id} has been successfully placed and is being processed.`,
    ar: `شكرًا لطلبك ${productName}. تم تسجيل طلبك رقم #${order.id} بنجاح وهو قيد المعالجة.`,
  };

  return constructMetadata({
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    image: productImage,
  });
}

export default Page;
