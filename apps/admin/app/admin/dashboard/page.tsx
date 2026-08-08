import { requireAdminOrRedirect } from "@/lib/auth";
import Dashboard from "./dashboard-page";

const Page = async () => {
  await requireAdminOrRedirect();

  return <Dashboard />;
};

export default Page;
