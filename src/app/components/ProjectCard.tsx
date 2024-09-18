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
        <div className="relative w-full h-full">
            <Link href={`/All-Projects/${project.ProjectId}`} className="relative block">
                <div className="absolute top-0 left-0 py-2 px-3 bg-gray-50 text-gray-600 z-10 dark:bg-neutral-900 dark:text-gray-50 text-xs">{project.ProjectDate}</div>
                <img src={project.ProjectImages[0]} alt={project.ProjectName}
                    className="w-[600px] md:h-[280px] h-[200]" />
            </Link>
            <div className="flex flex-col items-center justify-center mt-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{project.ProjectDate}</h3>
                <h4 className="text-center text-muted-foreground ">{project.ProjectDescription}</h4>
            </div>
        </div>
    );
};

export default ProjectCard;
