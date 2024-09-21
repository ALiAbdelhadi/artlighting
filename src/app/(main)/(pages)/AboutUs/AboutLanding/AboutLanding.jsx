'use client'
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import styles from "./aboutLanding.module.css"
import Image from "next/image";
import Container from "@/app/components/Container";


gsap.registerPlugin(ScrollTrigger);

function AboutLanding() {
    useEffect(() => {
        const image = document.querySelector(`.${styles.Image}`);
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
            <div className={styles.AboutLanding}>
                <Container>
                    <div className={styles.AboutContent}>
                        <div className={styles.textContainer}>
                            <h1 className={styles.heading}>At Art Lighting, where <span>Lighting</span> becomes
                                an <span>Art</span></h1>
                        </div>
                        <div className={styles.ImageContainer}>
                            <Image className={styles.Image} src="/factory.jpg" alt="factory Image" quality={100}
                                width={1000} height={1000} />
                        </div>
                    </div>
                </Container>
            </div>
        </>
    );
}

export default AboutLanding;