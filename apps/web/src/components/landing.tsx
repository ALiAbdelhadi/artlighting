"use client"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import type React from "react"
import { useEffect, useRef } from "react"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

gsap.registerPlugin(ScrollTrigger)

export type LandingProps = {
  images: string[]
}

const Landing = ({ images }: LandingProps) => {
  const textRef = useRef(null);
  const carouselRef = useRef(null);
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1 },
    ).fromTo(
      carouselRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, delay: 0.2 },
      "-=0.5",
    );
  }, []);
  return (
    <section className="relative">
      <div className="relative w-full" dir="ltr">
        <Carousel
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          autoPlay
          interval={5000}
          transitionTime={700}
          stopOnHover={false}
        >
          {images.map((src, index) => (
            <div key={index}>
              <Image
                width={1450}
                height={850}
                src={src || "/placeholder.svg"}
                alt={`Slide ${index + 1}`}
                className="image object-fill h-[280px] sm:h-[500px] md:h-[600px] lg:h-[850px] w-full"
                loading="lazy"
              />
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  )
}

export default Landing
