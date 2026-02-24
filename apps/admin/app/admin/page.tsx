import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminClient from "./admin-client";

const AdminPage = async () => {
  const user = await currentUser();
  const { userId } = await auth();

  if (!userId || !user) {
    return redirect("/sign-in");
  }

  const isAdmin = user.emailAddresses?.[0]?.emailAddress === process.env.ADMIN_EMAIL;

  if (!isAdmin) {
    return redirect("/404");
  }

  return <AdminClient />;
};

export default AdminPage;