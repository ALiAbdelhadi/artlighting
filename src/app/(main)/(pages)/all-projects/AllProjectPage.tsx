"use client";
import Container from "@/components/Container";
import ProjectExample from "@/components/ProjectExample";
import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";
import projectsData from "../../../../../data/project.json";
import Image from "next/image";
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
const AllProjectPage = ({ children }: { children: ReactNode }) => {
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
            const project = projectsDataTyped.projects[projectKey];
            return (
              <div className="relative w-full h-full" key={project.ProjectId}>
                <Link
                  href={`/all-projects/${project.ProjectId}`}
                  className="relative block"
                >
                  <div className="absolute top-0 left-0 py-2 px-3 bg-gray-50 text-gray-600 z-10 dark:bg-neutral-900 dark:text-gray-50 text-xs">
                    {project.ProjectDate}
                  </div>
                  <Image
                    src={project.ProjectImages[0]}
                    alt={project.ProjectName}
                    className="w-full md:h-[225px] h-[200px] rounded-md"
                    width={350} height={225}
                  />
                </Link>
                <div className="flex flex-col items-center justify-center mt-4">
                  <h3 className="text-sm font-medium text-primary mb-2">
                    {project.ProjectName}
                  </h3>
                  <h4 className="text-center text-muted-foreground ">
                    {project.ProjectDescription}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </motion.div>
  );
};

export default AllProjectPage;
