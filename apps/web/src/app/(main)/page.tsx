import { NewCollection } from "@/components/new-collection";
import About from "./(pages)/about";
import Brand from "./(pages)/brands";
import Cta from "./(pages)/cta";
import Features from "./(pages)/features";
import LandingPage from "./(pages)/landing-section";
import ProductsSection from "./(pages)/products/products-section";
import Projects from "./(pages)/projects";

export default function MainPage() {
    return (
        <>
            <LandingPage />
            <NewCollection />
            <About />
            <Features />
            <Brand />
            <Projects />
            <ProductsSection />
            <Cta />
        </>
    );
}