
import { cn } from "@repo/ui/lib/utils"
import Image from "next/image"
import Link from "next/link"

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

interface BentoGridItemProps {
    project: Project
    className?: string
}

export function BentoGridItem({ project, className }: BentoGridItemProps) {
    return (
        <Link
            href={`/all-projects/${project.ProjectId}`}
            className={cn(
                "group relative overflow-hidden rounded-xl bg-white border border-gray-200 hover:shadow-lg transition-all duration-300",
                "dark:bg-gray-900 dark:border-gray-800",
                className,
            )}
        >
            <div className="relative h-full">
                <div className="relative h-full overflow-hidden">
                    <Image
                        src={project.ProjectImages[0]}
                        alt={project.ProjectName}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2">{project.ProjectName}</h3>
                    <p className="text-sm text-gray-200 mb-2 line-clamp-2">{project.ProjectDescription}</p>
                    <p className="figureDate text-xs text-gray-300">{project.ProjectDate}</p>
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
        </Link>
    )
}
