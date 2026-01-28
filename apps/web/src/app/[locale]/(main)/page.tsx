import { NewCollection } from "@/components/new-collection";
import { PagePropsTypes } from "@/types";
import About from "./(pages)/about";
import Brand from "./(pages)/brands";
import Cta from "./(pages)/cta";
import Features from "./(pages)/features";
import LandingPage from "./(pages)/landing-section";
import ProductsSection from "./(pages)/products/products-section";
import ProjectsSection from "./(pages)/projects/project-section";



export default async function MainPage({ params }: PagePropsTypes) {
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