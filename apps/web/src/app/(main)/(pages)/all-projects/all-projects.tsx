"use client";
import { BentoGridItem } from "@/components/bento-grid-item";
import { Container } from "@repo/ui";
import ProjectExample from "@/components/project-example";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import projectsData from "../../../../data/projects-details.json";

interface ProjectProps {
  ProjectId: string;
  ProjectName: string;
  ProjectDate: string;
  ProjectImages: string[];
  ProjectDescription: string;
  ProjectInfor: string;
  ProjectInfor2: string;
  usedProducts: string;
}
interface ProjectsData {
  projects: {
    [key: string]: ProjectProps;
  };
}
const projectsDataTyped: ProjectsData = projectsData as ProjectsData;
export default function AllProject({ children }: { children: ReactNode }) {
  const variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.3,
      },
    },
  };
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className="sm:mt-0"
    >
      {children}
      <Container>
        <ProjectExample />
        <h2 className="lg:text-3xl text-2xl font-medium mb-4">
          Completed Projects
        </h2>
        <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1   gap-x-4 gap-y-8 pb-16">
          {Object.keys(projectsDataTyped.projects).map((projectKey) => {
            return (
              <BentoGridItem
                key={projectKey}
                project={projectsDataTyped.projects[projectKey]}
              />
            );
          })}
        </div>
      </Container>
    </motion.div>
  );
};

