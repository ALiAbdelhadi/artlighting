import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Dashboard from "./dashboard-page";

const Page = async () => {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return redirect("/404");
  }

  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  if (user.emailAddresses[0]?.emailAddress !== ADMIN_EMAIL) {
    return redirect("/404");
  }

  return <Dashboard />;
};

export default Page;
