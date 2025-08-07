"use client"

import { BentoGridItem } from "@/components/bento-grid-item"
import { Container } from "@repo/ui"
import { cn } from "@repo/ui/lib/utils"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { TextPlugin } from "gsap/TextPlugin"
import Link from "next/link"
import { useEffect, useState } from "react"

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

export default function Projects() {
  const [projectData, setProjectData] = useState<{ [key: string]: Project }>({})
  const [projectKeys, setProjectKeys] = useState<string[]>([])

  useEffect(() => {
    const data = {
      "dar-misr": {
        ProjectId: "dar-misr",
        ProjectName: "Dar-Misr",
        ProjectDate: "10 / May / 2018",
        ProjectImages: [
          "/projects/dar-misr/dar-misr-1.png",
          "/projects/dar-misr/dar-misr-2.jpg",
          "/projects/dar-misr/dar-misr-3.webp",
        ],
        ProjectDescription: "Dar-Misr is a real estate compound.",
        ProjectInfor:
          "Dar Misr is a prominent housing project initiated by the Egyptian Ministry of Housing, aiming to provide 150,000 high-quality residential units for middle-income citizens across various new cities in Egypt.",
        ProjectInfor2:
          "The project is being executed in four phases, offering units with areas ranging from 100 to 150 square meters. Each unit features a distinctive architectural design and superior finishing standards, ensuring a contemporary living experience. Our company contributed to this project by supplying advanced lighting solutions that enhance the aesthetic appeal and functionality of the residential spaces.",
        usedProducts: "/category/balcom/indoor/family900",
      },
      tolip: {
        ProjectId: "tolip",
        ProjectName: "Tolip Hotel",
        ProjectDate: "10 / June / 22",
        ProjectImages: ["/projects/tolip/tolip-1.jpg"],
        ProjectDescription: "Tolip Hotel El Galaa is a luxurious establishment located in Cairo, Egypt.",
        ProjectInfor:
          "The hotel comprises three buildings, each five stories high, encompassing a total of 179 rooms. Each room is designed with a blend of modern interiors and classic touches, offering a unique living style with sizes ranging from 38 to 65 square meters. The rooms are equipped with panoramic windows or balconies, air conditioning, mini-bars, and flat-screen TVs with satellite channels.",
        ProjectInfor2:
          "Our company provided state-of-the-art lighting solutions to enhance the ambiance and guest experience throughout the hotel's various facilities.",
        usedProducts: "/category/indoor/linear",
      },
      "al-majd": {
        ProjectId: "al-majd",
        ProjectName: "Al-Majd Conference Center in Alexandria",
        ProjectDate: "10 / Dec / 23",
        ProjectImages: ["/projects/al-majd/al-majd-1.jpg"],
        ProjectDescription: "Al-Majd Conference Center in Alexandria.",
        ProjectInfor:
          "The Al-Majd Conference Center in Alexandria is a premier venue designed to host a variety of events, including conferences, seminars, and workshops.",
        ProjectInfor2:
          "The center boasts modern architecture and is equipped with state-of-the-art facilities to accommodate both local and international gatherings. Our lighting solutions were implemented to ensure optimal illumination, creating an inviting atmosphere for all attendees.",
        usedProducts: "/category/balcom/indoor/family900",
      },
      "mansoura-hospital": {
        ProjectId: "mansoura-hospital",
        ProjectName: "Mansoura Fever Hospital",
        ProjectDate: "10 / Oct / 20",
        ProjectImages: [
          "/projects/mansoura-hospital/mansoura-hospital-2.png",
          "/projects/mansoura-hospital/mansoura-hospital-1.png",
          "/projects/mansoura-hospital/mansoura-hospital-4.png",
          "/projects/mansoura-hospital/mansoura-hospital-3.png",
        ],
        ProjectDescription: "Mansoura Fever Hospital.",
        ProjectInfor:
          "Mansoura Fever Hospital is a specialized medical facility dedicated to diagnosing and treating infectious diseases. Located in Mansoura, Egypt, the hospital is equipped with advanced medical technologies and staffed by a team of experienced healthcare professionals.",
        ProjectInfor2:
          "To support the hospital's mission of providing exceptional patient care, our company installed high-quality lighting systems that meet medical standards, ensuring a safe and comfortable environment for both patients and staff.",
        usedProducts: "/category/indoor/linear",
      },
      "esna-hospital": {
        ProjectId: "esna-hospital",
        ProjectName: "Esna Hospital",
        ProjectDate: "10 / June / 22",
        ProjectImages: [
          "/projects/esna-hospital/esna-hospital-1.jpg",
          "/projects/esna-hospital/esna-hospital-4.jpg",
          "/projects/esna-hospital/esna-hospital-2.webp",
          "/projects/esna-hospital/esna-hospital-3.jpg",
        ],
        ProjectDescription: "Esna Hospital serves the community of Esna by offering a wide range of medical services.",
        ProjectInfor: "Esna Hospital serves the community of Esna by offering a wide range of medical services.",
        ProjectInfor2:
          "The hospital is designed to cater to various healthcare needs, featuring multiple departments and specialized units. Our lighting installations were carefully selected to provide adequate illumination across all areas, enhancing visibility and contributing to the overall well-being of patients and healthcare providers.",
        usedProducts: "/category/indoor/linear",
      },

      "al-galala-resort": {
        ProjectId: "al-galala-resort",
        ProjectName: "Al-Galala Resort",
        ProjectDate: "10 / Nov / 19",
        ProjectImages: [
          "/projects/al-galala-resort/al-galala-resort-1.jpg",
          "/projects/al-galala-resort/al-galala-resort-2.jpg",
          "/projects/al-galala-resort/al-galala-resort-3.jpg",
          "/projects/al-galala-resort/al-galala-resort-4.jpg",
        ],
        ProjectDescription: "Al-Galala Resort is a luxurious destination situated along the Red Sea.",
        ProjectInfor:
          "Al-Galala Resort offers visitors a blend of relaxation and adventure with upscale accommodations, recreational facilities, and breathtaking sea views.",
        ProjectInfor2:
          "Our company was responsible for implementing lighting designs that highlight the resort's architectural beauty, create inviting outdoor spaces, and ensure guests have an unforgettable experience during their stay.",
        usedProducts: "/category/indoor/linear",
      },
      "almaza-park": {
        ProjectId: "almaza-park",
        ProjectName: "Almaza Park",
        ProjectDate: "19 / July / 23",
        ProjectImages: ["/projects/almaza-park/almaza-park-1.jpg", "/projects/almaza-park/almaza-park-2.jpg"],
        ProjectDescription:
          "Almaza Park is a premier mixed-use development that combines luxury Flood light And bollard.",
        ProjectInfor:
          "Almaza Park is designed as a modern oasis integrating residential, commercial, and recreational areas. With a focus on sustainability and innovative architecture, the project offers upscale amenities and beautifully landscaped, Flood light, bollard, uplight surroundings to create a vibrant community environment.",
        ProjectInfor2:
          "Our company played a key role in enhancing the project's aesthetic appeal by delivering cutting-edge lighting solutions. These installations accentuate the elegant design while ensuring energy efficiency and a welcoming atmosphere throughout the development.",
        usedProducts: "/category/indoor/linear",
      },
      "al-galala-university": {
        ProjectId: "al-galala-university",
        ProjectName: "Al-Galala University",
        ProjectDate: "10 / November / 19",
        ProjectImages: [
          "/projects/al-galala-university/al-galala-university-2.jpg",
          "/projects/al-galala-university/al-galala-university-1.jpg",
          "/projects/al-galala-university/al-galala-university-3.jpg",
          "/projects/al-galala-university/al-galala-university-4.jpg",
        ],
        ProjectDescription: "The Al-Galala University project ",
        ProjectInfor:
          "The Al-Galala University project features a state-of-the-art lighting system that ensures energy efficiency, enhanced visibility, and safety across the campus. The project incorporates smart LED solutions and modern design elements that highlight the architectural character of the university, making it a benchmark in contemporary educational environments.",
        ProjectInfor2: "",
        usedProducts: "",
      },
      "al-mynia-university": {
        ProjectId: "al-mynia-university",
        ProjectName: "Al-Mynia University",
        ProjectDate: "10 / November / 19",
        ProjectImages: [
          "/projects/al-mynia-university/al-mynia-university-1.jpg",
          "/projects/al-mynia-university/al-mynia-university-2.jpg",
        ],
        ProjectDescription: "The Al-Mynia University project ",
        ProjectInfor:
          "The Al-Mynia University project delivers a complete lighting experience that enhances the academic environment through modern lighting technologies and smart control systems. This project contributes to creating a safe and inspiring educational atmosphere, with a strong focus on sustainability and high-quality standards. ",
        ProjectInfor2: "",
        usedProducts: "",
      },
      "alkaraz": {
        ProjectId: "alkaraz",
        ProjectName: "Al-Karaz",
        ProjectDate: "10 / November / 19",
        ProjectImages: ["/projects/alkaraz/alkaraz-1.jpg", "/projects/alkaraz/alkaraz-2.jpg"],
        ProjectDescription: "The Al-Karaz project",
        ProjectInfor:
          "The Al-Karaz project exemplifies a design that merges functionality with aesthetics. Advanced lighting systems highlight the architectural features of the building, achieving a balance between efficiency and innovation. This project is a prime example of modern lighting solutions. ",
        ProjectInfor2: "",
        usedProducts: "",
      },
      "auc-university": {
        ProjectId: "auc-university",
        ProjectName: "AUC University",
        ProjectDate: "10 / November / 19",
        ProjectImages: [
          "/projects/auc-university/auc-university-1.jpg",
          "/projects/auc-university/auc-university-2.jpg",
          "/projects/auc-university/auc-university-3.jpg",
        ],
        ProjectDescription: "The AUC University project is designed to meet international quality of learning",
        ProjectInfor:
          "The AUC University project is designed to meet international quality  standards by integrating smart technologies with advanced LED systems to enhance the beauty of the campus while preserving its rich architectural heritage. This project reflects a harmonious blend of modern design with tradition. ",
        ProjectInfor2: "",
        usedProducts: "",
      },
    }
    setProjectData(data)
    // Limit to the first 8 project keys
    setProjectKeys(Object.keys(data).slice(0, 8))
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger, TextPlugin)

      const projectCards = gsap.utils.toArray(".bento-grid-item") as HTMLElement[]

      gsap.fromTo(
        projectCards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".projectsContainer",
            start: "top 80%",
            toggleActions: "play none none reverse",
            once: true,
          },
        },
      )

      projectCards.forEach((card: HTMLElement) => {
        const dateElement = card.querySelector(".figureDate")
        if (dateElement) {
          gsap.fromTo(
            dateElement,
            { text: "" },
            {
              text: dateElement.textContent || "",
              duration: 1,
              ease: "power1.out",
              delay: 0.2,
              scrollTrigger: {
                trigger: dateElement,
                start: "top 90%",
                toggleActions: "play none none reverse",
                once: true,
              },
            },
          )
        }
      })
    }
  }, [projectKeys])

  const [isClicked, setIsClicked] = useState(false)

  const HandleClickedButtons = () => {
    setIsClicked(true)
  }

  const getGridSpanClasses = (index: number) => {
    const patterns = [
      "md:col-span-2 md:row-span-2",
      "md:col-span-1 md:row-span-1",
      "md:col-span-1 md:row-span-1",
      "md:col-span-2 md:row-span-1",
      "md:col-span-1 md:row-span-1",
      "md:col-span-1 md:row-span-1",
      "md:col-span-1 md:row-span-1",
      "md:col-span-1 md:row-span-1",
    ]
    return patterns[index % patterns.length]
  }

  return (
    <section className="py-12 md:py-14 lg:py-16">
      <Container>
        <div className="text-center mb-12">
          <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-4">
            News <span className="text-primary">&</span> Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We showcase a variety of projects that highlight our expertise and creativity in lighting solutions across
            different sectors.
          </p>
        </div>
        <div className="flex items-center justify-center flex-col">
          <div className="projectsContainer grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full auto-rows-[minmax(250px,auto)]">
            {projectData &&
              projectKeys.map((key, index) => (
                <BentoGridItem
                  key={key}
                  project={projectData[key]}
                  className={cn("bento-grid-item", getGridSpanClasses(index))}
                />
              ))}
          </div>
          <div className="flex items-center justify-center mt-10">
            <Link
              className={cn(
                "flex items-center justify-center transition-colors border-[1.5px] font-medium h-14 md:px-10 px-7 md:text-lg text-sm w-full rounded",
                "bg-background text-foreground border-border hover:bg-gray-950 hover:text-muted hover:border-gray-950",
                "dark:bg-background dark:text-foreground dark:border-border dark:hover:bg-accent dark:hover:text-accent-foreground",
                {
                  "bg-accent text-accent-foreground dark:bg-accent dark:text-accent-foreground border-gray-950":
                    isClicked,
                }
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
  )
}
