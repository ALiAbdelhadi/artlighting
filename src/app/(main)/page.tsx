
import { ShowNewSelection } from "@/components/component/show-new-selection";
import { Fragment } from "react";
import Product from "./(pages)/Products/Products";
import Projects from "./(pages)/projects/Projects";
import LandingPage from "./(pages)/Landing/LandingPage";
import Brand from "./(pages)/Brand/Brand";
import About from "./(pages)/About/About";
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
