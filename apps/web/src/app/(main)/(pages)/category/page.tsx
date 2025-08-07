import { constructMetadata } from "@/lib/utils";
import CategoryContent from "./category-content";
const page = () => {
  return <CategoryContent />;
};
export const metadata = constructMetadata({
  title:
    "Explore All lighting Brands that give a solution of every lighting situation (Balcom | Mister Led | Jetra  )",
  description:
    "Elevate your space with Art Lighting. Our curated collection of lighting solutions caters to every style and need. Whether you're looking to create a cozy ambiance or illuminate a large area, we have the perfect lighting fixture for you. Shop now and discover the difference quality lighting can make.",
});

export default page;
