"use client";
import { TextHover } from "@/components/text-hover-effect";
import { Container } from "@repo/ui";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

function AboutLanding() {
  useEffect(() => {
    const image = document.querySelector(`.Image`);
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: image,
        start: "top 50%",
        end: "bottom 20%",
        scrub: 0.5,
      },
    });
    tl.to(image, { width: 2000 });
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      <div className={"py-24"}>
        <Container>
          <div className={"flex justify-center items-center flex-col"}>
            <div className="lg:h-screen h-[30rem] xl:mb-32 xl:-mt-44 lg:mb-28 lg:-mt-40 -mt-[150px]  flex items-center justify-center">
              <TextHover text="ART LIGHTING" />
            </div>
            <div>
              <Image
                className={"Image rounded-[40px]"}
                src="/factory.jpg"
                alt="factory Image"
                width={1000}
                height={1000}
              />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
}

export default AboutLanding;
