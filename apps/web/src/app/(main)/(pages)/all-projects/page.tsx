import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import { constructMetadata } from "@/lib/utils";
import AllProjectPage from "./all-projects";

const Page = () => {
  return (
    <AllProjectPage>
      <Breadcrumb />
    </AllProjectPage>
  );
};
export const metadata = constructMetadata({
  title: "Explore all recent projects that we do in the last years",
  description: "Explore all recent projects that we do in the last years",
});
export default Page;
