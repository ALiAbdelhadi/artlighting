"use client";
import Container from "@/app/components/Container";
import ProjectCard from "@/app/components/ProjectCard.tsx";
import { cn } from "@/lib/utils";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./projects.module.css";

const Projects = () => {
  const [projectData, setProjectData] = useState({});
  const [projectKeys, setProjectKeys] = useState([]);

  useEffect(() => {
    const data = {
      "dar-misr": {
        ProjectId: "dar-misr",
        ProjectName: "Dar-Misr",
        ProjectDate: "10 / May / 2018",
        ProjectImages: ["/projects/dar-misr/dar-misr-1.png"],
        ProjectDescription: "Dar-Misr is a real estate compound ",
      },
      tolip: {
        ProjectId: "tolip",
        ProjectName: "Tolip Hotel",
        ProjectDate: "10 / June / 22",
        ProjectImages: ["/projects/tolip/tolip-1.jpg"],
        ProjectDescription:
          "Tolip Hotel El Galaa is a luxurious establishment located in Cairo, Egypt.",
      },
      "al-majd": {
        ProjectId: "al-majd",
        ProjectName: " Al-Majd Conference Center In Alexandria",
        ProjectDate: "10 / Dec / 23",
        ProjectImages: ["/projects/al-majd/al-majd-1.jpg"],
        ProjectDescription: "Al-Majd Conference Center in Alexandria.",
      },
    };
    setProjectData(data);
    setProjectKeys(Object.keys(data));
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, TextPlugin);
    const projectCards = gsap.utils.toArray(".projectCard");
    const secondProjectCard = projectCards[1];
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
          once: true,
        },
      },
    );
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
          once: true,
        },
      },
    );
    projectCards.forEach((card) => {
      const dateElement = card.querySelector(".figureDate");
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
              once: true,
            },
          },
        );
      }
    });
  }, [projectKeys]);
  const [isClicked, setIsClicked] = useState(false);
  const HandleClickedButtons = () => {
    setIsClicked(true);
  };
  return (
    <section className="py-12 md:py-14 lg:py-16">
      <h2 className="font-bold text-2xl md:text-3xl tracking-tight text-center">
        News <span>&</span> Projects
      </h2>
      <Container>
        <div className="flex items-center justify-center flex-col">
          <div className="projectsContainer mt-12 flex flex-wrap lg:flex-nowrap justify-center items-center gap-4 overflow-hidden w-full">
            {projectData &&
              projectKeys.map((key) => (
                <ProjectCard key={key} project={projectData[key]} />
              ))}
          </div>
          <div className="flex items-center justify-center mt-10 w-full max-w-[400px]">
            <Link
              className={cn(
                "flex items-center justify-center transition-colors border-[1.5px] font-medium h-12 md:h-14 px-7 md:px-10 text-sm md:text-lg rounded",
                "bg-background text-foreground border-border hover:bg-gray-950 hover:text-muted hover:border-gray-950",
                "dark:bg-background dark:text-foreground dark:border-border dark:hover:bg-accent dark:hover:text-accent-foreground",
                {
                  "bg-accent text-accent-foreground dark:bg-accent dark:text-accent-foreground border-gray-950":
                    isClicked,
                },
              )}
              href="/all-projects"
              onClick={HandleClickedButtons}
            >
              Explore All Projects
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Projects;
