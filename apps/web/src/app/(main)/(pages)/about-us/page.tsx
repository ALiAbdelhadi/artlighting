import Breadcrumb from "@/components/breadcrumb/custom-breadcrumb";
import { constructMetadata } from "@/lib/utils";
import AboutLanding from "./about-landing/about-landing";
import Achievements from "./achievements/achievements";
import Mission from "./mission-vision/mission-vision";
import Product from "./product/product";
const AboutUsPage = () => {
  return (
    <div>
      <Breadcrumb />
      <AboutLanding />
      <Achievements />
      <Mission />
      <Product />
    </div>
  );
};
export const metadata = constructMetadata({
  title: "About Us - Art lighting | Your Lighting Store",
  description: "About our Company, what we serve , Mission and Vision",
});
export default AboutUsPage;
