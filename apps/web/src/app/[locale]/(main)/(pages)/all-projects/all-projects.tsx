"use client";
import { BentoGridItem } from "@/components/bento-grid-item";
import ProjectExample from "@/components/project-example";
import projectsDetailsAr from "@/data/projects-details-ar.json";
import projectsDetailsEn from "@/data/projects-details-en.json";
import { Container } from "@/components/container";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ProjectProps {
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
  projects: {
    [key: string]: ProjectProps;
  };
}

interface AllProjectProps {
  children: ReactNode;
  locale: string;
  allProjectsTitle: string;
  noProjectsText: string;
}

export default function AllProject({
  children,
  locale,
  allProjectsTitle,
  noProjectsText
}: AllProjectProps) {
  const projectsData = locale === 'ar' ? projectsDetailsAr : projectsDetailsEn;
  const projectsDataTyped: ProjectsData = projectsData as ProjectsData;
  const projects = projectsDataTyped?.projects || {};
  const projectKeys = Object.keys(projects);


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

  const texts = {
    ar: {
      completedProjects: allProjectsTitle || "المشاريع المنجزة",
      noProjects: noProjectsText || "لا توجد مشاريع متاحة"
    },
    en: {
      completedProjects: allProjectsTitle || "Completed Projects",
      noProjects: noProjectsText || "No projects available"
    }
  };
  console.log('AllProjects - Projects count:', projectKeys.length);
  console.log('AllProjects - Available projects:', projectKeys);
  const currentTexts = texts[locale as keyof typeof texts] || texts.en;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className="sm:mt-0"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      {children}
      <Container>
        <ProjectExample />
        <h2 className="lg:text-3xl text-2xl font-medium mb-4">
          {currentTexts.completedProjects}
        </h2>
        {projectKeys.length > 0 ? (
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-x-4 gap-y-8 pb-16">
            {projectKeys.map((projectKey) => {
              const project = projects[projectKey];
              if (!project || !project.ProjectName || project.ProjectName.trim() === '') {
                console.warn(`Invalid project data for key: ${projectKey}`, project);
                return null;
              }
              return (
                <BentoGridItem
                  key={project.ProjectId || projectKey}
                  project={project}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {currentTexts.noProjects}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Debug: Found {projectKeys.length} projects in {locale} locale
            </p>
          </div>
        )}
      </Container>
    </motion.div>
  );
}