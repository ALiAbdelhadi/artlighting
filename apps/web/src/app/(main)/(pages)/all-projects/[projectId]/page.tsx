import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import { constructMetadata } from "@/lib/utils";
import React from "react";
import ProjectPage from "./ProjectPage";

export default function Page(){
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
