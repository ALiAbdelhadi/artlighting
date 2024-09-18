"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import Container from "@/app/components/Container";

interface Category {
    sectionType: string;
    _count: {
        _all: number;
    };
    image: string;
}

interface BalcomSectionProps {
    children: React.ReactNode;
    categories: Category[];
}
const BalcomSection: React.FC<BalcomSectionProps> = ({ children, categories }) => {
    const sectionRef = useRef<HTMLElement>(null);
    useEffect(() => {
        if (sectionRef.current) {
            gsap.fromTo(
                sectionRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 1 }
            );
        }
    }, []);
    return (
        <>
            {children}
            <section className="Indoor-lighting py-11 md:py-15 lg:py-19" ref={sectionRef}>
                <Container>
                    <h1 className="text-center text-3xl">Balcom</h1>
                    <div className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-4 justify-center items-center">
                        {categories.map((category) => (
                            <div key={category.sectionType} className="text-center">
                                <Link href={`/category/Balcom/${category.sectionType}`} scroll={true}>
                                    <div className="card">
                                        <Image
                                            src={category.image}
                                            alt={category.sectionType}
                                            width={475}
                                            height={475}
                                            className="rounded-md w-[500px] h-[290px]"
                                        />
                                        <h2 className="text-lg py-3 capitalize">{category.sectionType}</h2>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>
        </>
    );
};

export default BalcomSection;