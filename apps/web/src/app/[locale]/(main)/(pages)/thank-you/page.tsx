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
              language: locale, // ✅ إضافة فلتر اللغة
            },
          },
          translations: {
            where: {
              language: locale, // ✅ إضافة فلتر اللغة
            },
          },
        }
      },
      shippingAddress: true,
    },
  });

  if (!order) {
    return notFound();
  }

  const discount = order.configuration?.discount ?? 0;

  const localizedProductName = order.product.translations[0]?.name || order.product.productName;
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

  // ✅ تمرير البيانات الأولية للكومبوننت
  return (
    <ThankYou
      discount={discount}
      initialOrder={localizedOrder} // ✅ تمرير البيانات الأولية
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

  // احصل على اللغة الحالية
  const locale = await getLocale();

  const order = await prisma.order.findUnique({
    where: { id: parseInt(orderId, 10) },
    include: {
      configuration: true,
      product: {
        include: {
          specifications: {
            where: {
              language: locale, // ✅ إضافة فلتر اللغة
            },
          },
          translations: {
            where: {
              language: locale, // ✅ إضافة فلتر اللغة
            },
          },
        }
      },
      shippingAddress: true,
    },
  });

  if (!order) {
    return notFound();
  }

  // استخدم الاسم المترجم إذا كان متاحاً
  const productName = order.product.translations[0]?.name || order.product.productName;
  const customerName = order.shippingAddress?.fullName;
  const productImage = order.productImages[0];

  return constructMetadata({
    title: `Thank you, ${customerName}! Your order is confirmed`,
    description: `Thank you for ordering ${productName}. Your order #${order.id} has been successfully placed and is being processed.`,
    image: productImage,
  });
}

export default Page;