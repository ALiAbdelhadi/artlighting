"use client"
import {useEffect, useRef} from 'react';
import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import Link from "next/link";
import styles from "./show-new-selection.module.css"
import Container from '@/app/components/Container';

gsap.registerPlugin(ScrollTrigger);

export function ShowNewSelection() {
    const sectionRef = useRef(null);

    useEffect(() => {
        const boxes = sectionRef.current.querySelectorAll('.animate-box');
        const buttons = sectionRef.current.querySelectorAll('.animate-button');
        boxes.forEach((box) => {
            const button = box.querySelector('.animate-button');
            const image = box.querySelector('.animate-image');
            const text = box.querySelector('.animate-text');
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: box,
                    start: 'top 80%',
                    end: 'top 60%',
                }
            });
            tl.fromTo(button, {
                opacity: 0,
                scale: 0.5,
            }, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "power1.inOut",
            })
                .fromTo(image, {
                    opacity: 0,
                    y: 20,
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                }, "-=0.2")
                .fromTo(text, {
                    opacity: 0,
                    y: 20,
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                }, "-=0.5");
        });
        buttons.forEach((button) => {
            gsap.to(button, {
                boxShadow: "0 0 10px 5px rgba(255, 184, 105, 0.2)",
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                scrollTrigger: {
                    trigger: button,
                    start: 'top 80%',
                    end: 'top 60%',
                }
            });
        });
    }, []);
    return (
        <section ref={sectionRef} className="py-12 md:py-24 lg:py-32 ">
            <Container>
                <div className='flex md:flex-row flex-col  items-start'>
                    <div className='w-full flex justify-between flex-col md:mb-0 mb-20'>
                        <div className="animate-box">
                            <div className="relative">
                                <img
                                    alt="Line Up/Down LED Suspended Lamp"
                                    className="object-cover w-full h-54  md:h-[500px] rounded-lg animate-image"
                                    src="/NewCollection/new-collection-3.jpg"
                                />
                                <div
                                    className={`${styles.animateButton} select-none  bg-[linear-gradient(90deg,_transparent_0%,_#ffb96914_90%)] inline-flex w-fit items-center whitespace-nowrap rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-secondary dark:text-secondary-foreground absolute top-0 right-0 mt-4 mr-4 shadow-lg backdrop-blur-[6px] overflow-hidden  `}>
                                    <p className='overflow-hidden'>
                                        NEW
                                    </p>
                                </div>
                            </div>
                            <div className="my-4 animate-text">
                                <h2 className="text-sm md:text-2xl lg:text-3xl font-bold uppercase">
                                    Halo — LED Ring Suspended Lamp
                                </h2>
                                <Link scroll={true} className="block mt-2 text-sm md:text-xl" href="Collection/spot">
                                    Discover more
                                </Link>
                            </div>
                        </div>
                        <div className="animate-box ">
                            <div className="relative">
                                <img
                                    alt="Line Up/Down LED Suspended Lamp"
                                    className="object-cover w-full h-55 md:h-[500px] rounded-lg animate-image"
                                    src="/NewCollection/new-collection-2.jpg"
                                />
                                <div
                                    className={`${styles.animateButton} select-none backdrop-filter backdrop-saturate-[0.8]  !bg-[radial-gradient(rgba(0,_0,_0,_.12)_0,_rgba(255,_255,_255,_.12)_100%)] inline-flex text-[#fff] dark:text-secondary-foreground w-fit items-center whitespace-nowrap rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-secondary absolute top-0 right-0 mt-4 mr-4 shadow-lg backdrop-blur-[12px] overflow-hidden  `}>
                                    <p className='overflow-hidden'>
                                        NEW
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 animate-text absolute">
                                <h2 className="text-sm md:text-3xl lg:text-4xl font-bold uppercase">
                                    Halo — LED Ring Suspended Lamp
                                </h2>
                                <Link scroll={true} className="block mt-2 text-sm md:text-2xl" href="Collection/hallo">
                                    Discover more
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="w-full animate-box  md:mt-0 md:ml-10">
                        <div className="relative">
                            <img
                                alt="Line Up/Down LED Suspended Lamp"
                                className="object-cover w-full h-auto md:h-[500px] lg:h-[750px] rounded-lg animate-image"
                                src="/NewCollection/new-collection-1.jpg"
                            />
                            <div
                                className={`${styles.animateButton}  select-none  bg-[linear-gradient(90deg,_transparent_0%,_#ffb96914_90%)] inline-flex text-[#FFF] dark:text-secondary-foreground w-fit items-center whitespace-nowrap rounded-full border text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-secondary absolute top-0 right-0 mt-4 mr-4 shadow-lg backdrop-blur-[6px] overflow-hidden  `}>
                                <p className='overflow-hidden'>
                                    NEW
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 animate-text">
                            <h2 className="text-sm md:text-2xl lg:text-3xl font-bold uppercase">
                                Line — Up/Down LED Suspended Lamp
                            </h2>
                            <Link scroll={true} className="block mt-2 text-sm md:text-xl" href="Collection/track">
                                Discover more
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
