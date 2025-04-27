import { db } from "@/db";
import Dashboard from "./dashboardPage";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
const Page = async () => {
  const { userId } = auth();
  const user = await currentUser();

  if (!userId || !user) {
    return redirect("/404");
  }

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (user.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
    console.log("User not authorized, redirecting to 404");
    return redirect("/404");
  }
  const discountData = await db.configuration.findFirst({
    select: { discount: true },
  });
  return <Dashboard discount={discountData?.discount || 0} />;
};
export default Page;
