"use client";
import Container from "@/app/components/Container";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from 'next/navigation';
import { ReactNode } from "react";
import projectsData from "../../../../../../data/project.json";

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

const ProjectPage: React.FC<{ children: ReactNode }> = ({ children }) => {

    const { projectId } = useParams() as { projectId: string };
    console.log("Project ID from URL:", projectId);
    console.log("Projects Data:", projectsData);
    if (!projectId) {
        return <div>Project not found.</div>;
    }
    const project = projectsDataTyped.projects[projectId];
    if (!project) {
        return (
            <div>
                Project not found. ProjectId: {projectId}
            </div>
        );
    }
    const variants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                delay: 0.3
            }
        }
    };
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
        >
            {children}
                <Container>
                    <div>
                        <p className="text-muted-foreground">{project.ProjectDate}</p>
                        <h1 className="font-medium lg:text-4xl md:text-2xl text-lg">{project.ProjectDescription}</h1>
                        <p className="mb-5 -mt-1 md:text-lg text-sm tracking-wide text-muted-foreground">{project.ProjectInfor}</p>
                        <img
                            src={project.ProjectImages[0]}
                            alt={project.ProjectName}
                            className="w-full lg:h-[43rem] h-auto rounded-md"
                        />
                        <p className="my-5 md:text-lg text-sm tracking-wide text-muted-foreground">{project.ProjectDescription}</p>
                        <div className="space-y-2">
                            <p className="text-lg text-gray-600 tracking-wide">Lighting: <span>Art Lighting</span></p>
                            <p className="text-lg text-gray-600 tracking-wide">Project: <span>{project.ProjectName}</span>
                            </p>
                            <Link className="text-lg tracking-wide underline mt-5" href={project.usedProducts}>
                                Products that we used in this project
                            </Link>
                        </div>
                        <div
                            className="flex lg:flex-row flex-col justify-between items-center mt-10 md:space-y-0 space-y-7">
                            <img
                                src={project.ProjectImages[1]}
                                alt={project.ProjectName}
                                className="rounded-md h-[38rem] w-[44rem]"
                            />
                            <img
                                src={project.ProjectImages[2]}
                                alt={project.ProjectName}
                                className="rounded-md h-[38rem] w-[45rem]"
                            />
                        </div>
                        <p className="my-5 md:text-lg text-sm tracking-wide text-muted-foreground">{project.ProjectInfor2}</p>
                        <img
                            src={project.ProjectImages[1]}
                            alt={project.ProjectName}
                            className="w-full lg:h-[44rem] h-auto rounded-md"
                        />
                    </div>
                </Container>
        </motion.div>
    );
};

export default ProjectPage;
