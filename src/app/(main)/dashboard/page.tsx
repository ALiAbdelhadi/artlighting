import { db } from "@/db";
import Dashboard from "./dashboardPage";
const Page = async () => {
  const discountData = await db.configuration.findFirst({
    select: { discount: true },
  });
  return <Dashboard discount={discountData?.discount || 0} />;
};
export default Page;
