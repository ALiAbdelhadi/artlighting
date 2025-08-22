import { NewCollection } from "@/components/new-collection";
import About from "./(pages)/about";
import Brand from "./(pages)/brands";
import Cta from "./(pages)/cta";
import Features from "./(pages)/features";
import ProductsSection from "./(pages)/products/products-section";
import LandingPage from "./(pages)/landing-section";
import ProjectsSection from "./(pages)/projects/project-section";

interface PageProps {
    params: Promise<{
        locale: string;
    }>;
}


export default async function MainPage({ params }: PageProps) {
    return (
        <>
            <LandingPage />
            <NewCollection />
            <About />
            <Features />
            <Brand />
            <ProjectsSection params={params} />
            <ProductsSection params={params} />
            <Cta />
        </>
    );
}