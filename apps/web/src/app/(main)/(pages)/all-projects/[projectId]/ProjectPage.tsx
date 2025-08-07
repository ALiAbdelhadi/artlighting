"use client";
import { Container } from "@repo/ui";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import projectsData from "../../../../../data/projects-details.json";

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
const projectsDataTyped = projectsData as ProjectsData;


export default function ProjectPage({ children }: { children?: React.ReactNode }) {

  const { projectId } = useParams() as { projectId: string };
  console.log("Project ID from URL:", projectId);
  console.log("Projects Data:", projectsData);
  if (!projectId) {
    return <div>Project not found.</div>;
  }
  const project = projectsDataTyped.projects[projectId];
  if (!project) {
    return <div>Project not found. ProjectId: {projectId}</div>;
  }
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
    <motion.div initial="hidden" animate="visible" variants={variants}>
      {children}
      <div className="py-6">
        <Container>
          <div>
            <div className="space-y-3">
              <p className="text-muted-foreground">{project.ProjectDate}</p>
              <h1 className="font-medium lg:text-4xl md:text-2xl text-lg">
                {project.ProjectDescription}
              </h1>
              <p className="mb-5 -mt-1 md:text-lg text-sm tracking-wide text-muted-foreground">
                {project.ProjectInfor}
              </p>
            </div>
            <Image
              src={project.ProjectImages[0]}
              alt={project.ProjectName}
              className="w-full lg:h-[43rem] h-auto rounded-md"
              height={688}
              width={1450}
            />
            <p className="my-5 md:text-lg text-sm tracking-wide text-muted-foreground">
              {project.ProjectDescription}
            </p>
            <div className="space-y-2 my-4 mb-6">
              <p className="text-lg text-gray-700 tracking-wide">
                Lighting: <span>Art Lighting</span>
              </p>
              <p className="text-lg text-gray-700 tracking-wide">
                Project: <span>{project.ProjectName}</span>
              </p>
              {project.usedProducts && project.usedProducts && (
                <Link
                  className="text-lg tracking-wide underline mt-5"
                  href={project.usedProducts}
                >
                  Products that we used in this project
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {project.ProjectImages[1] && (
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={project.ProjectImages[1]}
                    alt={project.ProjectName}
                    width={500}
                    height={250}
                    quality={100}
                    className="object-cover h-full w-full transition-transform duration-500 hover:scale-105"
                  />
                </div>
              )}
              {project.ProjectImages[2] && (
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <Image
                    src={project.ProjectImages[2]}
                    alt={project.ProjectName}
                    width={500}
                    height={250}
                    quality={100}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  />
                </div>
              )}
            </div>
            {project.ProjectInfor2 && (
              <p className="my-5 md:text-lg text-sm tracking-wide text-muted-foreground">
                {project.ProjectInfor2}
              </p>
            )}
            {project.ProjectImages[3] && (
              <Image
                src={project.ProjectImages[3]}
                alt={project.ProjectName}
                className="w-full lg:h-[43rem] h-auto rounded-md"
                height={688}
                width={1450}
              />
            )}
            {project.ProjectImages[4] && (
              <Image
                src={project.ProjectImages[4]}
                alt={project.ProjectName}
                className="w-full lg:h-[43rem] h-auto rounded-md"
                height={688}
                width={1450}
              />
            )}
          </div>
        </Container>
      </div>
    </motion.div>
  );
};
