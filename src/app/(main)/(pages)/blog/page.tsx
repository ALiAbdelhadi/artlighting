import { constructMetadata } from "@/lib/utils";
import BlogContent from "./BlogContent";
export const metadata = constructMetadata({
  title: "Blog",
  description:
    "Know About Our Latest News In New Arrivals Products, Events in  egypt and in china ",
});

const page = () => {
  return <BlogContent />;
};

export default page;
