import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { constructMetadata } from "@/lib/utils";
import React from "react";
import ProjectPage from "./ProjectPage";

const Page: React.FC = () => {
  return (
    <ProjectPage>
      <Breadcrumb />
    </ProjectPage>
  );
};

export const metadata = constructMetadata({
  title: "Explore all recent projects that we do in the last years",
  description: "Explore all recent projects that we do in the last years",
});

export default Page;
