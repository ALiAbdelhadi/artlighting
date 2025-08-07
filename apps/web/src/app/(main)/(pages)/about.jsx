"use client";
import { Container } from "@repo/ui";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  useEffect(() => {
    const elements = sectionRef.current.querySelectorAll(".animate-element");
    const timelineElements =
      sectionRef.current.querySelectorAll(".animate-timeline");
    elements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "top 60%",
            scrub: true,
            once: true,
          },
        },
      );
    });
    timelineElements.forEach((element) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          x: -50,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            end: "top 70%",
            scrub: true,
            once: true,
          },
        },
      );
    });
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-12 md:py-24 lg:py-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_500px]">
          <div className="grid gap-4">
            <div className="space-y-4 animate-element">
              <h2 className="font-bold tracking-tighter text-3xl sm:text-4xl md:text-5xl">
                About Our Company
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                At Art Lighting Inc. we are a team of passionate innovators
                dedicated to pushing the boundaries of what&apos;s possible.
                Since our founding in 2010, we&apos;ve been on a mission to
                create cutting-edge products and services that transform the way
                people live and work.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-lg p-6 animate-element">
                <h3 className="text-lg font-semibold text-primary">
                  Our Mission
                </h3>
                <p className="text-muted-foreground mt-2">
                  To revolutionize the tech industry and empower people with
                  innovative solutions.
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-6 animate-element">
                <h3 className="text-lg font-semibold text-primary">
                  Our Values
                </h3>
                <p className="text-muted-foreground mt-2">
                  Integrity, Collaboration, Creativity, and Continuous
                  Improvement.
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-6 animate-element">
                <h3 className="text-lg font-semibold text-primary">Our Team</h3>
                <p className="text-muted-foreground mt-2">
                  A diverse group of talented individuals who are passionate
                  about making a difference.
                </p>
              </div>
              <div className="bg-muted/50 rounded-lg p-6 animate-element">
                <h3 className="text-lg font-semibold text-primary">
                  Our Commitment
                </h3>
                <p className="text-muted-foreground mt-2">
                  To deliver exceptional products and services that exceed our
                  customers&apos; expectations.
                </p>
              </div>
            </div>
          </div>
          <div className="relative animate-element">
            <div className="after:absolute after:inset-y-0 after:w-px after:bg-gray-500/20 relative pl-6 after:left-0 grid gap-10">
              <div className="grid grid-cols-[auto_1fr] gap-1 text-sm relative animate-timeline">
                <div className="mt-[3px] aspect-square w-3 bg-primary rounded-full z-10 " />
                <div className="font-medium mt-[-1px]">
                  2010 - Founding of Art Lighting Inc.
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-1 text-sm relative animate-timeline">
                <div className="mt-[3px] aspect-square w-3 bg-primary rounded-full z-10 " />
                <div className="font-medium mt-[-1px]">
                  2010 - Launch of First Product
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-1 text-sm relative animate-timeline">
                <div className="mt-[3px] aspect-square w-3 bg-primary rounded-full z-10 " />
                <div className="font-medium mt-[-1px]">
                  2012 - Expansion into New Markets
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-1 text-sm relative animate-timeline">
                <div className="mt-[3px] aspect-square w-3 bg-primary rounded-full z-10 " />
                <div className="font-medium mt-[-1px]">
                  2013 - Breakthrough Innovation
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-1 text-sm relative animate-timeline">
                <div className="mt-[3px] aspect-square w-3 bg-primary rounded-full z-10 " />
                <div className="font-medium mt-[-1px]">
                  2014 - Local Expansion and Acquisition
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-1 text-sm relative animate-timeline">
                <div className="mt-[3px] aspect-square w-3 bg-primary rounded-full z-10 " />
                <div className="font-medium mt-[-1px]">
                  2015 - Sustainability Initiatives
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-1 text-sm relative animate-timeline">
                <div className="mt-[3px] aspect-square w-3 bg-primary rounded-full z-10 " />
                <div className="font-medium mt-[-1px]">
                  2016 - Art Lighting Inc. Goes Public
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-1 text-sm relative animate-timeline">
                <div className="mt-[3px] aspect-square w-3 bg-primary rounded-full z-10 " />
                <div className="font-medium mt-[-1px]">
                  2016 - Art Lighting Working with Military{" "}
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-1 text-sm relative animate-timeline">
                <div className="mt-[3px] aspect-square w-3 bg-primary rounded-full z-10 " />
                <div className="font-medium mt-[-1px]">
                  2020 - Pandemic Response and Resilience
                </div>
              </div>
              <div className="grid grid-cols-[auto_1fr] gap-1 text-sm relative animate-timeline">
                <div className="mt-[3px] aspect-square w-3 bg-primary rounded-full z-10 " />
                <div className="font-medium mt-[-1px]">
                  2023 - Our Factory completed
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}