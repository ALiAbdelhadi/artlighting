import DashboardHeader from "@/components/dashboard-header";
import { requireAdmin, AdminAuthError } from "@/lib/auth";
import { prisma } from "@repo/database";
import { notFound } from "next/navigation";
import ProductEditor from "./product-editor";

const ProductDetailPage = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  let admin;
  try {
    admin = await requireAdmin();
  } catch (err) {
    if (err instanceof AdminAuthError) return notFound();
    throw err;
  }

  const { productId } = await params;

  const [product, categories, discounts, priceHistory] = await Promise.all([
    prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: { orderBy: { order: "asc" } },
        variants: true,
        category: true,
        lightingtype: true,
        translations: true,
        specifications: true,
      },
    }),
    prisma.category.findMany({ orderBy: [{ parentId: "asc" }, { order: "asc" }] }),
    prisma.discount.findMany({
      where: { productId, isActive: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.priceHistory.findMany({
      where: { productId },
      orderBy: { changedAt: "desc" },
      take: 10,
    }),
  ]);

  if (!product) return notFound();

  const topCategories = categories.filter((c) => c.parentId === null);
  const childCategories = categories.filter((c) => c.parentId !== null);

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <DashboardHeader Route={product.productName} />
      <div className="mt-8">
        <ProductEditor
          product={product}
          topCategories={topCategories}
          childCategories={childCategories}
          discounts={discounts}
          priceHistory={priceHistory}
          isOwner={admin.role === "owner"}
        />
      </div>
    </div>
  );
};

export default ProductDetailPage;
