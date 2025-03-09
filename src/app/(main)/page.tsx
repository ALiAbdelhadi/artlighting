import About from "@/app/(main)/(pages)/About/About";
import Brand from "@/app/(main)/(pages)/Brand/Brand";
import LandingPage from "@/app/(main)/(pages)/Landing/LandingPage";
import { ShowNewSelection } from "@/components/component/show-new-selection";
import { Fragment } from "react";
import Product from "./(pages)/Products/Products";
import Projects from "./(pages)/projects/Projects";

function Home() {
  return (
    <Fragment>
      <LandingPage />
      <ShowNewSelection />
      <About />
      <Brand />
      <Projects />
      <Product />
    </Fragment>
  );
}

export default Home;
