"use client";
import gsap from "gsap";
import React, { useEffect, useRef } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./Landing.module.css";

export type LandingProps = {
    images: string[],
}

const Landing: React.FC<LandingProps> = ({ images }) => {
    const textRef = useRef(null);
    const carouselRef = useRef(null);
    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(textRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1 })
            .fromTo(carouselRef.current, { opacity: 0 }, { opacity: 1, duration: 1, delay: 0.2 }, "-=0.5");
    }, []);

    return (
        <section className={`${styles.landing} relative `}>
            <div className={styles.carouselContainer} ref={carouselRef}>
                <Carousel
                    showThumbs={false}
                    showStatus={false}
                    infiniteLoop
                    autoPlay
                    interval={5000}
                    transitionTime={1000}
                    stopOnHover={false}
                >
                    {images.map((src, index) => (
                        <div key={index}>
                            <img src={src} alt={`Slide ${index + 1}`} className={styles.img} />
                        </div>
                    ))}
                </Carousel>
            </div>
        </section>
    );
}

export default Landing;
