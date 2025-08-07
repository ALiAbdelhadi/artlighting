import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@repo/database";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import Dashboard from "./dashboard-page";

const Page = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return redirect("/404");
  }

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (user.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
    toast.error("User not authorized, redirecting to 404")
    return redirect("/404");
  }
  const discountData = await prisma.configuration.findFirst({
    select: { discount: true },
  });
  return <Dashboard discount={discountData?.discount || 0} />;
};
export default Page;
