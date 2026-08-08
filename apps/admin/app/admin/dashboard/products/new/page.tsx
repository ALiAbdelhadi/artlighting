import DashboardHeader from "@/components/dashboard-header";
import { requireAdminOrRedirect } from "@/lib/auth";
import { prisma } from "@repo/database";
import NewProductForm from "./new-product-form";

const NewProductPage = async () => {
  await requireAdminOrRedirect();

  const categories = await prisma.category.findMany({
    orderBy: [{ parentId: "asc" }, { order: "asc" }],
  });
  const topCategories = categories.filter((c) => c.parentId === null);
  const childCategories = categories.filter((c) => c.parentId !== null);

  return (
    <div className="flex flex-col min-h-screen pb-10">
      <DashboardHeader Route="New product" />
      <div className="mt-8">
        <NewProductForm topCategories={topCategories} childCategories={childCategories} />
      </div>
    </div>
  );
};

export default NewProductPage;
