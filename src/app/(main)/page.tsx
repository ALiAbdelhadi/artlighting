

import { Fragment } from "react";
import Product from "./(pages)/Products/Products";
import Projects from "./(pages)/projects/Projects";
import LandingPage from "./(pages)/Landing/LandingPage";
import Brand from "./(pages)/Brand/Brand";
import About from "./(pages)/About/About";
import { ShowNewSelection } from "@/components/show-new-selection"
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
