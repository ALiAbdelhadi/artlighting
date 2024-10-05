'use client'
import Container from "@/app/components/Container";
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
                scrub: 0.5
            }
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
                        <div className={"flex justify-center items-center sm:w-[70%] mx-[auto] my-[20px]"}>
                            <h1 className={"xl:text-7xl lg:text-5xl md:text-3xl sm:text-xl  font-medium tracking-[0.1px] leading-[1.3em] -mt-[50px] space-y-2"}>At Art Lighting, where <span className="inline bg-[linear-gradient(45deg,_#4c4d50,_#beceef,_#ffd181)] rounded-[6px] px-[7px] py-[6px]">Lighting</span> Becomes
                                an <span className="inline bg-[linear-gradient(45deg,_#4c4d50,_#beceef,_#ffd181)] rounded-[6px] px-[7px] py-[6px]">Art</span></h1>
                        </div>
                        <div>
                            <Image className={"Image rounded-[40px]" } src="/factory.jpg" alt="factory Image" quality={100}
                                width={1000} height={1000} />
                        </div>
                    </div>
                </Container>
            </div>
        </>
    );
}

export default AboutLanding;