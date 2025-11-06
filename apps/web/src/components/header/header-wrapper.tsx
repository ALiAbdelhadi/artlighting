import projectsDetailsAr from "@/data/projects-details-ar.json"
import projectsDetailsEn from "@/data/projects-details-en.json"
import { notFound } from "next/navigation"
import Header from "./header"

interface Project {
    ProjectId: string
    ProjectName: string
    ProjectDate: string
    ProjectImages: string[]
    ProjectDescription: string
    ProjectInfor?: string
    ProjectInfor2?: string
    usedProducts?: string
}

interface ProjectsData {
    projects: Record<string, Project>
}

interface HeaderWrapperProps {
    locale: string
}

const HeaderWrapper = ({ locale }: HeaderWrapperProps) => {
    const supportedLocales = ["ar", "en"]

    if (!supportedLocales.includes(locale)) {
        notFound()
    }

    const projectsData =
        (locale === "ar" ? (projectsDetailsAr as ProjectsData).projects : (projectsDetailsEn as ProjectsData).projects) ||
        {}

    const headerProjectIds = ["dar-misr", "tolip", "al-majd", "mansoura-hospital", "esna-hospital", "armant-hospital"]

    const getProjectData = (projectId: string): Project | null => {
        try {
            const projectData = projectsData[projectId]
            if (!projectData) {
                console.warn(`Project ${projectId} not found in ${locale} data file`)
                return null
            }
            return projectData
        } catch (error) {
            console.error(`Error loading project data for ${projectId}:`, error)
            return null
        }
    }

    const projectsForHeader: Project[] = headerProjectIds
        .map((projectId) => getProjectData(projectId))
        .filter((project): project is Project => {
            return (
                project !== null && project.ProjectName !== `Project ${project.ProjectId}` && project.ProjectName.trim() !== ""
            )
        })

    return <Header projectsForHeader={projectsForHeader} />
}

export default HeaderWrapper
