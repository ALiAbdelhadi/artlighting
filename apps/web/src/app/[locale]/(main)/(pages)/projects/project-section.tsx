import projectsDetailsAr from "@/data/projects-details-ar.json";
import projectsDetailsEn from "@/data/projects-details-en.json";
import { PagePropsTypes } from "@/types";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ProjectsClient from "./project-client";

interface Project {
    ProjectId: string;
    ProjectName: string;
    ProjectDate: string;
    ProjectImages: string[];
    ProjectDescription: string;
    ProjectInfor?: string;
    ProjectInfor2?: string;
    usedProducts?: string;
}

interface ProjectsData {
    projects: Record<string, Project>;
}


const ProjectsSection = async ({ params }: PagePropsTypes) => {
    const { locale } = await params;
    const supportedLocales = ['ar', 'en'];

    if (!supportedLocales.includes(locale)) {
        notFound();
    }

    const t = await getTranslations("news-projects");
    const projectsData = (locale === 'ar'
        ? (projectsDetailsAr as ProjectsData).projects
        : (projectsDetailsEn as ProjectsData).projects) || {};

    const featuredProjectIds = [
        "dar-misr",
        "tolip",
        "al-majd",
        "mansoura-hospital",
        "esna-hospital",
        "al-galala-resort",
        "almaza-park",
        "al-galala-university"
    ];

    const getProjectData = (projectId: string): Project | null => {
        try {
            const projectData = projectsData[projectId];
            if (!projectData) {
                console.warn(`Project ${projectId} not found in ${locale} data file`);
                return null;
            }
            return projectData;
        } catch (error) {
            console.error(`Error loading project data for ${projectId}:`, error);
            return null;
        }
    };

    try {
        const projects: Project[] = featuredProjectIds
            .map(projectId => getProjectData(projectId))
            .filter((project): project is Project => {
                return project !== null &&
                    project.ProjectName !== `Project ${project.ProjectId}` &&
                    project.ProjectName.trim() !== "";
            })
            .slice(0, 8);

        const sectionTitle = t("title");
        const sectionDescription = t("description");
        const exploreAllText = t("exploreAllProjects");

        return (
            <ProjectsClient
                projects={projects}
                locale={locale}
                sectionTitle={sectionTitle}
                sectionDescription={sectionDescription}
                exploreAllText={exploreAllText}
            />
        );
    } catch (error) {
        console.error('Projects section data fetching error:', error);
        return (
            <ProjectsClient
                projects={[]}
                locale={locale}
                sectionTitle={t("title")}
                sectionDescription={t("description")}
                exploreAllText={t("exploreAllProjects")}
            />
        );
    }
};

export default ProjectsSection;