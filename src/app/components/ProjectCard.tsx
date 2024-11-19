import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProjectData {
    ProjectName: string;
    ProjectImages: string[];
    ProjectDate: string;
    ProjectDescription: string;
    ProjectId: string;
}

interface ProjectCardProps {
    project: ProjectData;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    return (
        <div className="projectCard w-full md:w-[48%] lg:w-[30%] mb-6 md:mb-8">
            <Link href={`/All-Projects/${project.ProjectId}`} className="relative block rounded overflow-hidden">
                <div className="absolute top-0 left-0 py-2 px-3 bg-gray-50 text-gray-600 z-10 dark:bg-neutral-900 dark:text-gray-50 text-xs">
                    {project.ProjectDate}
                </div>
                <Image
                    src={project.ProjectImages[0]}
                    alt={project.ProjectName}
                    className="w-full h-[200px] sm:h-[300px] lg:h-[280px] object-cover"
                    width={450} height={450}
                />
            </Link>
            <div className="flex flex-col items-center justify-center mt-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {project.ProjectDate}
                </h3>
                <h4 className="text-center text-sm text-muted-foreground max-w-[85%] lg:max-w-[90%] mx-auto">
                    {project.ProjectDescription}
                </h4>
            </div>
        </div>
    );
};

export default ProjectCard;
