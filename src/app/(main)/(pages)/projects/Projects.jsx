"use client"
import Container from "@/app/components/Container"
import ProjectCard from "@/app/components/ProjectCard.tsx"
import { cn } from '@/lib/utils'
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TextPlugin } from "gsap/TextPlugin"
import Link from "next/link"
import { useEffect, useState } from "react"
import "./projects.module.css"
const Projects = () => {
    const [projectData, setProjectData] = useState({})
    const [projectKeys, setProjectKeys] = useState([])
    useEffect(() => {
        const data = {
            "Project-four": {
                ProjectId: "Project-four",
                ProjectName: "Project four",
                ProjectDate: "10 / May / 23",
                ProjectImages: ["/projects/DAR-MISR/DAR-MISR-0.jpg"],
                ProjectDescription:
                    "Project: The ideal lighting solution for a Japandi interior style, Renesse (The Netherlands)"
            },
            "Project-one": {
                ProjectId: "Project-one",
                ProjectName: "Project one",
                ProjectDate: "10 / June / 22",
                ProjectImages: ["/projects/projectTest2.jpg"],
                ProjectDescription:
                    "Project: The ideal lighting solution for a Japandi interior style, Renesse (The Netherlands)"
            },
            "Project-six": {
                ProjectId: "Project-six",
                ProjectName: "Project six",
                ProjectDate: "10 / Dec / 24",
                ProjectImages: ["/projects/prjecttest3.jpg"],
                ProjectDescription:
                    "Project: The ideal lighting solution for a Japandi interior style, Renesse (The Netherlands)"
            }
        }
        setProjectData(data)
        setProjectKeys(Object.keys(data))
    }, [])
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger, TextPlugin)
        const projectCards = gsap.utils.toArray(".projectCard")
        const secondProjectCard = projectCards[1]
        gsap.fromTo(
            secondProjectCard,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: secondProjectCard,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                    once: true
                }
            }
        )
        gsap.fromTo(
            projectCards.filter((_, i) => i !== 1),
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.2,
                delay: 0.5,
                scrollTrigger: {
                    trigger: ".projectsContainer",
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                    once: true
                }
            }
        )
        projectCards.forEach(card => {
            const dateElement = card.querySelector(".figureDate")
            if (dateElement) {
                gsap.fromTo(
                    dateElement,
                    { text: "" },
                    {
                        text: dateElement.textContent || "",
                        duration: 1.5,
                        ease: "power1.out",
                        delay: 0.25,
                        scrollTrigger: {
                            trigger: dateElement,
                            start: "top 80%",
                            toggleActions: "play none none reverse",
                            once: true
                        }
                    }
                )
            }
        })
    }, [projectKeys])
    const [isClicked, setIsClicked] = useState(false)
    const HandleClickedButtons = () => {
        setIsClicked(true)
    }
    return (
        <section className="py-12 md:py-14 lg:py-16">
            <h2 className="text-center font-bold text-xl md:text-2xl lg:text-3xl">
                News <span>&</span> Projects
            </h2>
            <Container>
                <div className="flex items-center justify-center flex-col">
                    <div
                        className="projectsContainer mt-12 flex flex-wrap justify-center items-center gap-2 overflow-hidden">
                        {projectData &&
                            projectKeys.map(key => (
                                <ProjectCard key={key} project={projectData[key]} />
                            ))}
                    </div>
                    <div className="flex items-center justify-center mt-10 ">
                    <Link
                            className={cn(
                                "flex items-center justify-center transition-colors border-[1.50px] font-medium h-14 md:px-10 px-7 md:text-lg text-sm w-full rounded",
                                "bg-background text-foreground border-border hover:bg-gray-950 hover:text-muted",
                                "dark:bg-background dark:text-foreground dark:border-border dark:hover:bg-accent dark:hover:text-accent-foreground",
                                {
                                    "bg-accent text-accent-foreground dark:bg-accent dark:text-accent-foreground": isClicked
                                }
                            )}
                            href="/category"
                            onClick={HandleClickedButtons}
                        >
                            Explore All Projects
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Projects
