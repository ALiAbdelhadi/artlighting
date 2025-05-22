

import { ShowNewSelection } from "@/components/show-new-selection";
import { Fragment } from "react";
import About from "./(pages)/About/About";
import Brand from "./(pages)/Brand/Brand";
import { Cta } from "./(pages)/cta";
import Features from "./(pages)/features";
import LandingPage from "./(pages)/Landing/LandingPage";
import Product from "./(pages)/Products/Products";
import Projects from "./(pages)/projects/Projects";
function Home() {
  return (
    <Fragment>
      <LandingPage />
      <ShowNewSelection />
      <About />
      <Features />
      <Brand />
      <Projects />
      <Product />
      <Cta />
    </Fragment>
  );
}

export default Home;
