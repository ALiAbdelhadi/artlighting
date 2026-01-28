"use client";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/container"
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function NewCollection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const boxes = sectionRef.current.querySelectorAll(".animate-box");
    boxes.forEach((box) => {
      const badge = box.querySelector(".animate-badge");
      const image = box.querySelector(".animate-image");
      const text = box.querySelector(".animate-text");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: box,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
      if (badge) {
        tl.fromTo(
          badge,
          {
            opacity: 0,
            scale: 0.5,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "power1.inOut",
          },
        );
      }
      if (image) {
        tl.fromTo(
          image,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
          },
          "-=0.2",
        );
      }
      if (text) {
        tl.fromTo(
          text,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
          },
          "-=0.5",
        );
      }
    });
  }, []);
  const t = useTranslations('new-collection');
  return (
    <section ref={sectionRef} className="py-12 md:py-24 lg:py-32 " >
      <Container>
        <div className="flex md:flex-row flex-col md:rtl:flex-row-reverse items-start">
          <div className="w-full flex justify-between gap-2 flex-col md:mb-0 mb-20">
            <Link className="animate-box" href="/new-collection/spot">
              <div className="relative">
                <Image
                  width={500}
                  height={500}
                  alt="Line Up/Down LED Suspended Lamp"
                  className="object-cover w-full h-72 md:h-[500px]  rounded-lg animate-image"
                  src="/new-collection/new-collection-3.jpg"
                />
                <div
                  className={`py-2 px-4 select-none bg-[linear-gradient(90deg,transparent_0%,#ffb96914_90%)] inline-flex w-fit items-center whitespace-nowrap rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-secondary dark:text-secondary-foreground absolute top-0 right-0 mt-4 mr-4 shadow-lg backdrop-blur-[6px] overflow-hidden  `}
                >
                  <p className="overflow-hidden">{t('new')}</p>
                </div>
              </div>
              <div className="my-4 animate-text">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-muted-foreground font-bold uppercase">
                  {t('halo-lamp-title')}
                </h2>
                <p className="block mt-2 text-sm sm:text-base md:text-lg hover:underline">
                  {t('discover-more')}
                </p>
              </div>
            </Link>
            <Link className="animate-box" href="/new-collection/bollard">
              <div className="relative">
                <Image
                  width={500}
                  height={500}
                  alt="Line Up/Down LED Suspended Lamp"
                  className="object-cover w-full h-72 md:h-[500px] rounded-lg animate-image"
                  src="/new-collection/new-collection-2.jpg"
                />
                <div
                  className={`py-2 px-4 select-none backdrop-blur-sm inline-flex dark:text-secondary-foreground w-fit items-center whitespace-nowrap rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-secondary absolute top-0 right-0 mt-4 mr-4 shadow-lg overflow-hidden`}
                >
                  <p className="overflow-hidden">{t('new')}</p>
                </div>
              </div>
              <div className="my-4 animate-text absolute">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-muted-foreground font-bold uppercase">
                  {t('bollard-led')}
                </h2>
                <p className="block mt-2 text-sm sm:text-base md:text-lg hover:underline">
                  {t('discover-more')}
                </p>
              </div>
            </Link>
          </div>
          <Link
            className="w-full animate-box  md:mt-0 md:ml-10"
            href="/new-collection/track"
          >
            <div className="relative">
              <Image
                width={750}
                height={750}
                alt="Line Up/Down LED Suspended Lamp"
                className="object-cover w-full h-[550px] md:h-[650px] lg:h-[750px] rounded-lg animate-image"
                src="/new-collection/new-collection-1.jpg"
              />
              <div
                className={`py-2 px-4 select-none  bg-[linear-gradient(90deg,transparent_0%,#ffb96914_90%)] inline-flex dark:text-secondary-foreground w-fit items-center whitespace-nowrap rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-secondary absolute top-0 right-0 mt-4 mr-4 shadow-lg backdrop-blur-[6px] overflow-hidden  `}
              >
                <p className="overflow-hidden">{t('new')}</p>
              </div>
            </div>
            <div className="mt-4 animate-text">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-muted-foreground font-bold uppercase">
                {t('line-lamp-title')}
              </h2>
              <p className="block mt-2 text-sm sm:text-base md:text-lg hover:underline">
                {t('discover-more')}
              </p>
            </div>
          </Link>
        </div>
      </Container>
    </section>
  );
}
